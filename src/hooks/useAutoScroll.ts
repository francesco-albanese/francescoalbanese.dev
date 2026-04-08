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
		if (followRef.current && checkNearBottom()) setShowIndicator(false);
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
		const onKey = (e: KeyboardEvent) => {
			if (["ArrowUp", "PageUp", "Home"].includes(e.key)) unfollow();
		};
		let touchY = 0;
		const onTouchStart = (e: TouchEvent) => {
			touchY = e.touches[0]?.clientY ?? 0;
		};
		const onTouchMove = (e: TouchEvent) => {
			const y = e.touches[0]?.clientY ?? 0;
			if (y > touchY) unfollow();
			touchY = y;
		};

		el.addEventListener("wheel", onWheel, { passive: true });
		el.addEventListener("keydown", onKey);
		el.addEventListener("touchstart", onTouchStart, { passive: true });
		el.addEventListener("touchmove", onTouchMove, { passive: true });

		return () => {
			el.removeEventListener("wheel", onWheel);
			el.removeEventListener("keydown", onKey);
			el.removeEventListener("touchstart", onTouchStart);
			el.removeEventListener("touchmove", onTouchMove);
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

		const scrollDown = () => {
			if (followRef.current) el.scrollTo({ top: el.scrollHeight });
		};

		const observer = new ResizeObserver(scrollDown);
		observer.observe(el);
		for (const child of el.children) observer.observe(child);

		const vv = typeof window !== "undefined" ? window.visualViewport : null;
		vv?.addEventListener("resize", scrollDown);
		vv?.addEventListener("scroll", scrollDown);

		const mutationObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node instanceof Element) observer.observe(node);
				}
			}
			scrollDown();
		});

		mutationObserver.observe(el, { childList: true, subtree: true });

		return () => {
			observer.disconnect();
			mutationObserver.disconnect();
			vv?.removeEventListener("resize", scrollDown);
			vv?.removeEventListener("scroll", scrollDown);
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
