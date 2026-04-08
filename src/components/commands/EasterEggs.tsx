import { commands } from "@/content/data";

export function SudoOutput() {
	return <p className="text-red">nice try. 🔒</p>;
}

export function LsOutput() {
	const entries = Object.keys(commands).map((cmd) => {
		const name = cmd.replace("/", "");
		return `drwxr-xr-x  ${name}.md`;
	});

	return <pre className="text-primary text-sm">{entries.join("\n")}</pre>;
}

const asciiCat = ["  /\\_/\\", " ( o.o )", "  > ^ <", " /|   |\\", "(_|   |_)"].join("\n");

export function CatOutput() {
	return <pre className="text-yellow text-sm">{asciiCat}</pre>;
}
