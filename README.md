# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# The Sales Insight Automator
A secure, containerized tool that utilizes AI to parse raw sales data and email executive summaries directly to stakeholders.

## 🚀 Quick Start (Local Setup)
1. Clone the repository.
2. Navigate to the `backend` directory and copy the environment template:
   `cp .env.example .env`
3. Fill in your Gemini API Key and SMTP credentials in the `.env` file.
4. From the root directory, spin up the entire stack using Docker:
   `docker-compose up --build`
5. Access the Frontend: `http://localhost:5173`
6. Access Swagger API Docs: `http://localhost:5000/api-docs`

## 🛡️ Security Posture
The backend API is secured using several layers:
* **Helmet.js:** Secures Express apps by setting various HTTP headers to mitigate common web vulnerabilities.
* **Rate Limiting:** Protects the endpoints against brute-force attacks and DDOS by restricting the number of requests per IP.
* **In-Memory Parsing:** Multer processes uploaded files strictly in memory. Files are never written to the disk, ensuring sensitive corporate data is not left lingering on the server.