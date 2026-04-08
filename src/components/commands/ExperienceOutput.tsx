import { experience } from "@/content/data";
import { useStreamLines } from "@/hooks/useStreamLines";

export function ExperienceOutput() {
	const { visibleItems: visibleEntries } = useStreamLines(experience);

	return (
		<div className="relative ml-3">
			<div className="absolute left-0 top-1 bottom-1 w-px bg-faint/30" />
			<div className="space-y-3">
				{visibleEntries.map((entry) => (
					<div key={entry.period} className="relative pl-5">
						<div className="absolute left-[-3px] top-[7px] h-[7px] w-[7px] rounded-full bg-coral" />
						<p className="text-primary">{entry.role}</p>
						<p className="text-cyan text-sm">{entry.company}</p>
						<p className="text-primary text-sm">{entry.period}</p>
					</div>
				))}
			</div>
		</div>
	);
}
