import { useCallback, useEffect, useRef, useState } from "react";

const NEAR_BOTTOM_THRESHOLD = 100;

export function useAutoScroll(deps: unknown[]) {
	const containerRef = useRef<HTMLElement>(null);
	const [showIndicator, setShowIndicator] = useState(false);
	const followRef = useRef(true);

	const checkNearBottom = useCallback(() => {
		const el = containerRef.current;
		if (!el) return true;
		return el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_THRESHOLD;
	}, []);

	const handleScroll = useCallback(() => {
		if (checkNearBottom()) {
			followRef.current = true;
			setShowIndicator(false);
		}
	}, [checkNearBottom]);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const unfollow = () => {
			if (checkNearBottom()) return;
			followRef.current = false;
			setShowIndicator(true);
		};

		const onWheel = (e: WheelEvent) => {
			if (e.deltaY < 0) unfollow();
		};
		let touchY: number | null = null;
		const onTouchStart = (e: TouchEvent) => {
			touchY = e.touches[0]?.clientY ?? null;
		};
		const onTouchMove = (e: TouchEvent) => {
			const y = e.touches[0]?.clientY;
			if (y === undefined || touchY === null) return;
			if (y > touchY) unfollow();
			touchY = y;
		};
		const onTouchEnd = () => {
			touchY = null;
		};

		el.addEventListener("wheel", onWheel, { passive: true });
		el.addEventListener("touchstart", onTouchStart, { passive: true });
		el.addEventListener("touchmove", onTouchMove, { passive: true });
		el.addEventListener("touchend", onTouchEnd, { passive: true });
		el.addEventListener("touchcancel", onTouchEnd, { passive: true });

		return () => {
			el.removeEventListener("wheel", onWheel);
			el.removeEventListener("touchstart", onTouchStart);
			el.removeEventListener("touchmove", onTouchMove);
			el.removeEventListener("touchend", onTouchEnd);
			el.removeEventListener("touchcancel", onTouchEnd);
		};
	}, [checkNearBottom]);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		if (followRef.current) {
			requestAnimationFrame(() => {
				el.scrollTo({ top: el.scrollHeight });
			});
		}
		// biome-ignore lint/correctness/useExhaustiveDependencies: deps come from caller
	}, deps);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		let rafPending = false;
		const scrollDown = () => {
			if (rafPending) return;
			rafPending = true;
			requestAnimationFrame(() => {
				rafPending = false;
				if (followRef.current && containerRef.current) {
					containerRef.current.scrollTo({ top: containerRef.current.scrollHeight });
				}
			});
		};

		const observer = new ResizeObserver(scrollDown);
		for (const child of el.children) observer.observe(child);

		const mutationObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				// Only observe direct children with ResizeObserver; subtree changes
				// still trigger scrollDown via the mutation itself.
				if (mutation.target === el) {
					for (const node of mutation.addedNodes) {
						if (node instanceof Element) observer.observe(node);
					}
				}
			}
			scrollDown();
		});

		mutationObserver.observe(el, { childList: true, subtree: true });

		return () => {
			observer.disconnect();
			mutationObserver.disconnect();
		};
	}, []);

	const scrollToBottom = useCallback(() => {
		const el = containerRef.current;
		if (!el) return;
		followRef.current = true;
		el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
		setShowIndicator(false);
	}, []);

	const forceScrollToBottom = useCallback(() => {
		const el = containerRef.current;
		if (!el) return;
		followRef.current = true;
		setShowIndicator(false);
		requestAnimationFrame(() => {
			el.scrollTo({ top: el.scrollHeight });
		});
	}, []);

	return {
		containerRef,
		showIndicator,
		handleScroll,
		scrollToBottom,
		forceScrollToBottom,
	};
}
