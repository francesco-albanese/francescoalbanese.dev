import { useState, useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "./useReducedMotion";

type Phase = "typing" | "pausing" | "erasing";

export function useRoleCycle(
	roles: string[],
	pauseMs = 2800,
	speed = 65,
): { displayed: string; done: boolean } {
	const reduced = useReducedMotion();
	const [roleIndex, setRoleIndex] = useState(0);
	const [charIndex, setCharIndex] = useState(0);
	const [phase, setPhase] = useState<Phase>("typing");
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clear = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	useEffect(() => {
		if (reduced || roles.length === 0) return;

		const currentRole = roles[roleIndex];

		if (phase === "typing") {
			if (charIndex < currentRole.length) {
				timerRef.current = setTimeout(() => setCharIndex((c) => c + 1), speed);
			} else {
				timerRef.current = setTimeout(() => setPhase("pausing"), 0);
			}
		} else if (phase === "pausing") {
			timerRef.current = setTimeout(() => setPhase("erasing"), pauseMs);
		} else if (phase === "erasing") {
			if (charIndex > 0) {
				timerRef.current = setTimeout(() => setCharIndex((c) => c - 1), speed);
			} else {
				setRoleIndex((i) => (i + 1) % roles.length);
				setPhase("typing");
			}
		}

		return clear;
	}, [roles, roleIndex, charIndex, phase, speed, pauseMs, reduced, clear]);

	useEffect(() => {
		return clear;
	}, [clear]);

	if (reduced || roles.length === 0) {
		return { displayed: roles[0] ?? "", done: true };
	}

	return {
		displayed: roles[roleIndex].slice(0, charIndex),
		done: phase === "pausing",
	};
}
