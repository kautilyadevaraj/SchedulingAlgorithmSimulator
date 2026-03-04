# CPU Scheduling Algorithm Simulator for Dummies

An interactive simulator for learning and comparing CPU scheduling algorithms: **SRTF** (Shortest Remaining Time First), **RRV** (Virtual Round Robin), and **MLFQ** (Multi-Level Feedback Queue). Designed to be visual, simple, and effective for students.

**[View the live application here](https://scheduling-algorithm-simulator.vercel.app/)**.

## Overview

This project is a web-based simulator for CPU scheduling algorithms. It allows users to input different processes once and compare how different algorithms handle them in real-time on a single screen.

## Features

- **Single-Screen Comparison**: One set of inputs, multiple algorithm results.
- **Dummies-First UI**: Clean, intuitive interface with zero clutter.
- **Advanced Algorithms**: Supports SRTF, Virtual Round Robin (RRV), and Multi-Level Feedback Queue (MLFQ).
- **Visual Gantt Charts**: Interactive charts to see exactly how time is allocated.
- **Real-Time Calculation**: Change a burst time and see all results update instantly.

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
