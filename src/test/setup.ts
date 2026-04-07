import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
	cleanup();
});

if (typeof window.matchMedia !== "function") {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		configurable: true,
		value: (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}),
	});
}

if (!("ResizeObserver" in window)) {
	class RO {
		observe() {}
		unobserve() {}
		disconnect() {}
	}
	(window as unknown as { ResizeObserver: typeof RO }).ResizeObserver = RO;
}

if (!Element.prototype.scrollTo) {
	Element.prototype.scrollTo = function scrollTo() {};
}

if (!Element.prototype.scrollIntoView) {
	Element.prototype.scrollIntoView = function scrollIntoView() {};
}
