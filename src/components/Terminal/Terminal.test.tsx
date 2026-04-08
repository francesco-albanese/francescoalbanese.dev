import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Terminal } from "./Terminal";

beforeEach(() => {
	cleanup();
	document.body.innerHTML = "";
	vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
	vi.runOnlyPendingTimers();
	vi.useRealTimers();
	cleanup();
});

async function renderTerminal() {
	const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
	render(<Terminal profilePictureSrc="/test.webp" />);
	await vi.advanceTimersByTimeAsync(400);
	const input = await screen.findByLabelText(/terminal input/i);
	await waitFor(() => expect(input).not.toHaveAttribute("readonly"));
	return { user, input: input as HTMLInputElement };
}

describe("Terminal", () => {
	it("disables input until greeting completes, then enables it", async () => {
		render(<Terminal profilePictureSrc="/test.webp" />);
		const input = screen.getByLabelText(/terminal input/i);
		expect(input).toHaveAttribute("readonly");
		await vi.advanceTimersByTimeAsync(400);
		await waitFor(() => expect(input).not.toHaveAttribute("readonly"));
	});

	it("runs /help and lists all commands", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "/help{Enter}");
		expect(await screen.findByText("Available commands:")).toBeInTheDocument();
		const log = screen.getByRole("log");
		expect(within(log).getByRole("button", { name: "/whoami" })).toBeInTheDocument();
		expect(within(log).getByRole("button", { name: "/projects" })).toBeInTheDocument();
	});

	it("submit on coarse pointer blurs the input to dismiss the mobile keyboard", async () => {
		const original = window.matchMedia;
		window.matchMedia = ((query: string) => ({
			matches: query.includes("coarse"),
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})) as typeof window.matchMedia;
		try {
			const { user, input } = await renderTerminal();
			input.focus();
			expect(document.activeElement).toBe(input);
			await user.type(input, "/whoami{Enter}");
			expect(document.activeElement).not.toBe(input);
		} finally {
			window.matchMedia = original;
		}
	});

	it("clicking a help command executes it", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "/help{Enter}");
		const log = screen.getByRole("log");
		const whoamiBtn = await within(log).findByRole("button", { name: "/whoami" });
		await user.click(whoamiBtn);
		expect(await screen.findByText(/WorldFirst/i)).toBeInTheDocument();
	});

	it("/clear empties the output log", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "/whoami{Enter}");
		expect(await screen.findByText(/WorldFirst/i)).toBeInTheDocument();
		await user.type(input, "/clear{Enter}");
		await waitFor(() => expect(screen.queryByText(/WorldFirst/i)).not.toBeInTheDocument());
	});

	it("unknown command shows error", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "/nope{Enter}");
		expect(await screen.findByText(/command not found/i)).toBeInTheDocument();
	});

	it("bare 'help' (no slash) runs /help", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "help{Enter}");
		expect(await screen.findByText("Available commands:")).toBeInTheDocument();
	});

	it("bare command is case-insensitive", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "WHOAMI{Enter}");
		expect(await screen.findByText(/WorldFirst/i)).toBeInTheDocument();
	});

	it("bare typo still shows error", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "halp{Enter}");
		expect(await screen.findByText(/command not found/i)).toBeInTheDocument();
	});

	it("Tab autocompletes a unique prefix", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "/who");
		await user.keyboard("{Tab}");
		expect(input.value).toBe("/whoami");
	});

	it("Tab on ambiguous prefix shows completions list", async () => {
		const { user, input } = await renderTerminal();
		await user.clear(input);
		await user.type(input, "/");
		await user.keyboard("{Tab}");
		const log = screen.getByRole("log");
		expect(
			within(log).getByText("/help /clear /whoami /skills /links /projects /experience"),
		).toBeInTheDocument();
	});

	it("ArrowUp/ArrowDown navigate command history", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "/whoami{Enter}");
		await user.type(input, "/skills{Enter}");
		await user.keyboard("{ArrowUp}");
		expect(input.value).toBe("/skills");
		await user.keyboard("{ArrowUp}");
		expect(input.value).toBe("/whoami");
		await user.keyboard("{ArrowDown}");
		expect(input.value).toBe("/skills");
		await user.keyboard("{ArrowDown}");
		expect(input.value).toBe("");
	});

	it("submitting whitespace-only input is a no-op", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "   {Enter}");
		const log = screen.getByRole("log");
		expect(within(log).queryByText(/command not found/i)).not.toBeInTheDocument();
	});

	it("sudo easter egg responds", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "sudo rm -rf /{Enter}");
		expect(await screen.findByText(/nice try/i)).toBeInTheDocument();
	});

	it("'sudoku' does not trigger sudo egg", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "sudoku{Enter}");
		expect(screen.queryByText(/nice try/i)).not.toBeInTheDocument();
		expect(await screen.findByText(/command not found/i)).toBeInTheDocument();
	});

	it("ls easter egg lists commands", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "ls{Enter}");
		expect(await screen.findByText(/whoami\.md/)).toBeInTheDocument();
	});

	it("renders /projects, /skills, /experience, /links without crashing", async () => {
		const { user, input } = await renderTerminal();
		for (const cmd of ["/projects", "/skills", "/experience", "/links"]) {
			await user.type(input, `${cmd}{Enter}`);
		}
		const log = screen.getByRole("log");
		expect(log).toBeInTheDocument();
	});

	it("input clears after Enter", async () => {
		const { user, input } = await renderTerminal();
		await user.type(input, "/whoami{Enter}");
		expect(input.value).toBe("");
	});

	describe("command suggestion chips (mobile-friendly)", () => {
		function chipsList() {
			return screen.queryByTestId("command-suggestions");
		}

		it("shows matching suggestion chips while typing a partial command", async () => {
			const { user, input } = await renderTerminal();
			await user.type(input, "/p");
			const list = chipsList();
			expect(list).not.toBeNull();
			expect(
				within(list as HTMLElement).getByRole("button", { name: "/projects" }),
			).toBeInTheDocument();
			expect(
				within(list as HTMLElement).queryByRole("button", { name: "/whoami" }),
			).not.toBeInTheDocument();
		});

		it("shows curated chips when input is empty", async () => {
			const { input } = await renderTerminal();
			expect(input.value).toBe("");
			const list = chipsList();
			expect(list).not.toBeNull();
			expect(
				within(list as HTMLElement).getByRole("button", { name: "/help" }),
			).toBeInTheDocument();
		});

		it("hides chips when input exactly matches a command (no further completion)", async () => {
			const { user, input } = await renderTerminal();
			await user.type(input, "/whoami");
			expect(chipsList()).toBeNull();
		});

		it("tapping a chip auto-submits the command and clears the input without focusing it", async () => {
			const { user, input } = await renderTerminal();
			const skillsChip = await screen.findByRole("button", { name: "/skills" });
			await user.click(skillsChip);
			await vi.advanceTimersByTimeAsync(150);
			expect(await screen.findByText(/LLM Agents/i)).toBeInTheDocument();
			expect(input.value).toBe("");
			expect(input).not.toHaveFocus();
		});

		it("rapid double-tap on a chip only fires one submission", async () => {
			const { user } = await renderTerminal();
			const chip = await screen.findByRole("button", { name: "/whoami" });
			await user.click(chip);
			await user.click(chip);
			await vi.advanceTimersByTimeAsync(150);
			const matches = screen.getAllByText(/WorldFirst/i);
			expect(matches).toHaveLength(1);
		});

		it("re-shows chips after typing → clearing → typing again", async () => {
			const { user, input } = await renderTerminal();
			await user.type(input, "/p");
			expect(chipsList()).not.toBeNull();
			await user.clear(input);
			await user.type(input, "/c");
			const list = chipsList();
			expect(list).not.toBeNull();
			expect(
				within(list as HTMLElement).getByRole("button", { name: "/clear" }),
			).toBeInTheDocument();
		});

		it("history navigation still works after using a chip", async () => {
			const { user, input } = await renderTerminal();
			await user.type(input, "/whoami{Enter}");
			await user.click(await screen.findByRole("button", { name: "/skills" }));
			await vi.advanceTimersByTimeAsync(150);
			input.focus();
			await user.keyboard("{ArrowUp}");
			expect(input.value).toBe("/skills");
			await user.keyboard("{ArrowUp}");
			expect(input.value).toBe("/whoami");
		});

		it("typing a lone '/' shows all available command chips", async () => {
			const { user, input } = await renderTerminal();
			await user.type(input, "/");
			const list = chipsList();
			expect(list).not.toBeNull();
			for (const cmd of [
				"/help",
				"/clear",
				"/whoami",
				"/skills",
				"/links",
				"/projects",
				"/experience",
			]) {
				expect(within(list as HTMLElement).getByRole("button", { name: cmd })).toBeInTheDocument();
			}
		});

		it("substring match: typing 's' surfaces every command containing s", async () => {
			const { user, input } = await renderTerminal();
			await user.type(input, "s");
			const list = chipsList();
			expect(list).not.toBeNull();
			expect(
				within(list as HTMLElement).getByRole("button", { name: "/skills" }),
			).toBeInTheDocument();
			expect(
				within(list as HTMLElement).getByRole("button", { name: "/links" }),
			).toBeInTheDocument();
			expect(
				within(list as HTMLElement).getByRole("button", { name: "/projects" }),
			).toBeInTheDocument();
			expect(
				within(list as HTMLElement).queryByRole("button", { name: "/whoami" }),
			).not.toBeInTheDocument();
		});

		it("bare prefix without slash shows matching chips (case-insensitive)", async () => {
			const { user, input } = await renderTerminal();
			await user.type(input, "HE");
			const list = chipsList();
			expect(list).not.toBeNull();
			expect(
				within(list as HTMLElement).getByRole("button", { name: "/help" }),
			).toBeInTheDocument();
		});

		it("chips never throw on whitespace or unicode input — only real command matches", async () => {
			const { user, input } = await renderTerminal();
			await user.type(input, "   ");
			expect(chipsList()).toBeNull();
			await user.clear(input);
			await user.type(input, "🦊");
			expect(chipsList()).toBeNull();
		});
	});

	describe("submit button (mobile)", () => {
		it("submits the current input when clicked", async () => {
			const { user, input } = await renderTerminal();
			await user.type(input, "/whoami");
			const submitBtn = screen.getByRole("button", { name: /run command/i });
			await user.click(submitBtn);
			expect(await screen.findByText(/WorldFirst/i)).toBeInTheDocument();
			expect(input.value).toBe("");
		});

		it("is disabled while input is empty or whitespace-only", async () => {
			const { user, input } = await renderTerminal();
			const submitBtn = screen.getByRole("button", { name: /run command/i });
			expect(submitBtn).toBeDisabled();
			await user.type(input, "   ");
			expect(submitBtn).toBeDisabled();
		});

		it("clicking submit on whitespace-only input is a no-op", async () => {
			const { user, input } = await renderTerminal();
			await user.type(input, "  ");
			const submitBtn = screen.getByRole("button", { name: /run command/i });
			await user.click(submitBtn);
			const log = screen.getByRole("log");
			expect(within(log).queryByText(/command not found/i)).not.toBeInTheDocument();
		});
	});
});
