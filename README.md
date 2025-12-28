# Hermez

The official web application for Hermez — an open-source ngrok alternative. Built with Next.js 15 and featuring a stunning 3D blackhole/tunnel particle animation.

## Requirements

- **Node.js**: v20.19.6 (required)
- **npm**: v10+ (recommended)

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

3. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start dev server with Turbopack |
| `npm run build` | Create production build         |
| `npm run start` | Start production server         |
| `npm run lint`  | Run ESLint                      |

## Tech Stack

| Package                         | Version  | Purpose                             |
| ------------------------------- | -------- | ----------------------------------- |
| **Next.js**                     | 15.2.4   | React framework with Turbopack      |
| **React**                       | 19.0.0   | UI library                          |
| **Three.js**                    | 0.182.0  | 3D graphics engine                  |
| **@react-three/fiber**          | 9.4.2    | React renderer for Three.js         |
| **@react-three/drei**           | 10.7.7   | Useful helpers for R3F              |
| **@react-three/postprocessing** | 3.0.4    | Post-processing effects             |
| **three-stdlib**                | 2.36.1   | Three.js standard library utilities |
| **maath**                       | 0.10.8   | Math helpers for 3D graphics        |
| **Framer Motion**               | 12.23.26 | Animation library                   |
| **Tailwind CSS**                | 4.x      | Utility-first CSS                   |

## License

MIT
