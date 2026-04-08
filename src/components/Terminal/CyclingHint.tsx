import { useEffect, useMemo, useState } from "react";
import { commands } from "@/content/data";

const CYCLE_MS = 2000;
const FADE_MS = 200;

const commandList = Object.keys(commands);
const FALLBACK = "/help";
const longestCommand = commandList.reduce((a, b) => (a.length >= b.length ? a : b), FALLBACK);

function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CyclingHint() {
	const reducedMotion = useMemo(prefersReducedMotion, []);
	const initialIndex = useMemo(
		() =>
			commandList.length === 0
				? 0
				: reducedMotion
					? Math.floor(Math.random() * commandList.length)
					: 0,
		[reducedMotion],
	);
	const [index, setIndex] = useState(initialIndex);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		if (reducedMotion || commandList.length === 0) {
			setVisible(true);
			return;
		}
		let fadeTimeout: number | undefined;
		const interval = window.setInterval(() => {
			setVisible(false);
			fadeTimeout = window.setTimeout(() => {
				setIndex((i) => (i + 1) % commandList.length);
				setVisible(true);
			}, FADE_MS);
		}, CYCLE_MS);
		return () => {
			window.clearInterval(interval);
			if (fadeTimeout !== undefined) window.clearTimeout(fadeTimeout);
			setVisible(true);
		};
	}, [reducedMotion]);

	const current = commandList[index] ?? FALLBACK;

	return (
		<>
			Try typing{" "}
			<span className="inline-block text-coral" style={{ minWidth: `${longestCommand.length}ch` }}>
				<span
					className={`transition-opacity duration-200 ease-in-out ${visible ? "opacity-100" : "opacity-0"}`}
				>
					{current}
				</span>
			</span>
		</>
	);
}
