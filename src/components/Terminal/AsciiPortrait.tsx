import { useState } from "react";

type AsciiPortraitProps = {
	profilePictureSrc: string;
};

const PORTRAIT = `
.-:......:==------+-....:-:...:::.:*+:.-
.-:.......-:....:-+*****++=----++==**:
-+-.......--...-###***###%#+::-+==+%#=:-
-+=:::::::==::+#%+-:..:::--*+.:-:.-#+::-
-+=::::::-++:=#%%+:::.....:-*--=-:-#*--=
-*=:::...:++::+%#-==+=---=++*=+*+=*%%+=*
=*+===-:..==:::=+:::-:::----=-=*=-+%%+=*
-++----:..==.::-*=:---=-==:-=-+*+=+%#==*
-+=-:::...--..:-##*=----==**-:+**++##--=
-+=--::. .:-....+%%*=:-=-*#=:-***++##-::
-+=---:. .-==+=-:-+#######=--=**==+##-::
-++--::::=++*###*=:::-=-+*+===**+=+##-::
:=+---=++++***#####*+++*##*******++##-:-
---==+********######%%%%###*****#*+**--+
-:-+**########*###########*******##**--=
:-+**#########****#########******##*#+=+
-+*###############*#########*****%##*=-+
+*#######%%####################*%%%#*-:-
*#######%%%%####################@%%%#+--
*######%%%#####################%@%%%##++
######%%%%##############*###*###%%%%%#+=
######*#################**###***#%%%%%#+
#####+=#%################**##***#%%%%##*
###%*===#%%###############*****#*#%%###*
####*+==*###################******#%###*
#####*++*####################****+*%###*
######**######################*****####*`.trim();

export function AsciiPortrait({ profilePictureSrc }: AsciiPortraitProps) {
	const [showPhoto, setShowPhoto] = useState(false);

	const handleTap = (e: React.TouchEvent) => {
		e.preventDefault();
		setShowPhoto((prev) => !prev);
	};

	return (
		<button
			type="button"
			aria-label="Toggle profile portrait"
			className="relative cursor-pointer inline-block bg-transparent border-0 p-0"
			onMouseEnter={() => setShowPhoto(true)}
			onMouseLeave={() => setShowPhoto(false)}
			onTouchEnd={handleTap}
		>
			<pre
				className={`font-mono text-[0.55rem] leading-[0.65rem] select-none whitespace-pre transition-opacity duration-300 ${showPhoto ? "opacity-0" : "text-muted opacity-100"}`}
				aria-hidden="true"
			>
				{PORTRAIT}
			</pre>
			<img
				src={profilePictureSrc}
				alt="Francesco Albanese – Lead AI Engineer, profile portrait"
				loading="lazy"
				decoding="async"
				className={`absolute inset-0 w-full h-full object-cover rounded transition-opacity duration-300 ${showPhoto ? "opacity-100" : "opacity-0"}`}
			/>
		</button>
	);
}
