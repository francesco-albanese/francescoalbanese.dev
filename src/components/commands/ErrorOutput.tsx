type ErrorOutputProps = {
	input: string;
};

export function ErrorOutput({ input }: ErrorOutputProps) {
	const bare = input.trim();

	return (
		<p className="text-red">
			command not found: {bare} — try <span className="text-coral">help</span> or tap a suggestion
		</p>
	);
}
