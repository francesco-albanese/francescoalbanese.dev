import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { identity } from "@/content/data";
import { useStreamLines } from "@/hooks/useStreamLines";

export function WhoamiOutput() {
	const { visibleItems: visibleLines } = useStreamLines(identity.bio);

	return (
		<div className="space-y-2">
			<p className="text-cyan font-semibold">{identity.name}</p>
			<p className="text-coral">Lead AI Engineer</p>
			<div className="ml-2 space-y-0.5">
				{visibleLines.map((line) => (
					<p key={line} className="text-muted">
						{line}
					</p>
				))}
				{visibleLines.length === identity.bio.length &&
					identity.certifications.map((cert) => (
						<p key={cert.label} className="text-muted">
							<a
								href={cert.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-coral underline underline-offset-2 hover:no-underline inline-flex items-center gap-1"
							>
								{cert.label}
								<ExternalLinkIcon />
							</a>
						</p>
					))}
			</div>
		</div>
	);
}
