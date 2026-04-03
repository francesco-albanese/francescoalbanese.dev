import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

type GreetingPhase = "idle" | "welcome" | "typing" | "executing" | "done";

const WELCOME_DELAY = 300;
const TYPING_PAUSE = 500;
const CHAR_SPEED = 80;
const COMMAND = "/whoami";

export function useGreeting(executeCommand: (cmd: string) => void) {
	const reduced = useReducedMotion();
	const [phase, setPhase] = useState<GreetingPhase>("idle");
	const [typedText, setTypedText] = useState("");
	const [welcomeVisible, setWelcomeVisible] = useState(false);
	const hasRun = useRef(false);

	useEffect(() => {
		if (hasRun.current) return;
		hasRun.current = true;

		if (reduced) {
			setWelcomeVisible(true);
			executeCommand(COMMAND);
			setPhase("done");
			return;
		}

		setPhase("welcome");
		const welcomeTimer = setTimeout(() => {
			setWelcomeVisible(true);

			const typingTimer = setTimeout(() => {
				setPhase("typing");
				let charIndex = 0;

				const interval = setInterval(() => {
					charIndex++;
					setTypedText(COMMAND.slice(0, charIndex));

					if (charIndex >= COMMAND.length) {
						clearInterval(interval);
						setTimeout(() => {
							setPhase("executing");
							setTypedText("");
							executeCommand(COMMAND);
							setPhase("done");
						}, 150);
					}
				}, CHAR_SPEED);
			}, TYPING_PAUSE);

			return () => clearTimeout(typingTimer);
		}, WELCOME_DELAY);

		return () => clearTimeout(welcomeTimer);
	}, [reduced, executeCommand]);

	const isAutoTyping = phase === "typing";
	const inputDisabled = phase !== "done";

	return { welcomeVisible, typedText, isAutoTyping, inputDisabled };
}
