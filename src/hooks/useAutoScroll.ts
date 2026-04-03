import { useCallback, useEffect, useRef, useState } from "react";

const NEAR_BOTTOM_THRESHOLD = 100;

export function useAutoScroll(deps: unknown[]) {
	const containerRef = useRef<HTMLElement>(null);
	const [showIndicator, setShowIndicator] = useState(false);
	const isNearBottomRef = useRef(true);

	const handleScroll = useCallback(() => {
		const el = containerRef.current;
		if (!el) return;
		const nearBottom =
			el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_THRESHOLD;
		isNearBottomRef.current = nearBottom;
		if (nearBottom) setShowIndicator(false);
	}, []);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		if (isNearBottomRef.current) {
			requestAnimationFrame(() => {
				el.scrollTo({ top: el.scrollHeight });
			});
		} else {
			setShowIndicator(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	const scrollToBottom = useCallback(() => {
		const el = containerRef.current;
		if (!el) return;
		el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
		setShowIndicator(false);
	}, []);

	return { containerRef, showIndicator, handleScroll, scrollToBottom };
}
