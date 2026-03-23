# Building the C++ Scheduling Algorithms

This project uses Node.js native addons to run scheduling algorithms in C++ for better performance.

## Prerequisites

- Node.js (v16 or higher)
- Python 3.10 or higher (required for node-gyp)
- For Windows: Visual Studio Build Tools with C++ support
- For macOS: Xcode Command Line Tools
- For Linux: Build tools (gcc, g++, make)

## Building

### Native Dev/Build Mode
The C++ addon is built when you run native scripts:
```bash
npm run dev:native
npm run build:native
```

### Standard Mode (No Native Build Required)
For quick development without native compilation:
```bash
npm run dev
npm run build
```

### Manual Build
To manually build the native addon:
```bash
npm run build-native
```

### Clean Build
To clean build artifacts and rebuild:
```bash
npm run clean-native
npm run build-native
```

## Windows Specific Setup

If you encounter issues on Windows:

1. Install Visual Studio Build Tools:
   - Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Install with "Desktop development with C++" workload

2. Ensure Python 3.10+ is installed and in your PATH

3. Reopen your terminal after installation so toolchain environment changes are picked up.

## Development

The project uses both C++ and TypeScript implementations:
- **C++ Implementation**: Located in `cpp/` directory
- **TypeScript Fallback**: In `lib/scheduling-native.ts`

If the C++ addon fails to load, the application automatically falls back to the TypeScript implementation, so development is not blocked.

## Project Structure

```
cpp/
├── include/
│   ├── Process.h           # Process data structure
│   └── Algorithms.h        # Algorithm declarations
├── src/
│   ├── binding.cc          # Node.js bindings
│   ├── FirstComeFirstServe.cpp
│   ├── RoundRobin.cpp
│   ├── ShortestJobFirst.cpp
│   └── ShortestRemainingTimeFirst.cpp
binding.gyp                # Build configuration file
```

## Troubleshooting

### "Native C++ addon not found" warning
This is normal during development. The application will use the TypeScript implementation as a fallback.

### Build fails on Windows
1. Check that Visual Studio Build Tools are installed
2. Verify Python is in your PATH
3. Try rebuilding: `npm run clean-native && npm run build-native`

### Build fails on macOS/Linux
1. Ensure Xcode/gcc is installed
2. Try: `xcode-select --install` (macOS)
3. Install build essentials: `sudo apt-get install build-essential` (Linux)
