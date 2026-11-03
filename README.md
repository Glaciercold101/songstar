
# Gospel Music Songstar - Portable Wrapper
## Single EXE with demo-assets + service-worker embedded

This wrapper makes your web app run as a single portable .exe on Windows.
It starts a localhost server (127.0.0.1:random port) and opens it in Chrome/Edge app mode.

### What is embedded as RCDATA?

| ID | File | Purpose |
|----|------|---------|
| 1  | app.ico | App icon |
| 101| index.html | Your main app (IndexApp.html) |
| 102| service-worker.js | Offline cache handler |
| 110| demo-assets/demo-song.mp3 | 3,744 KB demo mp3 |
| 111| demo-assets/intro_verse1.webp | 410 KB |
| 112| demo-assets/chorus.webp | 1,071 KB |
| 113| demo-assets/verse2.webp | 898 KB |
| 114| demo-assets/bridge.webp | 520 KB |
| 115| demo-assets/outro.webp | 530 KB |

### Folder Structure (to build)

GospelWrapper/
  app.ico              <- optional, your icon
  index.html           <- your Gospel Music Songstar app HTML (rename IndexApp.html)
  service-worker.js    <- provided
  demo-assets/
    demo-song.mp3
    intro_verse1.webp
    chorus.webp
    verse2.webp
    bridge.webp
    outro.webp
  main.cpp
  native_bridge.h
  native_bridge.cpp
  build.ps1

### How to Build

1. Install MinGW-w64 g++ (need windres.exe and g++.exe)
   Your previous path: C:\dev\mingw64\bin\

2. Put all demo files into demo-assets/ (exact names above, matching service-worker.js)

3. In PowerShell:
   cd GospelWrapper
   ./build.ps1

4. Output: bin/GospelSongstar.exe - this is portable, single file. No need to ship bin/index.html etc, but they are copied for testing.

### How it Works

- main.cpp:
  - Tries to load index.html from beside exe, else loads RCDATA 101
  - Starts NativeBridge on 127.0.0.1:0 (random free port)
  - Finds Chrome/Edge, launches: --app=http://127.0.0.1:PORT/index.html?token=...

- native_bridge.cpp:
  - Loopback HTTP server
  - Serves / and /index.html from embedded html
  - Serves /service-worker.js from disk if exists, else RCDATA 102
  - Serves /demo-assets/* : disk first, else RCDATA 110-115
  - MIME types correct for mp3 and webp
  - Portable: no external folder required if you embedded assets at build time

### Notes for your app

- Your service-worker.js already lists:
  ./demo-assets/demo-song.mp3
  ./demo-assets/intro_verse1.webp
  ./demo-assets/chorus.webp
  ./demo-assets/verse2.webp
  ./demo-assets/bridge.webp
  ./demo-assets/outro.webp
  Wrapper serves them at /demo-assets/...

- For offline PWA to work in app mode, keep service-worker.js at root (/service-worker.js) which wrapper does.

- If you want to update demo files, just replace in demo-assets and re-run build.ps1.

### Troubleshooting

- If build fails on windres: ensure path no spaces, or use short path.
- If EXE shows "No HTML found": index.html not embedded - check build_temp.rc was generated.
- If demo assets 404: they were not present at build time AND not beside exe. Either embed them or copy demo-assets folder next to exe.

Author: Christopher Azeem wrapper pattern adapted for Gospel Songstar
