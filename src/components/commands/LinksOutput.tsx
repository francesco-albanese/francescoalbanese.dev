import { links } from "@/content/data";

export function LinksOutput() {
	return (
		<div className="space-y-1.5">
			{links.map((link) => (
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
