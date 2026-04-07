/**
 * Post-build CSP hash generator.
 *
 * Astro emits inline <script> and <style> tags for island hydration that
 * cannot be externalised. A strict CSP without 'unsafe-inline' requires
 * SHA-256 hashes of each inline block. This script extracts those hashes
 * and injects a <meta http-equiv="Content-Security-Policy"> tag into every
 * built HTML file.
 *
 * See docs/adr/001-csp-hash-strategy.md for full rationale.
 */

import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = new URL("../dist", import.meta.url).pathname;

function sha256(content) {
	return createHash("sha256").update(content, "utf8").digest("base64");
}

function extractHashes(html, tagName) {
	const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "g");
	const hashes = [];
	let match;
	match = regex.exec(html);
	while (match !== null) {
		const content = match[1].trim();
		if (content && !match[0].includes("src=") && !match[0].includes('type="application/ld+json"')) {
			hashes.push(`'sha256-${sha256(content)}'`);
		}
		match = regex.exec(html);
	}
	return hashes;
}

async function findHtmlFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true, recursive: true });
	return entries
		.filter((e) => e.isFile() && e.name.endsWith(".html"))
		.map((e) => join(e.parentPath ?? e.path, e.name));
}

async function processFile(filePath) {
	const html = await readFile(filePath, "utf8");

	const scriptHashes = extractHashes(html, "script");
	const styleHashes = extractHashes(html, "style");

	const scriptSrc = ["'self'", ...scriptHashes].join(" ");
	const styleSrc = ["'self'", ...styleHashes].join(" ");

	const csp = [
		`default-src 'self'`,
		`script-src ${scriptSrc}`,
		`style-src ${styleSrc}`,
		`font-src 'self'`,
		`img-src 'self' data:`,
		`connect-src 'self'`,
	].join("; ");

	const metaTag = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;

	if (html.includes('http-equiv="Content-Security-Policy"')) {
		const updated = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, metaTag);
		await writeFile(filePath, updated);
	} else {
		const updated = html.replace("<head>", `<head>\n    ${metaTag}`);
		await writeFile(filePath, updated);
	}

	console.log(`CSP injected: ${filePath}`);
	console.log(`  script hashes: ${scriptHashes.length}`);
	console.log(`  style hashes: ${styleHashes.length}`);
}

const files = await findHtmlFiles(DIST);
if (files.length === 0) {
	console.error("No HTML files found in dist/");
	process.exit(1);
}

await Promise.all(files.map(processFile));
console.log(`Done — ${files.length} file(s) processed.`);
