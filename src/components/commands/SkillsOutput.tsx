import { skills } from "@/content/data";

const tagClasses: Record<"purple" | "blue" | "teal" | "yellow", string> = {
	purple: "bg-purple/20 text-purple",
	blue: "bg-blue/20 text-blue",
	teal: "bg-teal/20 text-teal",
	yellow: "bg-yellow/20 text-yellow",
};

const labelClasses: Record<"purple" | "blue" | "teal" | "yellow", string> = {
	purple: "text-purple",
	blue: "text-blue",
	teal: "text-teal",
	yellow: "text-yellow",
};

function Tag({
	label,
	color,
}: {
	label: string;
	color: "purple" | "blue" | "teal" | "yellow";
}) {
	return (
		<span
			className={`inline-block rounded-full px-2 py-0.5 text-xs ${tagClasses[color]}`}
		>
			{label}
		</span>
	);
}

export function SkillsOutput() {
	return (
		<div className="space-y-3">
			{skills.map((group) => (
				<div key={group.label} className="space-y-1">
					<p className={`${labelClasses[group.color]} font-semibold`}>
						{group.label}
					</p>
					<div className="ml-2 flex flex-wrap gap-1.5">
						{group.items.map((item) => (
							<Tag key={item} label={item} color={group.color} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
