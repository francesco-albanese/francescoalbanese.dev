export const identity = {
	name: "Francesco Albanese",
	role: "Lead AI Engineer",
	location: "London, UK",
	site: "francescoalbanese.dev",
	bio: [
		"Lead AI Engineer building intelligent systems at scale.",
		"Specialising in LLM applications, RAG pipelines, and AI-driven developer tools.",
		"Previously: full-stack engineering across fintech, healthtech, and e-commerce.",
	],
} as const;

export const skills = {
	languages: ["TypeScript", "Python", "Go", "SQL"],
	ai: ["LLM Agents", "RAG", "Text-to-SQL", "Prompt Engineering", "Fine-tuning"],
	frontend: ["React", "Next.js", "Astro", "Tailwind CSS"],
	backend: ["Node.js", "FastAPI", "PostgreSQL", "Redis"],
	infrastructure: ["AWS", "Terraform", "Docker", "CI/CD"],
	tools: ["Claude Code", "Cursor", "Mastra", "LangChain"],
} as const;

export const links = [
	{ label: "GitHub", url: "https://github.com/francesco-albanese", icon: "gh" },
	{
		label: "LinkedIn",
		url: "https://linkedin.com/in/francescoalbanese",
		icon: "li",
	},
	{ label: "Email", url: "mailto:hello@francescoalbanese.dev", icon: "mail" },
] as const;

export const projects = [
	{
		name: "francescoalbanese.dev",
		description: "This terminal portfolio — Astro + React + Tailwind",
		url: "https://github.com/francesco-albanese/francescoalbanese.dev",
	},
] as const;

export const experience = [
	{
		role: "Lead AI Engineer",
		company: "Current",
		period: "2024 – present",
		summary: "Building LLM-powered applications and AI infrastructure",
	},
] as const;

export type CommandDefinition = {
	description: string;
	usage?: string;
};

export const commands: Record<string, CommandDefinition> = {
	"/help": { description: "List all available commands" },
	"/clear": { description: "Clear terminal output" },
	"/whoami": { description: "About me — name, role, bio" },
	"/skills": { description: "Technical skills and tools" },
	"/links": { description: "Contact and social links" },
	"/projects": { description: "Things I've built" },
	"/experience": { description: "Work history" },
};
