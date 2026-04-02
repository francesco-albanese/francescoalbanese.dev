# Portfolio Implementation Plan

# francescoalbanese.dev — Claude Code CLI Portfolio

---

## OVERVIEW

Build a personal portfolio website for Francesco Albanese (Lead AI Engineer) that looks
and behaves like a Claude Code terminal session running in a browser. Visitors interact
via slash commands. The aesthetic is taken verbatim from the Claude Code CLI.

**Key constraint**: This is a static site. No backend, no auth, no database.
Every section is revealed via CLI commands typed into an input at the bottom of the page.

---

## TECH STACK

| Concern     | Choice                          |
| ----------- | ------------------------------- |
| Framework   | Astro 4.x (`output: 'static'`)  |
| UI islands  | React 19 + TypeScript           |
| Styling     | Tailwind CSS v4                 |
| Animations  | CSS only — custom React hooks   |
| Fonts       | JetBrains Mono (Google Fonts)   |
| SEO         | Astro built-in + astro-seo      |
| Deploy      | AWS S3 + CloudFront (Terraform) |
| Package mgr | pnpm                            |

---

Make sure to apply all the best security practices described in here by pnpm https://pnpm.io/supply-chain-security and allow for a minimumReleaseAge of a week to be cautious.

## PHASE 0 — SCAFFOLD

Check thoroughly Astro documentation first https://docs.astro.build/en/develop-and-build/

```bash
## Astro has to be initialized but the directory has already been created, it's this one
## francescoalbanese.dev
pnpm create astro@latest francescoalbanese-dev \
  --template minimal \
  --typescript strict \
  --no-install

# Add integrations
pnpm astro add react tailwind

# Dependencies
pnpm add astro-seo
pnpm add -D @types/react @types/react-dom

# Fonts (self-hosted via fontsource for perf + no external request)
pnpm add @fontsource/jetbrains-mono
```

### astro.config.mjs

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",
  site: "https://www.francescoalbanese.dev",
  integrations: [react(), tailwind()],
});
```

### tsconfig.json — strict mode

```json
{
  "extends": "astro/tsconfigs/strictest",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

---

## PHASE 1 — DESIGN TOKENS (EXACT CLAUDE CODE PALETTE)

![Cluade palette](claude.png)

### src/styles/tokens.css

Extract these exact values from the Claude Code screenshot.
Define as CSS custom properties on :root. Tailwind config must reference these.
DOUBLE CHECK ON THESE FROM THE SCREENSHOT!

```css
:root {
  /* Backgrounds */
  --bg-base: #1a1b26; /* main terminal bg */
  --bg-surface: #1f2335; /* card / elevated surface */
  --bg-overlay: #24283b; /* borders, dividers */
  --bg-statusbar: #0f1019; /* bottom status bar */

  /* Text */
  --text-primary: #c0caf5; /* main readable text */
  --text-secondary: #a9b1d6; /* slightly dimmer */
  --text-muted: #4a5078; /* comments, hints */
  --text-faint: #2f3549; /* very subtle, separators */

  /* Accents — taken from Claude Code UI */
  --accent-coral: #ff9e64; /* prompt ›, role text, highlights */
  --accent-purple: #bb9af7; /* agentic / AI tags */
  --accent-blue: #7aa2f7; /* links, path breadcrumb */
  --accent-teal: #73c8a9; /* infra tags, success */
  --accent-yellow: #e0af68; /* frontend tags, warnings */
  --accent-cyan: #7dcfff; /* project names, keywords */
  --accent-red: #f7768e; /* errors */

  /* Status bar pills */
  --pill-model-bg: #1e1633;
  --pill-model-fg: #bb9af7;
  --pill-dir-bg: #1e1408;
  --pill-dir-fg: #e0af68;
  --pill-loc-bg: #051c1a;
  --pill-loc-fg: #73c8a9;

  /* Typography */
  --font-mono: "JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace;

  /* Misc */
  --border-radius: 6px;
  --cursor-color: #ff9e64;
}
```

### tailwind.config.mjs

```js
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      colors: {
        base: "#1a1b26",
        surface: "#1f2335",
        overlay: "#24283b",
        statusbar: "#0f1019",
        coral: "#ff9e64",
        purple: "#bb9af7",
        blue: "#7aa2f7",
        teal: "#73c8a9",
        yellow: "#e0af68",
        cyan: "#7dcfff",
        red: "#f7768e",
        primary: "#c0caf5",
        secondary: "#a9b1d6",
        muted: "#4a5078",
        faint: "#2f3549",
      },
    },
  },
  plugins: [],
};
```

---

## PHASE 2 — FILE STRUCTURE

DOUBLE CHECK [Francesco Albanese CV](./FrancescoAlbanese_CV.jpg) first and let's reason together on what sections we want to add and which ones we don't want to add, which sections should be part of the terminal and which don't.

```
src/
├── components/
│   ├── Terminal/
│   │   ├── Terminal.tsx          ← root island (client:load)
│   │   ├── TerminalOutput.tsx    ← scrollable output area
│   │   ├── TerminalInput.tsx     ← bottom input row
│   │   ├── StatusBar.tsx         ← bottom pill bar
│   │   └── HeaderBar.tsx         ← top path breadcrumb
│   ├── commands/
│   │   ├── WhoAmI.tsx            ← /whoami output
│   │   ├── Skills.tsx            ← /skills output
│   │   ├── Projects.tsx          ← /projects output
│   │   ├── Links.tsx             ← /links output
│   │   └── Help.tsx              ← /help output
│   └── ui/
│       ├── TypewriterText.tsx    ← typewriter hook + component
│       ├── RoleCycler.tsx        ← cycles Lead AI Engineer ↔ Senior Staff Engineer
│       ├── StreamingLines.tsx    ← streams array of lines in sequence
│       ├── Pill.tsx              ← status bar pill
│       └── Tag.tsx               ← skill tag
├── content/
│   └── data.ts                   ← ALL content in one file, easy to update
├── hooks/
│   ├── useTypewriter.ts          ← character-by-character reveal
│   ├── useRoleCycle.ts           ← erase + retype between roles
│   └── useStreamLines.ts         ← streams array of ReactNodes line by line
├── layouts/
│   └── BaseLayout.astro          ← html shell, SEO, fonts
└── pages/
    └── index.astro               ← mounts <Terminal client:load />
```

---

## PHASE 3 — CONTENT FILE (single source of truth)

DOUBLE CHECK [Francesco Albanese CV](./FrancescoAlbanese_CV.jpg) first and let's reason together on what sections we want to add and which ones we don't want to add, which sections should be part of the terminal and which don't.

### src/content/data.ts

```ts
export const IDENTITY = {
  name: "Francesco Albanese",
  roles: ["Lead AI Engineer", "Senior Staff Engineer"],
  location: "London, UK",
  domain: "francescoalbanese.dev",
};

export const BIO_LINES = [
  { text: "──────────────────────────────────────────", color: "faint" },
  {
    text: "10+ years building full-stack distributed systems",
    color: "secondary",
  },
  { text: "across fintech, cybersecurity, and travel.", color: "muted" },
  { text: "" },
  { text: "Clients: JPMorgan · Citi · HSBC · Barclays ·", color: "muted" },
  { text: "BNY Mellon · BlackRock.", color: "muted" },
  { text: "" },
  { text: "Currently leading AI engineering — architecting", color: "muted" },
  { text: "GenAI solutions, agentic workflows, and", color: "muted" },
  { text: "LLM-powered systems for high-traffic platforms.", color: "muted" },
  { text: "" },
  { text: "Coding isn't just my job.", color: "muted" },
  { text: "It's the nerdiest part of my personality.", color: "coral" },
  { text: "──────────────────────────────────────────", color: "faint" },
];

export const SKILLS = [
  {
    group: "AI",
    color: "purple",
    items: ["LLMs", "RAG", "Agentic Workflows", "Evals", "Claude Code"],
  },
  {
    group: "Backend",
    color: "blue",
    items: ["TypeScript", "Python", "Node.js"],
  },
  {
    group: "Infra",
    color: "teal",
    items: ["AWS", "Terraform", "CI/CD", "GitLab", "GitHub"],
  },
  {
    group: "Frontend",
    color: "yellow",
    items: ["React", "Tailwind CSS"],
  },
];

export const PROJECTS = [
  {
    name: "aws-api-gateway-mtls",
    description:
      "Asymmetric mTLS authentication for high-traffic AWS API Gateway",
    url: "https://github.com/francesco-albanese/aws-api-gateway-mtls",
    tags: ["AWS", "Security", "TypeScript"],
  },
  {
    name: "python-token-generator",
    description: "Lightweight cryptographic token generation utility",
    url: "https://github.com/francesco-albanese/python-token-generator",
    tags: ["Python", "Security"],
  },
  {
    name: "aws-multi-account",
    description: "Multi-account AWS infrastructure patterns via Terraform",
    url: "https://github.com/francesco-albanese/aws-multi-account",
    tags: ["AWS", "Terraform", "Infra"],
  },
];

export const LINKS = [
  { label: "github", url: "https://github.com/francesco-albanese" },
  { label: "linkedin", url: "https://linkedin.com/in/albanesefrancesco/" },
  { label: "email", url: "mailto:francescoalbanese@yahoo.co.uk" },
  { label: "website", url: "https://www.francescoalbanese.dev" },
];

export const COMMANDS = [
  { cmd: "/whoami", desc: "about me" },
  { cmd: "/skills", desc: "tech stack" },
  { cmd: "/projects", desc: "pinned repos" },
  { cmd: "/links", desc: "contact & profiles" },
  { cmd: "/clear", desc: "clear terminal" },
  { cmd: "/help", desc: "show this menu" },
];
```

---

## PHASE 4 — HOOKS

NOT SURE WE NEED ALL OF THESE, THESE ARE JUST EXAMPLES

### src/hooks/useTypewriter.ts

```ts
import { useState, useEffect } from "react";

export function useTypewriter(text: string, speed = 65, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}
```

### src/hooks/useRoleCycle.ts

```ts
import { useState, useEffect, useRef } from "react";

export function useRoleCycle(roles: string[], pauseMs = 2800, speed = 65) {
  const [text, setText] = useState(roles[0]);
  const idxRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const erase = (current: string, cb: () => void) => {
      let t = current;
      const iv = setInterval(() => {
        if (cancelled) {
          clearInterval(iv);
          return;
        }
        t = t.slice(0, -1);
        setText(t);
        if (!t.length) {
          clearInterval(iv);
          cb();
        }
      }, 45);
    };

    const type = (target: string, cb: () => void) => {
      let i = 0;
      const iv = setInterval(() => {
        if (cancelled) {
          clearInterval(iv);
          return;
        }
        setText(target.slice(0, ++i));
        if (i >= target.length) {
          clearInterval(iv);
          cb();
        }
      }, speed);
    };

    const cycle = () => {
      if (cancelled) return;
      setTimeout(() => {
        if (cancelled) return;
        const current = roles[idxRef.current];
        erase(current, () => {
          idxRef.current = (idxRef.current + 1) % roles.length;
          type(roles[idxRef.current], cycle);
        });
      }, pauseMs);
    };

    cycle();
    return () => {
      cancelled = true;
    };
  }, []);

  return text;
}
```

### src/hooks/useStreamLines.ts

```ts
import { useState, useEffect } from "react";

export function useStreamLines<T>(lines: T[], delayMs = 45, startDelay = 0) {
  const [visible, setVisible] = useState<T[]>([]);

  useEffect(() => {
    setVisible([]);
    let i = 0;
    const to = setTimeout(() => {
      const iv = setInterval(() => {
        setVisible((prev) => [...prev, lines[i++]]);
        if (i >= lines.length) clearInterval(iv);
      }, delayMs);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(to);
  }, [lines]);

  return visible;
}
```

---

## PHASE 5 — TERMINAL COMPONENTS

CHECK HOW THIS TERMINAL WEBSITE WORKS FIRST, I LIKE IT A LOT https://terminal.satnaing.dev/
![terminal website](terminal-website.png)
CHECK THE VIDEO INTERACTION, I LIKE THAT A LOT, I'D LIKE SOMETHING SIMILAR.
ASK THE USER TO SETUP AN MCP SO YOU CAN UNDERSTAND HOW THE INTERACTION OF CLAUDE CODE WORKS FROM THE BROWSER AND ALSO HOW THE INTERACTION OF THE WEBSITE LISTED ABOVE WORKS.

### src/components/Terminal/HeaderBar.tsx

```tsx
export function HeaderBar() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-overlay text-xs font-mono flex-shrink-0">
      <span className="text-blue">~/francescoalbanese.dev</span>
      <span className="text-faint">›</span>
      <span className="text-primary">portfolio</span>
    </div>
  );
}
```

### src/components/ui/Pill.tsx

```tsx
interface PillProps {
  children: React.ReactNode;
  variant: "model" | "dir" | "loc";
}

const variants = {
  model: "bg-[#1e1633] text-purple",
  dir: "bg-[#1e1408] text-yellow",
  loc: "bg-[#051c1a] text-teal",
};

export function Pill({ children, variant }: PillProps) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-[11px] font-mono tracking-wide ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
```

### src/components/Terminal/StatusBar.tsx

```tsx
import { Pill } from "@/components/ui/Pill";

export function StatusBar() {
  return (
    <div className="bg-statusbar flex items-center gap-1.5 px-3 py-1 flex-shrink-0">
      <Pill variant="model">⬡ Lead AI Engineer</Pill>
      <Pill variant="dir">📁 francescoalbanese.dev</Pill>
      <Pill variant="loc">◎ London, UK</Pill>
      <span className="flex-1" />
      <span className="text-faint text-[10px] font-mono">
        francescoalbanese · 2025
      </span>
    </div>
  );
}
```

### src/components/ui/RoleCycler.tsx

```tsx
import { useRoleCycle } from "@/hooks/useRoleCycle";

export function RoleCycler({ roles }: { roles: string[] }) {
  const text = useRoleCycle(roles);
  return (
    <span className="text-coral">
      {text}
      <span className="inline-block w-2 h-3.5 bg-coral ml-0.5 align-middle animate-[blink_1.1s_step-end_infinite]" />
    </span>
  );
}
```

Add to tailwind.config.mjs keyframes:

```js
keyframes: {
  blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } }
},
animation: {
  blink: 'blink 1.1s step-end infinite',
}
```

---

## PHASE 6 — COMMAND COMPONENTS

### src/components/commands/WhoAmI.tsx

```tsx
import { RoleCycler } from "@/components/ui/RoleCycler";
import { useStreamLines } from "@/hooks/useStreamLines";
import { IDENTITY, BIO_LINES } from "@/content/data";

// Color map → Tailwind classes
const colorMap: Record<string, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-muted",
  faint: "text-faint",
  coral: "text-coral",
};

export function WhoAmI() {
  const visibleLines = useStreamLines(BIO_LINES, 45, 80);

  return (
    <div className="mt-1 mb-2 font-mono">
      <div className="text-[17px] font-semibold text-primary tracking-wide mb-0.5">
        {IDENTITY.name}
      </div>
      <div className="flex items-center gap-1 mb-3">
        <span className="text-coral text-sm">›</span>
        <RoleCycler roles={IDENTITY.roles} />
      </div>
      {visibleLines.map((line, i) => (
        <div
          key={i}
          className={`leading-relaxed text-[13px] ${line.color ? colorMap[line.color] : "text-primary"}`}
        >
          {line.text || <>&nbsp;</>}
        </div>
      ))}
    </div>
  );
}
```

### src/components/commands/Skills.tsx

```tsx
import { SKILLS } from "@/content/data";
import { Tag } from "@/components/ui/Tag";
import { useStreamLines } from "@/hooks/useStreamLines";

export function Skills() {
  const visible = useStreamLines(SKILLS, 80);
  return (
    <div className="mt-1 mb-2 font-mono">
      {visible.map((group) => (
        <div key={group.group} className="flex items-start gap-3 mb-3">
          <span className="text-muted text-[12px] w-20 flex-shrink-0 pt-0.5">
            {group.group}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <Tag key={item} color={group.color}>
                {item}
              </Tag>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### src/components/ui/Tag.tsx

```tsx
const colorMap: Record<string, string> = {
  purple: "bg-[#1e1633] text-purple",
  blue: "bg-[#1a2040] text-blue",
  teal: "bg-[#051c1a] text-teal",
  yellow: "bg-[#1e1408] text-yellow",
};

export function Tag({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-[12px] font-mono ${colorMap[color] ?? "bg-surface text-secondary"}`}
    >
      {children}
    </span>
  );
}
```

### src/components/commands/Projects.tsx

```tsx
import { PROJECTS } from "@/content/data";
import { Tag } from "@/components/ui/Tag";
import { useStreamLines } from "@/hooks/useStreamLines";

export function Projects() {
  const visible = useStreamLines(PROJECTS, 120);
  return (
    <div className="mt-1 mb-2 font-mono space-y-2">
      {visible.map((p) => (
        <div
          key={p.name}
          className="border border-overlay rounded bg-surface px-4 py-3"
        >
          <div className="text-cyan font-semibold text-[13px] mb-1">
            {p.name}
          </div>
          <div className="text-muted text-[12px] mb-2">{p.description}</div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {p.tags.map((t) => (
                <Tag key={t} color="blue">
                  {t}
                </Tag>
              ))}
            </div>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-coral text-[12px] hover:underline ml-4 flex-shrink-0"
            >
              ⎋ github →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### src/components/commands/Links.tsx

```tsx
import { LINKS } from "@/content/data";
import { useStreamLines } from "@/hooks/useStreamLines";

export function Links() {
  const visible = useStreamLines(LINKS, 80);
  return (
    <div className="mt-1 mb-2 font-mono space-y-1.5">
      {visible.map((l) => (
        <div key={l.label} className="flex items-center gap-4">
          <span className="text-muted text-[12px] w-20 flex-shrink-0">
            {l.label}
          </span>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue text-[12px] hover:text-coral transition-colors"
          >
            {l.url.replace("mailto:", "")}
          </a>
        </div>
      ))}
    </div>
  );
}
```

### src/components/commands/Help.tsx

```tsx
import { COMMANDS } from "@/content/data";

export function Help() {
  return (
    <div className="mt-1 mb-2 font-mono">
      <div className="text-muted text-[12px] mb-2">available commands</div>
      {COMMANDS.map(({ cmd, desc }) => (
        <div key={cmd} className="flex gap-6 py-0.5">
          <span className="text-coral text-[13px] w-28 flex-shrink-0">
            {cmd}
          </span>
          <span className="text-muted text-[12px]">{desc}</span>
        </div>
      ))}
    </div>
  );
}
```

---

## PHASE 7 — TERMINAL CORE (state machine)

### src/components/Terminal/Terminal.tsx

This is the main React island. It manages:

- `history`: array of rendered output blocks
- `autoRun`: fires `/whoami` on mount after 350ms
- `handleCommand`: parses input, appends prompt echo + command output to history

```tsx
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { HeaderBar } from "./HeaderBar";
import { StatusBar } from "./StatusBar";
import { TerminalInput } from "./TerminalInput";
import { WhoAmI } from "@/components/commands/WhoAmI";
import { Skills } from "@/components/commands/Skills";
import { Projects } from "@/components/commands/Projects";
import { Links } from "@/components/commands/Links";
import { Help } from "@/components/commands/Help";

type OutputBlock =
  | { type: "prompt"; text: string }
  | { type: "component"; id: string; node: React.ReactNode }
  | { type: "error"; text: string };

const COMMAND_MAP: Record<string, React.ReactNode> = {
  "/whoami": <WhoAmI />,
  "/skills": <Skills />,
  "/projects": <Projects />,
  "/links": <Links />,
  "/help": <Help />,
  whoami: <WhoAmI />,
  skills: <Skills />,
  projects: <Projects />,
  links: <Links />,
  help: <Help />,
};

export function Terminal() {
  const [history, setHistory] = useState<OutputBlock[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const didAutoRun = useRef(false);

  const appendPrompt = (text: string) =>
    setHistory((h) => [...h, { type: "prompt", text }]);

  const appendNode = (node: React.ReactNode) =>
    setHistory((h) => [
      ...h,
      { type: "component", id: crypto.randomUUID(), node },
    ]);

  const appendError = (text: string) =>
    setHistory((h) => [...h, { type: "error", text }]);

  const handleCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    appendPrompt(cmd);

    if (cmd === "/clear" || cmd === "clear") {
      setHistory([]);
      return;
    }

    const node = COMMAND_MAP[cmd];
    if (node) {
      appendNode(node);
    } else {
      appendError(`command not found: ${cmd} — try /help`);
    }
  }, []);

  // Auto-run whoami on mount
  useEffect(() => {
    if (didAutoRun.current) return;
    didAutoRun.current = true;
    setTimeout(() => {
      appendPrompt("/whoami");
      appendNode(<WhoAmI />);
    }, 350);
  }, []);

  // Scroll to bottom on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="font-mono bg-base text-primary flex flex-col h-screen overflow-hidden">
      <HeaderBar />

      {/* Output area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto px-5 py-4 scroll-smooth
           [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-overlay"
      >
        {history.map((block, i) => {
          if (block.type === "prompt")
            return (
              <div key={i} className="flex gap-2 items-center text-[13px] mt-2">
                <span className="text-muted">
                  visitor@francescoalbanese.dev:~$
                </span>
                <span className="text-primary">{block.text}</span>
              </div>
            );
          if (block.type === "component")
            return <div key={block.id}>{block.node}</div>;
          if (block.type === "error")
            return (
              <div key={i} className="text-muted text-[13px] mt-1">
                command not found:{" "}
                <span className="text-red">
                  {block.text.split(": ")[1]?.split(" —")[0]}
                </span>
                {" — try /help"}
              </div>
            );
        })}
      </div>

      <TerminalInput onCommand={handleCommand} />
      <StatusBar />
    </div>
  );
}
```

### src/components/Terminal/TerminalInput.tsx

```tsx
import { useState, useRef } from "react";

export function TerminalInput({
  onCommand,
}: {
  onCommand: (cmd: string) => void;
}) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!value.trim()) return;
    onCommand(value.trim());
    setHistory((h) => [value.trim(), ...h].slice(0, 50));
    setHistIdx(-1);
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submit();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setValue(history[next] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setValue(next === -1 ? "" : history[next]);
    }
  };

  return (
    <div className="flex items-center gap-2 px-5 py-2 border-t border-overlay flex-shrink-0">
      <span className="text-coral text-sm flex-shrink-0">›</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="type /help for commands"
        autoComplete="off"
        spellCheck={false}
        className="flex-1 bg-transparent border-none outline-none text-primary text-[13px]
                   font-mono caret-coral placeholder:text-faint"
      />
      {/* blinking block cursor shown when input is empty */}
      {!value && (
        <span className="w-2 h-3.5 bg-coral animate-[blink_1.1s_step-end_infinite] flex-shrink-0" />
      )}
    </div>
  );
}
```

---

## PHASE 8 — PAGE + SEO

THE SEO MUST BE REALLY CURATED, PEOPLE SHOULD FIND ME FROM GOOGLE SEARCHES!!! I'D LIKE TO BE DISCOVERED BY BIG TECH! LIKE ANTHROPIC/OPENAI/META/GOOGLE

### src/layouts/BaseLayout.astro

```astro
---
import { SEO } from 'astro-seo';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import '../styles/tokens.css';

const title = 'Francesco Albanese — Lead AI Engineer';
const description =
  'Lead AI Engineer & Senior Staff Engineer based in London. ' +
  'Specialising in GenAI, LLMs, RAG, agentic workflows, and full-stack ' +
  'distributed systems. TypeScript, Python, AWS, Terraform.';
const url = 'https://www.francescoalbanese.dev';
---
<!doctype html>
<html lang="en" class="bg-base">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <SEO
      title={title}
      description={description}
      canonical={url}
      openGraph={{
        basic: {
          title,
          type: 'website',
          url,
          image: `${url}/og.png`,
        },
        optional: { description },
      }}
      twitter={{
        card: 'summary_large_image',
        title,
        description,
      }}
      extend={{
        meta: [
          { name: 'keywords', content: 'AI Engineer, Lead AI Engineer, LLMs, RAG, Agentic Workflows, GenAI, TypeScript, Python, AWS, Terraform, London, Staff Engineer, Claude Code, Anthropic' },
          { name: 'author', content: 'Francesco Albanese' },
          { name: 'robots', content: 'index, follow' },
        ],
        link: [
          { rel: 'canonical', href: url },
        ],
      }}
    />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body class="overflow-hidden">
    <slot />
  </body>
</html>
```

### src/pages/index.astro

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { Terminal } from '@/components/Terminal/Terminal';
---
<BaseLayout>
  <Terminal client:load />
</BaseLayout>
```

### public/favicon.svg

I'D LIKE TO CREATE A FAVICON FROM MY PROFILE PICTURE JUST WITH MY FACE ![profile picture](../../profile-picture-2019.jpg)
Create a minimal SVG: coral `›` prompt character on transparent bg.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <text x="4" y="26" font-family="monospace" font-size="28" fill="#ff9e64">›</text>
</svg>
```

---

## PHASE 9 — STRUCTURED DATA (JSON-LD for SEO)

Add to BaseLayout.astro `<head>`:

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Francesco Albanese",
  "jobTitle": "Lead AI Engineer",
  "url": "https://www.francescoalbanese.dev",
  "sameAs": [
    "https://github.com/francesco-albanese",
    "https://linkedin.com/in/albanesefrancesco/"
  ],
  "knowsAbout": ["LLMs", "RAG", "Agentic Workflows", "TypeScript", "Python", "AWS", "Terraform"],
  "address": { "@type": "PostalAddress", "addressLocality": "London", "addressCountry": "GB" }
})} />
```

---

## PHASE 10 — TERRAFORM (AWS S3 + CloudFront)

TERRAFORM has already been initialized in this repository
For terraform follow the best practices used in /Users/francescoalbanese/Documents/Development/aws-multi-account
and /Users/francescoalbanese/Documents/Development/aws-api-gateway-mtls

## PHASE 11 — CI/CD (GitHub Actions)

For CI/CD follow the best practices used in /Users/francescoalbanese/Documents/Development/aws-multi-account
and /Users/francescoalbanese/Documents/Development/aws-api-gateway-mtls

## PHASE 12 — ACCESSIBILITY + POLISH

- `<main>` wrapping terminal output for landmark navigation
- `aria-label="Terminal input"` on the input
- `aria-live="polite"` on output area for screen readers
- `prefers-reduced-motion` media query: disable typewriter, show all text instantly
  ```css
  @media (prefers-reduced-motion: reduce) {
    .blinking-cursor {
      animation: none;
    }
  }
  ```
- Mobile: full viewport height via `h-[100dvh]` (dynamic viewport units, avoids iOS bar overlap)
- Font size: never below 12px for readability
- Focus ring on input: `focus-visible:ring-1 focus-visible:ring-coral`
