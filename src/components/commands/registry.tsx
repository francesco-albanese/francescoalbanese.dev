import type { ReactNode } from "react";
import { commands } from "@/content/data";
import { HelpOutput } from "./HelpOutput";
import { ErrorOutput } from "./ErrorOutput";
import { WhoamiOutput } from "./WhoamiOutput";
import { SkillsOutput } from "./SkillsOutput";
import { LinksOutput } from "./LinksOutput";

type CommandContext = {
	onExecuteCommand: (command: string) => void;
};

type CommandHandler = (ctx: CommandContext) => ReactNode;

const handlers: Record<string, CommandHandler> = {
	"/help": (ctx) => <HelpOutput onExecuteCommand={ctx.onExecuteCommand} />,
	"/clear": () => null,
	"/whoami": () => <WhoamiOutput />,
	"/skills": () => <SkillsOutput />,
	"/links": () => <LinksOutput />,
};

export type DispatchResult =
	| { type: "output"; node: ReactNode }
	| { type: "clear" };

export function dispatch(
	raw: string,
	ctx: CommandContext,
): DispatchResult | null {
	const input = raw.trim();
	if (!input) return null;

	if (input === "/clear") {
		return { type: "clear" };
	}

	if (input.startsWith("/")) {
		const handler = handlers[input];
		if (handler) {
			return { type: "output", node: handler(ctx) };
		}
		if (input in commands) {
			return {
				type: "output",
				node: <p className="text-muted">{input} — coming soon</p>,
			};
		}
		return { type: "output", node: <ErrorOutput input={input} /> };
	}

	return { type: "output", node: <ErrorOutput input={input} /> };
}
