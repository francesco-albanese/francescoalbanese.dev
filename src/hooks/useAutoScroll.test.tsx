import { act, render } from "@testing-library/react";
import { useEffect, useState } from "react";
import { describe, expect, it } from "vitest";
import { useAutoScroll } from "./useAutoScroll";

type Line = { id: number; text: string };
type HarnessHandle = {
	addLine: (text: string) => void;
};

let nextLineId = 0;

function Harness({ onReady }: { onReady: (h: HarnessHandle) => void }) {
	const [lines, setLines] = useState<Line[]>(() => [{ id: nextLineId++, text: "seed" }]);
	const { containerRef, showIndicator, handleScroll, scrollToBottom, forceScrollToBottom } =
		useAutoScroll([lines.length]);

	useEffect(() => {
		onReady({ addLine: (t) => setLines((prev) => [...prev, { id: nextLineId++, text: t }]) });
	}, [onReady]);

	return (
		<div>
			<div data-testid="indicator">{showIndicator ? "yes" : "no"}</div>
			<button type="button" onClick={scrollToBottom} data-testid="scroll-btn">
				scroll
			</button>
			<button type="button" onClick={forceScrollToBottom} data-testid="force-btn">
				force
			</button>
			<main
				ref={containerRef as React.Ref<HTMLElement>}
				onScroll={handleScroll}
				data-testid="container"
				style={{ height: 100, overflow: "auto" }}
			>
				{lines.map((l) => (
					<div key={l.id} style={{ height: 50 }}>
						{l.text}
					</div>
				))}
			</main>
		</div>
	);
}

function setupContainer(el: HTMLElement, scrollHeight: number, clientHeight: number) {
	Object.defineProperty(el, "scrollHeight", { value: scrollHeight, configurable: true });
	Object.defineProperty(el, "clientHeight", { value: clientHeight, configurable: true });
	el.scrollTo = function scrollTo(arg: ScrollToOptions | number, y?: number) {
		const top = typeof arg === "number" ? (y ?? 0) : (arg?.top ?? 0);
		Object.defineProperty(el, "scrollTop", { value: top, configurable: true, writable: true });
	} as Element["scrollTo"];
}

describe("useAutoScroll", () => {
	it("starts in follow mode and does not show indicator", () => {
		const { getByTestId } = render(<Harness onReady={() => {}} />);
		expect(getByTestId("indicator").textContent).toBe("no");
	});

	it("wheel-up while scrolled away from bottom unfollows and shows indicator", () => {
		const { getByTestId } = render(<Harness onReady={() => {}} />);
		const container = getByTestId("container");
		setupContainer(container, 1000, 100);
		container.scrollTop = 200;

		act(() => {
			container.dispatchEvent(new WheelEvent("wheel", { deltaY: -50, bubbles: true }));
		});

		expect(getByTestId("indicator").textContent).toBe("yes");
	});

	it("wheel-up while still near bottom does not unfollow", () => {
		const { getByTestId } = render(<Harness onReady={() => {}} />);
		const container = getByTestId("container");
		setupContainer(container, 200, 100);
		container.scrollTop = 50;

		act(() => {
			container.dispatchEvent(new WheelEvent("wheel", { deltaY: -10, bubbles: true }));
		});

		expect(getByTestId("indicator").textContent).toBe("no");
	});

	it("wheel-down does not unfollow", () => {
		const { getByTestId } = render(<Harness onReady={() => {}} />);
		const container = getByTestId("container");
		setupContainer(container, 1000, 100);
		container.scrollTop = 200;

		act(() => {
			container.dispatchEvent(new WheelEvent("wheel", { deltaY: 50, bubbles: true }));
		});

		expect(getByTestId("indicator").textContent).toBe("no");
	});

	it("touch drag down (scrolling content up) unfollows", () => {
		const { getByTestId } = render(<Harness onReady={() => {}} />);
		const container = getByTestId("container");
		setupContainer(container, 1000, 100);
		container.scrollTop = 200;

		act(() => {
			const start = new TouchEvent("touchstart", { bubbles: true });
			Object.defineProperty(start, "touches", { value: [{ clientY: 100 }] });
			container.dispatchEvent(start);

			const move = new TouchEvent("touchmove", { bubbles: true });
			Object.defineProperty(move, "touches", { value: [{ clientY: 200 }] });
			container.dispatchEvent(move);
		});

		expect(getByTestId("indicator").textContent).toBe("yes");
	});

	it("scrollToBottom re-engages follow and hides indicator", () => {
		const { getByTestId } = render(<Harness onReady={() => {}} />);
		const container = getByTestId("container");
		setupContainer(container, 1000, 100);
		container.scrollTop = 200;
		act(() => {
			container.dispatchEvent(new WheelEvent("wheel", { deltaY: -50, bubbles: true }));
		});
		expect(getByTestId("indicator").textContent).toBe("yes");

		act(() => {
			getByTestId("scroll-btn").click();
		});
		expect(getByTestId("indicator").textContent).toBe("no");
	});

	it("scrollToBottom mutates container scrollTop to scrollHeight", () => {
		const { getByTestId } = render(<Harness onReady={() => {}} />);
		const container = getByTestId("container");
		setupContainer(container, 1000, 100);
		container.scrollTop = 0;

		act(() => {
			getByTestId("scroll-btn").click();
		});

		expect(container.scrollTop).toBe(1000);
	});

	it("forceScrollToBottom re-engages follow", () => {
		const { getByTestId } = render(<Harness onReady={() => {}} />);
		const container = getByTestId("container");
		setupContainer(container, 1000, 100);
		container.scrollTop = 200;
		act(() => {
			container.dispatchEvent(new WheelEvent("wheel", { deltaY: -50, bubbles: true }));
		});

		act(() => {
			getByTestId("force-btn").click();
		});
		expect(getByTestId("indicator").textContent).toBe("no");
	});

	it("once unfollowed, new content does not flip indicator off", () => {
		let handle: HarnessHandle | undefined;
		const { getByTestId } = render(<Harness onReady={(h) => (handle = h)} />);
		const container = getByTestId("container");
		setupContainer(container, 1000, 100);
		container.scrollTop = 200;
		act(() => {
			container.dispatchEvent(new WheelEvent("wheel", { deltaY: -50, bubbles: true }));
		});
		expect(getByTestId("indicator").textContent).toBe("yes");

		act(() => {
			handle?.addLine("new");
		});
		expect(getByTestId("indicator").textContent).toBe("yes");
	});
});
