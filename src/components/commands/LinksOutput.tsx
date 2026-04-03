import { links } from "@/content/data";
import { useStreamLines } from "@/hooks/useStreamLines";

export function LinksOutput() {
	const { visibleItems: visibleLinks } = useStreamLines([...links]);

	return (
		<div className="space-y-1.5">
			{visibleLinks.map((link) => (
				<div key={link.label} className="flex gap-3">
					<span className="text-muted min-w-[10ch]">{link.label}</span>
					<a
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-coral hover:underline"
					>
						{link.url.replace(/^(mailto:|https?:\/\/)/, "")}
					</a>
				</div>
			))}
		</div>
	);
}
