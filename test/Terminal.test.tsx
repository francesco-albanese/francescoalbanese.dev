import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Terminal } from "@/components/Terminal/Terminal";

function renderTerminal() {
	return render(<Terminal profilePictureSrc="/test.webp" />);
}

async function waitForReady() {
	const input = await screen.findByLabelText("Terminal input");
	// greeting disables input briefly
	await vi.waitFor(() => expect(input).not.toHaveAttribute("readonly"));
	return input as HTMLInputElement;
}

describe("Terminal — welcome", () => {
	it("shows welcome box with greeting and getting-started hint", async () => {
		renderTerminal();
		expect(await screen.findByText("Welcome visitor!")).toBeInTheDocument();
		expect(screen.getByText("Getting started")).toBeInTheDocument();
		expect(screen.getByLabelText("Toggle profile portrait")).toBeInTheDocument();
	});
});

describe("Terminal — command dispatch", () => {
	beforeEach(() => {
		vi.useRealTimers();
	});

	it("runs /help and shows help output", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		await user.type(input, "/help{Enter}");

		const log = screen.getByRole("log");
		expect(within(log).getAllByText("/help").length).toBeGreaterThan(0);
		// help output lists other commands as buttons
		expect(within(log).getByRole("button", { name: "/whoami" })).toBeInTheDocument();
	});

	it("runs /whoami without crashing", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		await user.type(input, "/whoami{Enter}");

		const log = screen.getByRole("log");
		expect(within(log).getByText("/whoami")).toBeInTheDocument();
	});

	it("runs /skills, /links, /experience without crashing", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		for (const cmd of ["/skills", "/links", "/experience"]) {
			await user.type(input, `${cmd}{Enter}`);
			const log = screen.getByRole("log");
			expect(within(log).getByText(cmd)).toBeInTheDocument();
		}
	});

	it("runs /projects without crashing", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		await user.type(input, "/projects{Enter}");

		const log = screen.getByRole("log");
		expect(within(log).getByText("/projects")).toBeInTheDocument();
	});

	it("/clear wipes previous entries", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		await user.type(input, "/whoami{Enter}");
		expect(screen.getAllByText("visitor")).toHaveLength(1);

		await user.type(input, "/clear{Enter}");

		expect(screen.queryAllByText("visitor")).toHaveLength(0);
	});

	it("shows error for unknown command", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		await user.type(input, "/nope{Enter}");

		expect(await screen.findByText(/command not found|unknown|not found/i)).toBeInTheDocument();
	});

	it("shows error for plain text (non-command)", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		await user.type(input, "hello{Enter}");

		expect(await screen.findByText(/command not found|unknown|not found/i)).toBeInTheDocument();
	});

	it("empty Enter is a no-op", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		await user.click(input);
		await user.keyboard("{Enter}");
		await user.keyboard("   {Enter}");

		// No prompt entries rendered — "visitor" appears only once (in welcome)
		expect(screen.queryAllByText("visitor")).toHaveLength(0);
	});
});

describe("Terminal — easter eggs", () => {
	it("ls shows easter egg output", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();
		await user.type(input, "ls{Enter}");
		const log = screen.getByRole("log");
		expect(within(log).getByText("ls")).toBeInTheDocument();
	});

	it("sudo shows easter egg output", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();
		await user.type(input, "sudo rm -rf /{Enter}");
		const log = screen.getByRole("log");
		expect(within(log).getByText("sudo rm -rf /")).toBeInTheDocument();
	});
});

describe("TerminalInput — tab completion", () => {
	it("completes unique prefix on Tab", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		await user.type(input, "/who");
		await user.tab();

		expect(input).toHaveValue("/whoami");
	});

	it("shows completion list on Tab with multiple matches", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		input.focus();
		await user.keyboard("/");
		await user.keyboard("{Tab}");

		const log = screen.getByRole("log");
		const completionText = within(log).getByText(
			(content) => content.includes("/whoami") && content.includes("/help"),
		);
		expect(completionText).toBeInTheDocument();
	});

	it("Tab on empty input does nothing", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		await user.click(input);
		await user.tab();

		expect(input).toHaveValue("");
	});
});

describe("TerminalInput — history navigation", () => {
	it("ArrowUp recalls previous command, ArrowDown restores draft", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		await user.type(input, "/whoami{Enter}");
		await user.type(input, "/skills{Enter}");

		// Start typing a draft then navigate up
		await user.type(input, "/he");
		await user.keyboard("{ArrowUp}");
		expect(input).toHaveValue("/skills");

		await user.keyboard("{ArrowUp}");
		expect(input).toHaveValue("/whoami");

		await user.keyboard("{ArrowDown}");
		expect(input).toHaveValue("/skills");

		await user.keyboard("{ArrowDown}");
		expect(input).toHaveValue("/he");
	});

	it("ArrowUp on empty history is a no-op", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		await user.click(input);
		await user.keyboard("{ArrowUp}");
		expect(input).toHaveValue("");
	});
});

describe("Terminal — rapid input / stress", () => {
	it("handles many commands in a row without error", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		for (const cmd of ["/whoami", "/skills", "/projects", "/links", "/experience", "/help"]) {
			await user.type(input, `${cmd}{Enter}`);
		}

		expect(screen.getAllByText("visitor")).toHaveLength(6);
	});

	it("help entries are clickable and execute the command", async () => {
		const user = userEvent.setup();
		renderTerminal();
		const input = await waitForReady();

		await user.type(input, "/help{Enter}");

		const [firstHelpButton] = await screen.findAllByRole("button", { name: /\/whoami/ });
		if (!firstHelpButton) throw new Error("help button not found");
		await user.click(firstHelpButton);

		// After the click, a second prompt entry exists (welcome + /help + /whoami)
		expect(screen.getAllByText("visitor")).toHaveLength(2);
	});
});
