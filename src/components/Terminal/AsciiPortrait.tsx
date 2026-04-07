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
			className="relative cursor-pointer inline-block mx-auto md:mx-0 bg-transparent border-0 p-0"
			onMouseEnter={() => setShowPhoto(true)}
			onMouseLeave={() => setShowPhoto(false)}
			onTouchEnd={handleTap}
			aria-label="Toggle profile portrait"
		>
			<pre
				className={`font-mono text-[clamp(0.4rem,1.4vw,0.55rem)] leading-[1.1] select-none whitespace-pre transition-opacity duration-300 ${showPhoto ? "opacity-0" : "text-muted opacity-100"}`}
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
