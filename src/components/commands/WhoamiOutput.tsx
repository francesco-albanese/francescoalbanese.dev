import { identity, experience } from "@/content/data";
import { useStreamLines } from "@/hooks/useStreamLines";
import { useRoleCycle } from "@/hooks/useRoleCycle";

const roles = experience.map((e) => e.role);

export function WhoamiOutput() {
	const { displayed: roleText } = useRoleCycle(roles);
	const { visibleItems: visibleLines } = useStreamLines(identity.bio);

	return (
		<div className="space-y-2">
			<p className="text-cyan font-semibold">{identity.name}</p>
			<p className="text-coral">{roleText}</p>
			<div className="ml-2 space-y-0.5">
				{visibleLines.map((line) => (
					<p key={line} className="text-muted">
						{line}
					</p>
				))}
			</div>
		</div>
	);
}
