import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useStreamLines<T>(
	items: readonly T[],
	delayMs = 45,
	startDelay = 0,
): { visibleItems: readonly T[]; done: boolean } {
	const reduced = useReducedMotion();
	const [count, setCount] = useState(0);
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

		setCount(0);
		intervalRef.current = setInterval(() => {
			setCount((prev) => {
				if (prev >= items.length) {
					if (intervalRef.current) clearInterval(intervalRef.current);
					return prev;
				}
				return prev + 1;
			});
		}, delayMs);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [items, delayMs, started, reduced]);

	if (reduced) return { visibleItems: items, done: true };

	return {
		visibleItems: started ? items.slice(0, count) : [],
		done: started && count >= items.length,
	};
}
