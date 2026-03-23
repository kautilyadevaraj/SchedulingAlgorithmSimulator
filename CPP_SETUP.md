# Setting Up C++ Development in VS Code

## Step 1: Install Visual Studio Build Tools

Since you want to use C++, you need the Visual Studio Build Tools compiler. Follow these steps:

### On Windows:

1. **Download Visual Studio Build Tools**
   - Go to: https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Click "Download Build Tools"

2. **Run the Installer**
   - Open the downloaded `.exe` file
   - When prompted for workloads, select: **"Desktop development with C++"**
   - Include these components:
     - MSVC v143 or later
     - Windows 10/11 SDK
     - CMake tools

3. **Verify Installation**
   ```bash
   where cl.exe
   ```
   You should see a path to the compiler.

4. **Restart Your Terminal**
   - Close and reopen your terminal/VS Code

### On macOS:
```bash
xcode-select --install
```

### On Linux (Ubuntu/Debian):
```bash
sudo apt-get install build-essential python3
```

## Step 2: Install Dependencies

After installing the C++ tools, run:
```bash
npm install
```

This will:
- Install all Node.js dependencies
- Build the C++ addon automatically (via `postinstall`)

## Step 3: Verify C++ IntelliSense in VS Code

1. **Install the C++ Extension**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "C++"
   - Install "C/C++" by Microsoft

2. **Select Configuration**
   - Open any `.cpp` file in the `cpp/` folder
   - You'll see a popup to select a configuration (Win32/Linux/Mac)
   - Choose based on your OS

3. **Verify IntelliSense**
   - Open `cpp/include/Process.h`
   - Hover over types - you should see tooltips
   - Ctrl+Click on includes - they should resolve

## Step 4: Build and Run

### Build the C++ Module:
```bash
npm run build-native
```

### Run Development Server:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
```

## Troubleshooting

### "cl.exe not found"
- Make sure Visual Studio Build Tools is installed
- Restart Terminal/VS Code after installation
- Try: `npm config set msvs_version 2022`

### "IntelliSense not working"
- Reload VS Code: Ctrl+R or Cmd+R
- Select the correct configuration in the C++ extension
- Delete `.vscode/settings.json` IntelliSense cache

### Build still fails
- Run: `npm run clean-native && npm install`
- Check build output: `npm run build-native -- --verbose`

## File Structure

Your C++ code is organized as:
- `cpp/include/` - Header files (Process.h, Algorithms.h)
- `cpp/src/` - Implementation files
  - `binding.cc` - Node.js bindings
  - `*FirstServe.cpp` - Algorithm implementations

The compiled addon will be available at:
- `build/Release/scheduling_algorithms.node` (Windows/Linux/Mac)

## Next Steps

Once everything is set up:
1. Edit C++ files in `cpp/src/`
2. Run `npm run dev` to rebuild and test
3. Use VS Code debugging with the "Debug Development Server" configuration
4. Changes will be hot-reloaded when you modify files

Happy coding with C++! 🚀
