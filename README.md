# francescoalbanese.dev

[![Astro](https://img.shields.io/badge/Astro-6-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![AWS CloudFront](https://img.shields.io/badge/AWS-CloudFront-FF9900?logo=amazon-web-services&logoColor=white)](https://aws.amazon.com/cloudfront/)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

Interactive terminal-based portfolio website. Type commands to explore skills, experience, and projects.

**[https://francescoalbanese.dev](https://francescoalbanese.dev)**

---

## Demo

![Terminal Demo](docs/demo.gif)

---

## Features

- **Terminal interface** with command history, tab autocompletion, and streaming text output
- **Commands**: `/help`, `/whoami`, `/skills`, `/projects`, `/experience`, `/links`
- **ASCII art portrait** with interactive photo toggle (hover/tap)
- **Tokyo Night-inspired** dark theme with JetBrains Mono
- **Progressive Web App** with offline support and installable
- **Accessibility-first**: full `prefers-reduced-motion` support across all animations

---

## Tech Stack

| Category       | Technology                                                       |
| -------------- | ---------------------------------------------------------------- |
| Framework      | [Astro](https://astro.build/) 6 + [React](https://react.dev/) 19 |
| Language       | [TypeScript](https://www.typescriptlang.org/) 5.9 (strict)       |
| Styling        | [Tailwind CSS](https://tailwindcss.com/) 4                       |
| Testing        | [Vitest](https://vitest.dev/) + React Testing Library            |
| Linting        | [BiomeJS](https://biomejs.dev/)                                  |
| Infrastructure | AWS S3 + CloudFront + Route53 (Terraform)                        |
| CI/CD          | GitHub Actions with OIDC authentication                          |

---

## Architecture

![Architecture](diagrams/architecture.png)

- **CloudFront** handles TLS termination (ACM cert), caching (1-year for hashed assets, 5-min for HTML), and security headers (HSTS, X-Frame-Options)
- **Origin Access Control** ensures the S3 bucket is never publicly accessible

### CI/CD Pipeline

- **OIDC federation** for keyless AWS authentication (no long-lived credentials)
- Infrastructure managed via Terraform in a [separate repository](https://github.com/francescoalbanese/francescoalbanese-dev-infra)

## Local Development

```bash
pnpm install        # install dependencies
pnpm dev            # start dev server
pnpm build          # production build
pnpm preview        # preview production build
pnpm test           # run tests
pnpm check          # TypeScript type checking
```

## License

[MIT](LICENSE)
