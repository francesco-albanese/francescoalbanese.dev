import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { commands } from "@/content/data";
import { CyclingHint } from "./CyclingHint";

const commandList = Object.keys(commands);

function mockMatchMedia(reduced: boolean) {
	window.matchMedia = ((query: string) => ({
		matches: query.includes("reduce") ? reduced : false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})) as typeof window.matchMedia;
}

beforeEach(() => {
	cleanup();
	vi.useFakeTimers();
	mockMatchMedia(false);
});

afterEach(() => {
	vi.runOnlyPendingTimers();
	vi.useRealTimers();
	cleanup();
});

describe("CyclingHint", () => {
	it("renders the first command initially", () => {
		render(<CyclingHint />);
		expect(screen.getByText(commandList[0] as string)).toBeInTheDocument();
	});

	it("advances to the next command after the cycle interval", () => {
		render(<CyclingHint />);
		expect(screen.getByText(commandList[0] as string)).toBeInTheDocument();
		act(() => {
			vi.advanceTimersByTime(2000);
			vi.advanceTimersByTime(200);
		});
		expect(screen.getByText(commandList[1] as string)).toBeInTheDocument();
	});

	it("does not advance when prefers-reduced-motion is set", () => {
		mockMatchMedia(true);
		render(<CyclingHint />);
		const initial = screen.getByText(/^\/[a-z]+$/).textContent;
		act(() => {
			vi.advanceTimersByTime(5000);
		});
		expect(screen.getByText(/^\/[a-z]+$/).textContent).toBe(initial);
	});

	it("unmounting mid-fade does not throw or warn", () => {
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const { unmount } = render(<CyclingHint />);
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		unmount();
		act(() => {
			vi.advanceTimersByTime(500);
		});
		expect(errorSpy).not.toHaveBeenCalled();
		errorSpy.mockRestore();
	});
});
