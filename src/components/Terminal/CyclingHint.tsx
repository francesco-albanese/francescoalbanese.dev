import { useEffect, useMemo, useState } from "react";
import { commands } from "@/content/data";

const CYCLE_MS = 2000;
const FADE_MS = 200;

const commandList = Object.keys(commands);

function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type CyclingHintProps = {
	paused: boolean;
};

export function CyclingHint({ paused }: CyclingHintProps) {
	const reducedMotion = useMemo(prefersReducedMotion, []);
	const initialIndex = useMemo(
		() => (reducedMotion ? Math.floor(Math.random() * commandList.length) : 0),
		[reducedMotion],
	);
	const [index, setIndex] = useState(initialIndex);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		if (reducedMotion || paused) return;
		const interval = window.setInterval(() => {
			setVisible(false);
			window.setTimeout(() => {
				setIndex((i) => (i + 1) % commandList.length);
				setVisible(true);
			}, FADE_MS);
		}, CYCLE_MS);
		return () => window.clearInterval(interval);
	}, [reducedMotion, paused]);

	const longest = useMemo(() => commandList.reduce((a, b) => (a.length >= b.length ? a : b)), []);
	const current = commandList[index] ?? commandList[0] ?? "/help";

	return (
		<>
			Try typing{" "}
			<span className="inline-block text-coral" style={{ minWidth: `${longest.length}ch` }}>
				<span
					style={{
						opacity: visible ? 1 : 0,
						transition: `opacity ${FADE_MS}ms ease`,
					}}
				>
					{current}
				</span>
			</span>
		</>
	);
}
