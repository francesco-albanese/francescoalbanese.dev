import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

const WELCOME_DELAY = 300;

export function useGreeting() {
	const reduced = useReducedMotion();
	const [welcomeVisible, setWelcomeVisible] = useState(false);
	const [inputDisabled, setInputDisabled] = useState(true);

	useEffect(() => {
		if (reduced) {
			setWelcomeVisible(true);
			setInputDisabled(false);
			return;
		}

		const timer = setTimeout(() => {
			setWelcomeVisible(true);
			setInputDisabled(false);
		}, WELCOME_DELAY);

		return () => clearTimeout(timer);
	}, [reduced]);

	return { welcomeVisible, inputDisabled };
}
