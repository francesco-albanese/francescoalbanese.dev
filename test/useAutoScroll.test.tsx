import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { useAutoScroll } from "@/hooks/useAutoScroll";

function Harness() {
	const [lines, setLines] = useState<number[]>([0]);
	const { containerRef, showIndicator, handleScroll, scrollToBottom } = useAutoScroll([
		lines.length,
	]);

	return (
		<div>
			<button type="button" data-testid="add" onClick={() => setLines((p) => [...p, p.length])}>
				add
			</button>
			<button type="button" data-testid="to-bottom" onClick={scrollToBottom}>
				bottom
			</button>
			<div data-testid="indicator">{showIndicator ? "yes" : "no"}</div>
			<main
				ref={containerRef as React.RefObject<HTMLElement>}
				onScroll={handleScroll}
				data-testid="container"
				style={{ height: 100, overflowY: "auto" }}
			>
				{lines.map((n) => (
					<div key={n} style={{ height: 40 }}>
						line {n}
					</div>
				))}
			</main>
		</div>
	);
}

function setMetrics(
	el: HTMLElement,
	{
		scrollHeight,
		clientHeight,
		scrollTop,
	}: {
		scrollHeight: number;
		clientHeight: number;
		scrollTop: number;
	},
) {
	Object.defineProperty(el, "scrollHeight", { configurable: true, value: scrollHeight });
	Object.defineProperty(el, "clientHeight", { configurable: true, value: clientHeight });
	Object.defineProperty(el, "scrollTop", { configurable: true, writable: true, value: scrollTop });
}

describe("useAutoScroll", () => {
	it("starts in follow mode and reports no indicator", () => {
		const { getByTestId } = render(<Harness />);
		expect(getByTestId("indicator").textContent).toBe("no");
	});

	it("wheel-up near top unfollows and shows indicator", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(<Harness />);
		const container = getByTestId("container");
		setMetrics(container, { scrollHeight: 1000, clientHeight: 100, scrollTop: 0 });

		await act(async () => {
			container.dispatchEvent(new WheelEvent("wheel", { deltaY: -50, bubbles: true }));
		});

		expect(getByTestId("indicator").textContent).toBe("yes");

		await user.click(getByTestId("to-bottom"));
		expect(getByTestId("indicator").textContent).toBe("no");
	});

	it("wheel-up while near bottom does not unfollow", async () => {
		const { getByTestId } = render(<Harness />);
		const container = getByTestId("container");
		setMetrics(container, { scrollHeight: 200, clientHeight: 100, scrollTop: 150 });

		await act(async () => {
			container.dispatchEvent(new WheelEvent("wheel", { deltaY: -10, bubbles: true }));
		});

		expect(getByTestId("indicator").textContent).toBe("no");
	});

	it("touch drag down unfollows when not near bottom", async () => {
		const { getByTestId } = render(<Harness />);
		const container = getByTestId("container");
		setMetrics(container, { scrollHeight: 1000, clientHeight: 100, scrollTop: 0 });

		await act(async () => {
			container.dispatchEvent(
				new TouchEvent("touchstart", {
					bubbles: true,
					touches: [{ clientY: 10 } as Touch],
				}),
			);
			container.dispatchEvent(
				new TouchEvent("touchmove", {
					bubbles: true,
					touches: [{ clientY: 80 } as Touch],
				}),
			);
		});

		expect(getByTestId("indicator").textContent).toBe("yes");
	});
});
