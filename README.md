<a id="readme-top"></a>

<div align="center">
  <a href="https://github.com/virlyputri/lomba-hackathon">
    <img src="https://cdn.simpleicons.org/react/61DAFB" width="120" alt="React Logo" />
  </a>

<h3 align="center">AegisAI</h3>

  <p align="center">
    Digital form for logistic maintenance with AI data automation
    <br />
    <a href="https://aegisai.netlify.app"><strong>View Demo »</strong></a>
    <br />
    <br />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

## About The Project

This project was developed specifically for a **Hackathon**, focusing on streamlining data entry through intelligent digital forms.

The primary challenge with traditional data input is "data noise" and human error, which often lead to corrupted datasets. This project mitigates these issues by combining rigorous client-side validation with an **AI-powered Data Cleaning** engine to sanitize and normalize inputs before they ever reach the server.

- Client repository: [https://github.com/virlyputri/lomba-hackathon](https://github.com/virlyputri/lomba-hackathon.git)
- API repository: [https://github.com/iyanarmanda/proto-logistic-mt-api](https://github.com/iyanarmanda/proto-logistic-mt-api.git)
- AI repository: [https://github.com/MrRaffs/Aegis_AI_endpoint](https://github.com/MrRaffs/Aegis_AI_endpoint.git)

### Built With

- [React](https://react.dev)
- [Vite](https://vite.dev/)
- [Material UI](https://mui.com/)
- [TypeScript](https://www.typescriptlang.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- **Node.js** (v22 recommended)
- **pnpm**
  ```sh
  npm install -g pnpm
  ```
- **VS Code extension**
  - **ESLint** by Microsoft
  - **Prettier - Code formatter** by Microsoft

### Installation

1. Clone the repo

   ```bash
   git clone <github-repository-name>.git
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Husky preparation

   ```bash
   pnpm prepare
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

- Development Mode

  ```bash
  pnpm dev
  ```

- Build & Preview

  ```bash
  pnpm build
  pnpm preview
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>
