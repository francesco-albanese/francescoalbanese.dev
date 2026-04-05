const PORTRAIT = `
          .~?JJJJJJJJJJJ?~.
       .!JJJJJJJJJJJJJJJJJJJ!.
     .?JJJJ?~.          .~?JJJJ?.
    !JJJJ~    .^!77777!^.    ~JJJJ!
   ?JJJ~   .7YPGGGGGGGGGPY7.   ~JJJ?
  7JJJ.  .JGGGGGGGGGGGGGGGGGJ.  .JJJ7
  JJJ:  ^GGGGGGGGGGGGGGGGGGGGG^  :JJJ
  JJ?  ~GGGGGGGGGGGGGGGGGGGGGG~   ?JJ
  JJ?  JGGP!  7GGGGGG7  !PGGJ     ?JJ
  JJ? .GG5 :YY.5GGGG5.YY: 5GG.   ?JJ
  JJ? .GG5 :55.5GGGG5.55: 5GG.   ?JJ
  JJ?  JGGP!  7GGGGGG7  !PGGJ     ?JJ
  JJJ   YGGGGGGGGGGGGGGGGGGGY     JJJ
  7JJ?   !PGGGGGGGGGGGGGGGP!    ?JJ7
   ?JJJ.   :!JPGGGGGGGPJ!:   .JJJ?
    !JJJ7.     .:^^^^:.     .7JJJ!
     .?JJJY7!^.        .^!7YJJJ?.
       .~?JJJJJYY?~~?YYJJJJJ?~.
           .^~!?JJJJJJJ?!~^.
         .!YPGGGGGGGGGGGGGPY!.
        7GGGGGGGGGGGGGGGGGGGGG7
       JGGG?^.            .^?GGGJ
      5GGG^                  ^GGG5
      PGGG                    GGGP
      5GGG^     .^~~~~^.     ^GGG5
       JGGG?: .:~^^^^^^~:. :?GGGJ
        7GGGGGGG!        !GGGGGGG7
         .!YPGGGGGY?77?YGGGGGPY!.
            .:!?Y5PGGGP5Y?!:.
`.trim();

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
