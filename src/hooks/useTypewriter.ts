import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useTypewriter(
	text: string,
	speed = 65,
	startDelay = 0,
): { displayed: string; done: boolean } {
	const reduced = useReducedMotion();
	const [index, setIndex] = useState(0);
	const [started, setStarted] = useState(startDelay === 0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (reduced || startDelay === 0) {
			setStarted(true);
			return;
		}

		const timeout = setTimeout(() => setStarted(true), startDelay);
		return () => clearTimeout(timeout);
	}, [reduced, startDelay]);

	useEffect(() => {
		if (reduced || !started) return;

		setIndex(0);
		intervalRef.current = setInterval(() => {
			setIndex((prev) => {
				if (prev >= text.length) {
					if (intervalRef.current) clearInterval(intervalRef.current);
					return prev;
				}
				return prev + 1;
			});
		}, speed);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [text, speed, started, reduced]);

	if (reduced) return { displayed: text, done: true };

	return {
		displayed: started ? text.slice(0, index) : "",
		done: started && index >= text.length,
	};
}
