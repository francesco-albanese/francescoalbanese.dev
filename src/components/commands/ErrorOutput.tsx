import { commands } from "@/content/data";

type ErrorOutputProps = {
	input: string;
};

export function ErrorOutput({ input }: ErrorOutputProps) {
	const bare = input.trim();
	const asCommand = `/${bare}`;
	const isKnownBare = bare in commands;

	if (isKnownBare) {
		return (
			<p className="text-yellow">
				did you mean <span className="text-coral">{asCommand}</span>?
			</p>
		);
	}

	return (
		<p className="text-red">
			command not found: {bare.startsWith("/") ? bare : input} — try{" "}
			<span className="text-coral">/help</span>
		</p>
	);
}
