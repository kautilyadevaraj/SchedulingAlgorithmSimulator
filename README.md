# CPU Scheduling Algorithm Simulator

Interactive CPU scheduling simulator with visual Gantt output, per-process metrics, and optional native C++ execution.

## Features

- Algorithms:
	- FCFS (First Come First Serve)
	- SJF (Shortest Job First)
	- SRTF (Shortest Remaining Time First)
	- RR (Round Robin)
	- Priority Non-Preemptive
	- Priority Preemptive
- Process fields:
	- Arrival Time
	- Burst Time
	- Priority
	- Color
- Global scheduling controls:
	- Time Quantum (RR)
	- Context Switching Time (applied across algorithms)
- Visual and metrics output:
	- Gantt chart with Idle and CS (context switch) blocks
	- Completion Time, Waiting Time, Turnaround Time
	- Average metrics, throughput, CPU utilization
- Runtime strategy:
	- Native C++ addon used when available
	- TypeScript fallback when native addon is unavailable

## Tech Stack

- Next.js 14
- React + TypeScript
- Tailwind CSS
- React Hook Form + Zod
- node-gyp + C++ (optional native path)

## Project Structure

```text
app/
	api/schedule/route.ts          # Server-side scheduling endpoint (Node runtime)
components/
	MainForm.tsx                   # Inputs, run action, and results wiring
	GanttChart.tsx                 # Timeline visualization
	SummaryTable.tsx               # CT / WT / TAT table
	SummaryStatistics.tsx          # Averages and utilization
cpp/
	include/                       # C++ headers
	src/                           # C++ algorithm implementations + binding.cc
lib/
	scheduling-native.ts           # Native loader with TS fallback
binding.gyp                      # Native build config
```

## Prerequisites

- Node.js 20+
- npm
- Python 3.10+

For native C++ build on Windows:
- Visual Studio Build Tools 2022 (Desktop C++ workload)

## Installation

```bash
git clone https://github.com/kautilyadevaraj/SchedulingAlgorithmSimulator.git
cd SchedulingAlgorithmSimulator
npm install
```

## Run Modes

Standard mode (no native build required):

```bash
npm run dev
```

Native mode (build C++ first, then start):

```bash
npm run dev:native
```

## Native Build Commands

```bash
npm run build-native
npm run clean-native
```

If native build succeeds, addon output is generated at:

```text
build/Release/scheduling_algorithms.node
```

## Production Build

Standard production build:

```bash
npm run build
npm run start
```

Native production build:

```bash
npm run build:native
npm run start
```

## Troubleshooting

- Native addon missing warning:
	- App still runs using TypeScript fallback.
- Windows node-gyp issues:
	- Ensure VS 2022 Build Tools are installed and complete.
	- Reopen terminal after installation.
	- Run `npm run clean-native` then `npm run build-native`.
- Node 24 build requirement:
	- C++20 is required by Node headers; this repository is configured accordingly in `binding.gyp`.

## Contributing

1. Fork the repository.
2. Create a branch.
3. Commit focused changes.
4. Open a pull request.

## License

MIT. See `LICENSE`.
