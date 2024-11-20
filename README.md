# CPU Scheduling Algorithm Simulator

An interactive simulator for learning and testing various CPU scheduling algorithms, including First Come First Serve (FCFS), Round Robin(RR), Shortest Job First(SJF) and Shortest Remaining Time First(SRTF). This project provides a visual and dynamic way to understand scheduling algorithms, making it ideal for students and enthusiasts interested in operating systems.

**[View the live application here](https://scheduling-algorithm-simulator.vercel.app/)**.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project is a web-based simulator for CPU scheduling algorithms. It allows users to input different processes with specific attributes (arrival time, burst time, etc.) and visualize how these processes are scheduled according to the chosen scheduling algorithm.

## Features

- **Interactive Form**: Add and configure processes with attributes such as arrival time, burst time, and background color.
- **Scheduling Algorithms**: Currently supports FCFS (First Come First Serve), RR (Round Robin), SJF (Shortest Job First) and SRTF (Shortest Remaining Time First).
- **Real-Time Visualization**: Watch processes as they are scheduled and executed based on selected algorithms.
- **Dark Mode Support**: Uses a ThemeProvider for seamless switching between dark and light themes.

## Technologies Used

- **Next.js**: Frontend framework for React applications.
- **TypeScript**: Provides type safety and ensures code robustness.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Zod**: For form validation schemas.
- **React Hook Form**: Handles form state and validation.
- **Custom Components**: Built-in components like `GradientPicker` for user-friendly UI interactions.


## Installation

To set up the project locally, ensure you have [Node.js](https://nodejs.org/en/download/) and [Yarn](https://classic.yarnpkg.com/en/docs/install/) or [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.

### Step 1: Clone the Repository

```bash
git clone https://github.com/kautilyadevaraj/SchedulingAlgorithmSimulator
cd scheduling-algorithm-simulator
```

### Step 2: Install Dependencies

Run the following command to install the necessary dependencies.
#### Using Yarn
```bash
yarn install
```

#### OR using npm
```bash
npm install
```

### Step 3: Environment Setup

No environment variables are required for this project in its current state. However, if you extend the project with a backend API or database, create a .env.local file in the root directory for environment variables.

### Step 4: Run the Development Server

Start the development server by running:
#### Using Yarn
```bash
yarn dev
```

#### OR using npm
```bash
npm run dev
```
This will start the Next.js development server at [http://localhost:3000](http://localhost:3000). You can view the project in your browser by navigating to this address.

## Step 5: Build for Production (Optional)

If you want to build the project for production, run:
#### Using Yarn
```bash
yarn build
```

#### OR using npm
```bash
npm run build
```
This will create an optimized production build in the .next folder.

## Usage

1. Add Processes: Use the form to add processes with specific arrival times, burst times, and custom background colors.
2. Select Algorithm: Choose a scheduling algorithm from the provided options (e.g., SRTF, FCFS).
3. Run Simulation: The simulator will display the scheduling results in a real-time animation.

## Contributing

We welcome contributions! To contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch-name).
3. Make your changes.
4. Commit your changes (git commit -m 'Add some feature').
5. Push to the branch (git push origin feature-branch-name).
6. Open a Pull Request.

For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
