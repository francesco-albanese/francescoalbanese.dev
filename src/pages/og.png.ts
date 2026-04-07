import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { APIRoute } from "astro";
import type { ReactNode } from "react";
import satori from "satori";
import sharp from "sharp";
import { identity } from "@/content/data";

const WIDTH = 1200;
const HEIGHT = 630;

const colors = {
	base: "#1a1b26",
	surface: "#1f2335",
	overlay: "#24283b",
	statusbar: "#0f1019",
	primary: "#c0caf5",
	secondary: "#a9b1d6",
	muted: "#4a5078",
	coral: "#ff9e64",
	purple: "#bb9af7",
	teal: "#73c8a9",
	red: "#f7768e",
	yellow: "#e0af68",
};

async function loadFont(weight: string): Promise<ArrayBuffer> {
	const path = join(
		process.cwd(),
		`node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${weight}-normal.woff`,
	);
	const buffer = await readFile(path);
	return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

function buildMarkup() {
	return {
		type: "div",
		props: {
			style: {
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				backgroundColor: colors.base,
				padding: "32px",
				fontFamily: "JetBrains Mono",
			},
			children: [
				// Terminal window
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							flexDirection: "column",
							flex: 1,
							backgroundColor: colors.surface,
							borderRadius: "12px",
							overflow: "hidden",
						},
						children: [
							// Header bar
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										alignItems: "center",
										padding: "14px 18px",
										backgroundColor: colors.overlay,
										gap: "10px",
									},
									children: [
										{
											type: "div",
											props: {
												style: {
													display: "flex",
													gap: "8px",
												},
												children: [
													{
														type: "div",
														props: {
															style: {
																width: "14px",
																height: "14px",
																borderRadius: "50%",
																backgroundColor: colors.red,
															},
														},
													},
													{
														type: "div",
														props: {
															style: {
																width: "14px",
																height: "14px",
																borderRadius: "50%",
																backgroundColor: colors.yellow,
															},
														},
													},
													{
														type: "div",
														props: {
															style: {
																width: "14px",
																height: "14px",
																borderRadius: "50%",
																backgroundColor: colors.teal,
															},
														},
													},
												],
											},
										},
										{
											type: "div",
											props: {
												style: {
													color: colors.muted,
													fontSize: "14px",
													marginLeft: "8px",
												},
												children: "francescoalbanese.dev",
											},
										},
									],
								},
							},
							// Terminal body
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										flexDirection: "column",
										flex: 1,
										padding: "28px 32px",
										gap: "6px",
									},
									children: [
										// Prompt line
										{
											type: "div",
											props: {
												style: {
													display: "flex",
													fontSize: "16px",
													gap: "0px",
												},
												children: [
													{
														type: "span",
														props: {
															style: { color: colors.teal },
															children: "visitor",
														},
													},
													{
														type: "span",
														props: {
															style: { color: colors.muted },
															children: "@",
														},
													},
													{
														type: "span",
														props: {
															style: { color: colors.purple },
															children: "francescoalbanese.dev",
														},
													},
													{
														type: "span",
														props: {
															style: { color: colors.muted },
															children: ":~$ ",
														},
													},
													{
														type: "span",
														props: {
															style: { color: colors.coral },
															children: "/whoami",
														},
													},
												],
											},
										},
										// Spacer
										{
											type: "div",
											props: { style: { height: "16px" } },
										},
										// Name
										{
											type: "div",
											props: {
												style: {
													fontSize: "36px",
													fontWeight: 700,
													color: colors.coral,
												},
												children: identity.name,
											},
										},
										// Role
										{
											type: "div",
											props: {
												style: {
													fontSize: "22px",
													color: colors.purple,
													marginTop: "2px",
												},
												children: identity.role,
											},
										},
										// Location
										{
											type: "div",
											props: {
												style: {
													fontSize: "16px",
													color: colors.muted,
													marginTop: "4px",
												},
												children: identity.location,
											},
										},
										// Spacer
										{
											type: "div",
											props: { style: { height: "16px" } },
										},
										// Bio lines
										...identity.bio.map((line) => ({
											type: "div",
											props: {
												style: {
													fontSize: "16px",
													color: colors.secondary,
													lineHeight: "1.6",
												},
												children: `> ${line}`,
											},
										})),
									],
								},
							},
							// Status bar
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										justifyContent: "space-between",
										padding: "10px 18px",
										backgroundColor: colors.statusbar,
										fontSize: "13px",
										color: colors.muted,
									},
									children: [
										{
											type: "span",
											props: {
												children: identity.site,
											},
										},
										{
											type: "span",
											props: {
												children: `${identity.role} · ${identity.location}`,
											},
										},
									],
								},
							},
						],
					},
				},
			],
		},
	};
}

export const GET: APIRoute = async () => {
	const [fontRegular, fontBold] = await Promise.all([loadFont("400"), loadFont("700")]);

	const svg = await satori(buildMarkup() as ReactNode, {
		width: WIDTH,
		height: HEIGHT,
		fonts: [
			{
				name: "JetBrains Mono",
				data: fontRegular,
				weight: 400,
				style: "normal",
			},
			{ name: "JetBrains Mono", data: fontBold, weight: 700, style: "normal" },
		],
	});

	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(new Uint8Array(png), {
		headers: { "Content-Type": "image/png" },
	});
};
