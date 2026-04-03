import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

type GreetingPhase = "idle" | "welcome" | "typing" | "executing" | "done";

const WELCOME_DELAY = 300;
const TYPING_PAUSE = 500;
const CHAR_SPEED = 65;
const COMMAND = "/whoami";

export function useGreeting(executeCommand: (cmd: string) => void) {
	const reduced = useReducedMotion();
	const [phase, setPhase] = useState<GreetingPhase>("idle");
	const [typedText, setTypedText] = useState("");
	const [welcomeVisible, setWelcomeVisible] = useState(false);

	const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		const track = (id: ReturnType<typeof setTimeout>) => {
			timersRef.current.add(id);
			return id;
		};

		const clearAllTimers = () => {
			for (const id of timersRef.current) {
				clearTimeout(id);
			}
			timersRef.current.clear();
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};

		if (reduced) {
			setWelcomeVisible(true);
			executeCommand(COMMAND);
			setPhase("done");
			return clearAllTimers;
		}

		setPhase("welcome");

		track(
			setTimeout(() => {
				setWelcomeVisible(true);

				track(
					setTimeout(() => {
						setPhase("typing");
						let charIndex = 0;

						intervalRef.current = setInterval(() => {
							charIndex++;
							setTypedText(COMMAND.slice(0, charIndex));

							if (charIndex >= COMMAND.length) {
								if (intervalRef.current !== null) {
									clearInterval(intervalRef.current);
									intervalRef.current = null;
								}
								track(
									setTimeout(() => {
										setPhase("executing");
										setTypedText("");
										executeCommand(COMMAND);
										setPhase("done");
									}, 150),
								);
							}
						}, CHAR_SPEED);
					}, TYPING_PAUSE),
				);
			}, WELCOME_DELAY),
		);

		return clearAllTimers;
	}, [reduced, executeCommand]);

	const isAutoTyping = phase === "typing";
	const inputDisabled = phase !== "done";

	return { welcomeVisible, typedText, isAutoTyping, inputDisabled };
}
