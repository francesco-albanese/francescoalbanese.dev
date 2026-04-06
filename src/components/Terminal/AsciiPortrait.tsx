const PORTRAIT = `
        ,##,,eew,
      ,##############C
   a###############@##
  7####^\`^\`"7W7^"@####
  @#@b\`         ^@#@^
   ##^,,,,   ,,,,^#^
  ,,@######"#######=
   .''555"\` '5555b|
   T"@  ,,,^,mg,@,*
      %p||\`~~'.#\`
       ^Wp  ,#T
      :b''@@b^}
   ,^     \` 'b 3-
 .<\` 'p   ^v   #   b   *.
{      }   #"GpGb   [
C      3 * @#######Nl      \`
'            ^@##b     ($    !`.trim();

export function AsciiPortrait() {
	return (
		<pre
			className="text-muted text-[0.55rem] leading-[0.65rem] select-none font-mono whitespace-pre"
			aria-hidden="true"
		>
			{PORTRAIT}
		</pre>
	);
}
