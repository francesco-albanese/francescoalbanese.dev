import type { ReactNode } from "react";
import { commands } from "@/content/data";
import { CatOutput, LsOutput, SudoOutput } from "./EasterEggs";
import { ErrorOutput } from "./ErrorOutput";
import { ExperienceOutput } from "./ExperienceOutput";
import { HelpOutput } from "./HelpOutput";
import { LinksOutput } from "./LinksOutput";
import { ProjectsOutput } from "./ProjectsOutput";
import { SkillsOutput } from "./SkillsOutput";
import { WhoamiOutput } from "./WhoamiOutput";

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
	"/projects": () => <ProjectsOutput />,
	"/experience": () => <ExperienceOutput />,
};

export type DispatchResult = { type: "output"; node: ReactNode } | { type: "clear" };

export function dispatch(raw: string, ctx: CommandContext): DispatchResult | null {
	const input = raw.trim();
	if (!input) return null;

	const egg = matchEasterEgg(input.toLowerCase());
	if (egg) return { type: "output", node: egg };

	const normalized = input.startsWith("/") ? input.toLowerCase() : `/${input.toLowerCase()}`;

	if (normalized === "/clear") {
		return { type: "clear" };
	}

	const handler = handlers[normalized];
	if (handler) {
		return { type: "output", node: handler(ctx) };
	}
	if (normalized in commands) {
		return {
			type: "output",
			node: <p className="text-muted">{normalized} — coming soon</p>,
		};
	}

	return { type: "output", node: <ErrorOutput input={input} /> };
}

function matchEasterEgg(input: string): ReactNode | null {
	if (input.startsWith("sudo")) return <SudoOutput />;
	if (input === "ls" || input === "/ls") return <LsOutput />;
	if (input === "cat" || input === "/cat") return <CatOutput />;
	return null;
}
