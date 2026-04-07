export const identity = {
	name: "Francesco Albanese",
	role: "Lead AI Engineer",
	location: "London, UK",
	site: "francescoalbanese.dev",
	bio: [
		"10+ years building software across fintech, cybersecurity, and travel.",
		"Clients include WorldFirst (Ant Group), Red Sift, and Pirum Systems.",
		"Currently focused on LLM agents, RAG pipelines, and AI-driven developer tools.",
	],
	certifications: [
		{
			label: "AWS Solutions Architect Associate Certified",
			url: "https://www.credly.com/badges/f2170eb0-99b3-4e0d-812c-fc9d8e4b5468/public_url",
		},
	],
} as const;

export type SkillCategory = {
	label: string;
	color: "purple" | "blue" | "teal" | "yellow";
	items: readonly string[];
};

export const skills: readonly SkillCategory[] = [
	{
		label: "AI",
		color: "purple",
		items: ["LLM Agents", "RAG", "Text-to-SQL", "Prompt Engineering", "Fine-tuning"],
	},
	{
		label: "Backend",
		color: "blue",
		items: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "Python", "Go"],
	},
	{
		label: "Infra",
		color: "teal",
		items: ["AWS", "Terraform", "Docker", "CI/CD"],
	},
	{
		label: "Frontend",
		color: "yellow",
		items: ["React", "Next.js", "Astro", "Tailwind CSS", "TypeScript"],
	},
] as const;

export const links = [
	{ label: "GitHub", url: "https://github.com/francesco-albanese", icon: "gh" },
	{
		label: "LinkedIn",
		url: "https://www.linkedin.com/in/albanesefrancesco/",
		icon: "li",
	},
	{ label: "Email", url: "mailto:hello@francescoalbanese.dev", icon: "mail" },
	{
		label: "Website",
		url: "https://francescoalbanese.dev",
		icon: "web",
	},
] as const;

export const projects = [
	{
		name: "aws-api-gateway-mtls",
		description: "Asymmetric mTLS authentication for AWS API Gateway",
		tags: ["AWS", "Terraform", "mTLS"],
		url: "https://github.com/francesco-albanese/aws-api-gateway-mtls",
	},
	{
		name: "python-token-generator",
		description: "Lightweight cryptographic token generation utility",
		tags: ["Python", "Crypto"],
		url: "https://github.com/francesco-albanese/python-token-generator",
	},
	{
		name: "aws-multi-account",
		description: "Multi-account AWS infrastructure patterns via Terraform",
		tags: ["AWS", "Terraform", "IaC"],
		url: "https://github.com/francesco-albanese/aws-multi-account",
	},
] as const;

export const experience = [
	{
		role: "Lead AI Engineer",
		company: "Pirum Systems",
		period: "Nov 2021 – Present",
	},
	{
		role: "Senior Software Engineer",
		company: "WorldFirst",
		period: "Dec 2019 – Nov 2021",
	},
	{
		role: "Software Engineer",
		company: "Red Sift",
		period: "Jan 2019 – Nov 2019",
	},
	{
		role: "Web Developer",
		company: "Global Gaming",
		period: "Feb 2018 – Dec 2018",
	},
	{
		role: "Web Developer",
		company: "3Bet Gaming / Betagy",
		period: "Mar 2017 – Feb 2018",
	},
	{
		role: "Web Developer",
		company: "Booking and Co",
		period: "Jun 2016 – Mar 2017",
	},
	{
		role: "Web Developer",
		company: "Multicom Products",
		period: "May 2015 – Jun 2016",
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
