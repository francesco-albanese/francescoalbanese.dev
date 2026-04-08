import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { projects } from "@/content/data";
import { useStreamLines } from "@/hooks/useStreamLines";

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
	return (
		<div className="border border-faint/20 rounded bg-surface/50 p-3 space-y-1.5">
			<p className="text-cyan font-semibold">{project.name}</p>
			<p className="text-primary text-sm">{project.description}</p>
			<div className="flex flex-wrap gap-1.5">
				{project.tags.map((tag) => (
					<span
						key={tag}
						className="inline-block rounded-full bg-blue/20 text-blue px-2 py-0.5 text-xs"
					>
						{tag}
					</span>
				))}
			</div>
			<a
				href={project.url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-coral underline underline-offset-2 hover:no-underline text-sm"
			>
				GitHub
				<ExternalLinkIcon />
			</a>
		</div>
	);
}

export function ProjectsOutput() {
	const { visibleItems: visibleProjects } = useStreamLines(projects);

	return (
		<div className="space-y-3">
			{visibleProjects.map((project) => (
				<ProjectCard key={project.name} project={project} />
			))}
		</div>
	);
}
