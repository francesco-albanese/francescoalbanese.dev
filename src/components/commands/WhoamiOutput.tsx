import { identity } from "@/content/data";

export function WhoamiOutput() {
	return (
		<div className="space-y-2">
			<p className="text-cyan font-semibold">{identity.name}</p>
			<p className="text-coral">{identity.role}</p>
			<div className="ml-2 space-y-0.5">
				{identity.bio.map((line) => (
					<p key={line} className="text-muted">
						{line}
					</p>
				))}
			</div>
		</div>
	);
}
