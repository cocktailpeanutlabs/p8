---
layout: minimal
title: Pinokio 8.0.0 Candidate Beta
description: Release notes for Pinokio 8.0.0 Candidate Beta
permalink: /
has_toc: false
render_with_liquid: false
section_nav_depth: 2
---

# Download Pinokio 8.0.0 Candidate Beta

Download at [https://github.com/peanutcocktail/pinokio/releases/tag/v7.5.29](https://github.com/peanutcocktail/pinokio/releases/tag/v7.5.29)

# Migrate to Open License Conda

## 1. Miniconda => Miniforge

Pinokio's managed Conda runtime now uses Miniforge instead of Miniconda.

Pinokio has relied on a bundled Conda base from the beginning, but the managed base is now built around the conda-forge distribution path and a conda-forge-first package policy.

This changes the foundation of Pinokio's runtime in three important ways:

1. Pinokio no longer depends on Anaconda's Miniconda installer for its managed runtime.
2. Package installs now start from conda-forge, which makes dependency resolution cleaner and more predictable.
3. The managed base can be repaired by reinstalling the Miniforge root instead of carrying forward older Miniconda state.

## 2. Upgrade built-in conda packages

The migration also tightened the runtime package pins that have historically caused install and startup issues:

- Miniforge release: `26.3.2-3`
- Conda: `26.3.2`
- Python: `3.10.20`, including the Windows SSL/certificate build fix
- Node.js: `24.18.0`. Newer projects like voicebox require node.js>24. Now natively supported.
- pnpm: `11.9.0`
- FFmpeg: `8.1.2`
- 7zip on Windows: `23.01`
- uv: `0.11.23`
- huggingface_hub: `1.20.1`


---

# Feature Updates

## 1. Autolaunch

Autolaunch is now a first-class Pinokio feature instead of a hidden environment setting. The release adds a global Autolaunch page, app-level startup controls, launch script selection, dependency-aware startup, and live status plumbing for startup and manual launches.


### 1.1. Autolaunch on Pinokio start

You can make any app automatically launch when pinokio launches, with just 1-click.

![media/autolaunch_toggle.gif](media/autolaunch_toggle.gif)

Once you set an app to autolaunch, whenever you restart pinokio, those selected apps will launch along with pinokio:

![media/autolaunch.gif](media/autolaunch.gif)

Apps can be configured to start automatically when Pinokio starts. Each app keeps a selected launch script and a separate `Start with Pinokio` switch, so turning startup on or off does not have to erase the configured script.

The startup scheduler reads installed apps, resolves their selected scripts, skips missing scripts, records per-app startup state, and updates Home while startup is still in progress.


### 1.2. Autolaunch management page

![media/autolaunch_page.gif](media/autolaunch_page.gif)


The new `/autolaunch` page lets users search installed apps, pick a launch script, toggle startup, disable startup globally, and manage required apps from a single screen. Enabled apps sort to the top, and the detail panel shows the current script, menu-discovered scripts, local script files, manual relative paths, and requirements.


---

## 2. Orchestration

Automatically launch related apps.

![Dependency-aware launch orchestration overview](media/orchestration-overview.png)

### 2.1. Set dependent apps

Apps can now declare required apps that should launch before the current app by adding dependencies.

For example, let's say an app named **Ideogrammar** requires **ComfyUI** to be running. You can:

1. From Ideogrammar, click "Autolaunch".
2. Click "Add dependency".
3. Add "ComfyUI".

![media/add_dependency.gif](media/add_dependency.gif)

Now whenever you launch Ideogrammar, it will automatically launch ComfyUI and wait for it to be ready, and only when ComfyUI is ready, will it launch Ideogrammar.

![media/dependency_launch.gif](media/dependency_launch.gif)

Furthermore, Pinokio resolves those dependencies recursively, which means if:

1. A depends on B
2. B depends on C and D

When you launch A, it will trigger the launch of B, which will trigger the launch of C and D. Once both C and D are ready, B will launch, and once B is ready, A will be launched.

![Recursive dependency resolution launch order](media/recursive-dependencies.png)


### 2.2. Combine with Autolaunch


This applies to startup autolaunch and to manual app launches, so a complex app stack can be expressed as dependencies instead of relying on users to remember the correct launch order.

![Startup autolaunch and manual launches share dependency ordering](media/autolaunch-dependencies-combined.png)

---



## 2. Info bar

App pages now surface live resource usage in the info bar, displaying per-app usage information.

![media/infobar.png](media/infobar.png)

Pinokio tracks:

- Disk usage
- RAM
- CPU
- VRAM

through a runtime service that groups running processes by app workspace and samples platform-specific process and GPU data.

Users can open the resource popover to toggle RAM, VRAM, and CPU display.

![App header resource usage controls](media/app-resource-usage.png)

## 3. Help

The old Logs surface has been rebuilt into a "Get Help" workflow. Users can still inspect raw logs, but a workspace-specific view can now build a Markdown issue report from recent app logs, show included files, estimate registry draft size, run privacy review, and hand the report to an AI agent or Pinokio Community.

![Logs page with generated issue report, review pane, privacy filter, and help actions](media/logs-help-report.png)

### 3.1. Ask Community

The Help view automatically focuses on the latest execution context when an app workspace is provided. Youc can 1-click post the full logs to the pinokio community to ask for help.

![media/askcommunity_help.gif](media/askcommunity_help.gif)

### 3.2. Ask AI

You can also click "Ask AI" to ask your local AI agent to fix the app. The agent knows everything about your app---code, documentation, usage pattern, and actual logs---which means it is very likely to fix whatever problem you have with your apps.

![media/askai_help.gif](media/askai_help.gif)


### 3.2. Auto-help

Now Pinokio proactively nudges you to the "Get help" section when there's an error, so you can either post to pinokio community, or ask your AI agent locally.

![media/autohelp.gif](media/autohelp.gif)

## 4. Use on Phone

![media/phoneview.jpg](media/phoneview.jpg)

Phone access is now part of the shared sidebar. The Phone button opens a focused local-access panel with a QR code and local URL, and setup is gated when the local network router is not ready.

![Phone access QR panel from the shared sidebar](media/phone-access.png)

Pinokio's mobile layout was also reworked around the app list. Primary navigation moves to a compact footer, search and sort remain reachable, and app rows keep their key actions available at phone width.

![Mobile home layout with footer navigation](media/mobile-home-footer-nav.png)

The same phone layout applies inside app workspaces. Running apps keep the mobile drawer, Run/Dev switch, web UI and terminal entries, Ask AI, and live resource status available without needing a desktop-width window.

![media/phoneview.gif](media/phoneview.gif)

Dev mode is also usable from a phone. Project shells, terminal agents, and desktop agents load in the compact launcher, and OpenAI Codex Auto can run inside Pinokio's terminal view from the selected workspace.

![Mobile Dev mode with project shells and terminal agents](media/phone-dev-agents.png)

![OpenAI Codex Auto running in the mobile terminal view](media/phone-codex-auto-terminal.png)

---

# Performance Improvement

## 1. Remove initial file scan

Pinokio no longer pays the old startup cost of recursively scanning every workspace up front. Workspace status is now cached and invalidated when a watcher sees changes, with polling fallback when filesystem watching is unavailable.

Gitignore handling was also moved toward path-scoped evaluation, so status checks can evaluate the paths that matter instead of building one expensive global ignore model before the app is usable.

## 2. Version control optimization

Git repository discovery and status paths were optimized around the active workspace. Pinokio now preserves selected-workspace behavior for git status, diff, browser, delete, move, and terminal-created workspaces while avoiding broad startup scans.

The practical result is less disk activity at launch and faster navigation into git-aware app pages.

## 3. Interactive terminal performance improvement

Input-enabled terminals now batch renderer writes through the browser frame loop. Instead of writing every terminal chunk immediately, Pinokio coalesces output and flushes it on `requestAnimationFrame` or a short fallback timer.

This reduces renderer pressure in busy terminals, especially AI-agent terminals and scripts that emit large amounts of output.

---

# Design Overhaul

Pinokio 8.0.0 brings the main product surfaces into one visual system. Home, app pages, Tools, Plugins, Skills, Logs, Settings, Setup, Network, and auth pages now share the same sidebar language, page shell, compact controls, and task-oriented layout.

## Plugins Page

Plugins now appear as managed tools grouped by how they launch. Terminal plugins run inside Pinokio, while desktop plugins launch externally.

![Plugins page with terminal and desktop tool groups](media/plugins-agent-tools.png)

## Universal Sidebar

The shared sidebar now gives Home and management pages a consistent navigation model. It groups primary actions, local machine access, management pages, connected accounts, and system pages without forcing each page to invent its own navigation.

![media/sidebar_toggle.gif](media/sidebar_toggle.gif)

## Context Menu

Home app rows now expose a focused action drawer instead of crowding every command into the row. The drawer groups run actions, dev mode, and file actions while keeping the app identity visible.

![media/contextmenu.gif](media/contextmenu.gif)


## App page

App pages now use one vertical sidebar. The old horizontal tab mode was removed because it created layout and responsiveness problems. The current page keeps Run and Dev modes in the vertical rail, shows script actions in a compact list, and includes a one-click sidebar toggle for more workspace room.

![App page vertical sidebar navigation](media/app-sidebar-navigation.png)

Ask AI was also redesigned as an in-app drawer. Users can search terminal agents, desktop agents, and project shells from the app context, then open the selected agent without leaving the app page.

![Ask AI drawer with terminal agents, desktop agents, and project shells](media/app-ask-ai-drawer.png)

---

# API Updates

Pinokio 8 adds API and template features for the launcher patterns that changed in this release: passing long prompts to local agents, handling Hugging Face login and repository uploads, opening native desktop tools from Pinokio, keeping externally launched tools visible in the footer, and routing PyTorch installs by detected GPU hardware.

## `shell.run` Structured Arguments

`shell.run` can now accept structured argv messages with multiline argument values:

```js
{
  method: "shell.run",
  params: {
    message: {
      _: [
        "python",
        "-c",
        "print('line 1')\nprint('line 2')"
      ]
    }
  }
}
```

This matters for AI-agent and help-report flows. A prompt or generated issue report can contain many lines, quotes, and shell-sensitive characters. With structured argv, Pinokio treats each array item as one argument instead of asking a launcher author to hand-escape a shell command.

Practical agent example:

```js
{
  method: "shell.run",
  params: {
    message: {
      _: [
        "npx",
        "-y",
        "@openai/codex@latest",
        "--yolo",
        "-c",
        "projects={ {{JSON.stringify(args.cwd)}}={trust_level=\"trusted\"} }",
        "{{args.prompt || ''}}"
      ]
    },
    path: "{{args.cwd}}",
    input: true
  }
}
```

If a structured argument renders to multiple lines, Pinokio moves it into a generated `PINOKIO_ARG_*` environment variable and references it safely for Bash, PowerShell, or `cmd.exe`. Raw string commands still behave as before. The terminal preview redacts generated `PINOKIO_ARG_*` values into line-count summaries so large prompts do not flood logs.

## `hf.login`

Launchers can now handle Hugging Face authentication through a first-class Pinokio API instead of asking users to run `hf login` by hand. `hf.login` starts the managed Hugging Face device login provider. By default it checks for an existing saved token, copies the device code when available, shows a blocking login modal, waits for Hugging Face authorization to finish, and returns success without exposing the token value.

Default login flow:

```js
{
  method: "hf.login"
}
```

Customized login flow:

```js
{
  method: "hf.login",
  params: {
    timeout: 120000,
    interval: 2000
  }
}
```

Launcher authors can set `force: true` to require a fresh login, or use `modal: false`, `open: false`, `clipboard: false`, and `wait: false` for custom flows.

## `hf.upload`

Launchers can now publish generated files to Hugging Face through a first-class Pinokio API. `hf.upload` wraps the Hugging Face CLI `hf upload` command with structured arguments. Positional upload arguments go in `params._`, flags use normal object keys, and `path` / `env` stay available for the shell context:

```js
{
  method: "hf.upload",
  params: {
    path: "{{cwd}}/output",
    _: ["username/my-dataset", "./output", "."],
    "repo-type": "dataset",
    private: true,
    "commit-message": "initial upload"
  }
}
```

This pairs with `hf.login` and `hf.download` so an app can authenticate, fetch gated assets, and publish generated files without each launcher reinventing Hugging Face CLI setup.

## `uri.open`

`uri.open` opens a local file URI, web URI, or desktop-app deep link through the operating system.

Syntax:

```js
{
  method: "uri.open",
  params: {
    uri: "scheme://path-or-action",
    params: {
      key: "value"
    }
  }
}
```

`params.uri` is required. `params.params` is optional; Pinokio appends it as query parameters before opening the URI. Arrays become repeated keys, objects are JSON-encoded, existing query strings are preserved, and hash fragments stay at the end.

This enables desktop agent handoff without shell-specific command construction:

```js
{
  method: "uri.open",
  params: {
    uri: "codex://new",
    params: {
      prompt: "{{args.prompt || ''}}",
      path: "{{args.cwd || cwd}}"
    }
  }
}
```

Other desktop tools can use the same pattern:

```js
{
  method: "uri.open",
  params: {
    uri: "windsurf://cascade/newChat",
    params: {
      prompt: "{{args.prompt || ''}}",
      folder: "{{args.cwd || cwd}}"
    }
  }
}
```

## `process.wait`

`process.wait` keeps a Pinokio script active while Pinokio waits for time, a URL, a `wait-on` condition, app presence, or a manual Stop. This is especially useful after `uri.open`, because the desktop app is launched outside the terminal but Pinokio still needs a visible running state and a Stop control.

Common forms:

```js
{ method: "process.wait", params: { sec: 5 } }
{ method: "process.wait", params: { min: 1 } }
{ method: "process.wait", params: { uri: "http://127.0.0.1:8188" } }
{ method: "process.wait", params: { on: { resources: ["tcp:8188"] } } }
{ method: "process.wait", params: { app: "Comfyui", title: "Waiting for ComfyUI" } }
```

If no time or condition is provided, the wait is indefinite and ends when the user stops the script. `title`, `description`, and `message` make the wait show up in the footer:

```js
[
  {
    method: "uri.open",
    params: {
      uri: "claude://code/new",
      params: {
        q: "{{args.prompt || ''}}",
        folder: "{{args.cwd || cwd}}"
      }
    }
  },
  {
    method: "process.wait",
    params: {
      title: "Launched",
      description: "Click Stop when done."
    }
  }
]
```

## GPU template variables

Pinokio exposes these GPU-related template variables after sysinfo is available. The table is exhaustive for variable names and closed value sets; open-ended hardware strings are listed by format.

| Variable | Possible values / format | Meaning |
| --- | --- | --- |
| `gpu` | `nvidia`, `amd`, `apple`, `none`, or another lower-case vendor string such as `intel` | Selected primary GPU vendor. |
| `gpu_model` | Lower-case model string such as `nvidia rtx a4500`, `amd radeon rx 7900 xtx`, `intel arc a770`, `apple m3`; unset when unavailable | Selected primary GPU model. |
| `gpu_driver` | Driver version string such as `565.90` or `31.0.2`; `null` when unavailable | Driver version for the selected primary GPU. |
| `gpu_target` | AMD `gfx*` target such as `gfx1030`, `gfx1100`, `gfx1151`, `gfx1201`; NVIDIA `sm_*` target such as `sm_86`, `sm_89`, `sm_120`; `null` for Intel, Apple, unknown, or unresolved GPUs | Concrete architecture target for wheel and kernel routing. |
| `gpus` | Array of `{ name, model, driver }`, where `name` and `model` are lower-case strings and `driver` is a string or `null` | Normalized list of detected GPU controllers. |
| `vram` | Integer GB; `0` when unavailable | VRAM for the selected primary GPU. |

## `{{gpu}}`

Templates expose the selected primary GPU vendor as `gpu`.

Use this for broad vendor routing when the install path does not need a specific architecture target. For NVIDIA and AMD wheel routing, combine `gpu` with `gpu_target` or `gpu_driver` when the wheel source requires it.

```js
{
  when: "{{gpu === 'nvidia'}}",
  method: "shell.run",
  params: {
    message: "echo NVIDIA GPU selected"
  }
}
```

```js
{
  when: "{{gpu === 'intel' && /arc|data center gpu max|gpu max|ponte vecchio/i.test(gpu_model || '')}}",
  method: "shell.run",
  params: {
    message: "echo Intel XPU-capable GPU selected"
  }
}
```

## `{{gpu_model}}`

Templates now expose the selected primary GPU model as `gpu_model`, such as `nvidia rtx a4500` or `amd radeon rx 7900 xtx`. Pinokio chooses the same primary controller used for `gpu`: NVIDIA first when present, otherwise the highest-VRAM AMD controller, otherwise Apple, otherwise the first detected controller.

Use this when an app needs a model-specific exception, a diagnostics report, or a more precise log message. Do not use `gpu_model` regexes to infer AMD `gfx*` or NVIDIA `sm_*` architecture targets when `gpu_target` is available.

For example, `sm_75` covers both RTX 20-series and GTX 16-series GPUs, so a launcher can use `gpu_model` after `gpu_target` narrows the architecture:

```js
{
  when: "{{gpu === 'nvidia' && gpu_target === 'sm_75' && /gtx\\s*16/i.test(gpu_model || '')}}",
  method: "shell.run",
  params: {
    message: "echo NVIDIA GTX 16-series selected"
  }
}
```

For diagnostics, pass the model through the environment:

```js
{
  method: "shell.run",
  params: {
    message: "node scripts/print-hardware.js",
    env: {
      PINOKIO_GPU_MODEL: "{{gpu_model || ''}}"
    }
  }
}
```

## `{{gpu_target}}`

Templates now expose the selected GPU architecture target as `gpu_target`.

Use `gpu_target` when an app needs architecture-specific PyTorch wheels, compiled extensions, kernels, or compatibility checks. Pinokio exposes the hardware fact; launcher scripts still choose the install command.

Current target formats:

- AMD ROCm targets use `gfx*`, such as `gfx1030`, `gfx1100`, `gfx1151`, and `gfx1201`.
- NVIDIA CUDA targets use `sm_*`, such as `sm_86`, `sm_89`, and `sm_120`.
- Intel, Apple, unknown, or unresolved GPUs return `null`.

AMD target resolution uses a checked-in map generated from AMD's ROCm GPU architecture data. It resolves product names such as Radeon RX 6000, RX 7000, RX 9000, Radeon 780M/890M, and Instinct MI-series models to exact `gfx*` targets. If an APU reports only a generic `AMD Radeon Graphics` model, Pinokio lazily checks the CPU brand and applies the same map.

NVIDIA target resolution uses a lightweight `nvidia-smi` compute capability query and converts the result to an `sm_*` target. The query is cached for the Pinokio process.

AMD ROCm example:

```js
{
  when: "{{platform === 'linux' && gpu === 'amd' && /^gfx103[0-2]$/.test(gpu_target || '')}}",
  method: "shell.run",
  params: {
    message: "uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm7.1"
  }
}
```

NVIDIA architecture example:

```js
{
  when: "{{gpu === 'nvidia' && /^(sm_86|sm_89)$/.test(gpu_target || '')}}",
  method: "shell.run",
  params: {
    message: "echo NVIDIA Ampere or Ada target selected"
  }
}
```

## `{{gpu_driver}}`

Templates now expose the selected primary GPU driver version as `gpu_driver`. This is a raw string from the selected controller, commonly something like `565.90` or `580.88`.

Use this when the install choice depends on the NVIDIA driver family. The current practical case is CUDA wheel routing: a `cu130` PyTorch/Triton stack can fail on a machine whose NVIDIA driver only supports CUDA 12.x, so launchers need a conservative fallback after confirming the selected GPU is NVIDIA.

`Number.parseFloat(gpu_driver || '0') >= 580` means:

- `gpu_driver || '0'`: if the driver is missing or unreadable, treat it as `0`.
- `Number.parseFloat(...)`: convert strings such as `580.88` or `565.90` into comparable numbers.
- `>= 580`: use the CUDA 13 wheel lane only for NVIDIA driver 580 or newer.

The current CUDA wheel routing rules are:

- `gpu !== 'nvidia'`: do not install a CUDA wheel.
- `gpu === 'nvidia'` and `Number.parseFloat(gpu_driver || '0') >= 580`: use `cu130`.
- `gpu === 'nvidia'` and the driver is missing, unreadable, or below `580`: use `cu128`.

For this release, the new generic NVIDIA launcher rule only adds the `cu130` / `cu128` split. Older tags such as `cu121`, `cu124`, and `cu126` remain app-specific pins and are not part of the new generic routing rule.

Windows NVIDIA example:

```js
{
  when: "{{platform === 'win32' && gpu === 'nvidia' && Number.parseFloat(gpu_driver || '0') >= 580}}",
  method: "shell.run",
  params: {
    message: "uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu130"
  }
}
```

```js
{
  when: "{{platform === 'win32' && gpu === 'nvidia' && !(Number.parseFloat(gpu_driver || '0') >= 580)}}",
  method: "shell.run",
  params: {
    message: "uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128"
  }
}
```

Linux NVIDIA example:

```js
{
  when: "{{platform === 'linux' && gpu === 'nvidia' && Number.parseFloat(gpu_driver || '0') >= 580}}",
  method: "shell.run",
  params: {
    message: "uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu130"
  }
}
```

```js
{
  when: "{{platform === 'linux' && gpu === 'nvidia' && !(Number.parseFloat(gpu_driver || '0') >= 580)}}",
  method: "shell.run",
  params: {
    message: "uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128"
  }
}
```

## `{{gpus}}`

Templates now expose all detected GPU controllers as `gpus`. Each entry includes `name`, `model`, and `driver`.

Use `gpus` for diagnostics, multi-GPU reporting, or advanced app-specific selection. For normal PyTorch installs, prefer the top-level `gpu`, `gpu_model`, `gpu_driver`, and `gpu_target` variables because they already apply Pinokio's primary-controller selection rules.

```js
{
  when: "{{(gpus || []).some((item) => item.name === 'nvidia')}}",
  method: "shell.run",
  params: {
    message: "echo At least one NVIDIA controller was detected"
  }
}
```

```js
{
  method: "shell.run",
  params: {
    message: "node scripts/write-hardware-report.js",
    env: {
      PINOKIO_GPU_MODEL: "{{gpu_model || ''}}",
      PINOKIO_GPU_DRIVER: "{{gpu_driver || ''}}",
      PINOKIO_GPU_TARGET: "{{gpu_target || ''}}",
      PINOKIO_GPUS: "{{JSON.stringify(gpus || [])}}"
    }
  }
}
```

## `{{vram}}`

Templates expose the selected primary GPU VRAM as `vram`, rounded to integer GB. When VRAM is unavailable, `vram` is `0`.

Use this for memory-tier routing or hardware warnings, not for vendor or architecture detection.

```js
{
  when: "{{vram >= 16}}",
  method: "shell.run",
  params: {
    message: "echo High-VRAM install path selected"
  }
}
```

```js
{
  when: "{{vram > 0 && vram < 8}}",
  method: "shell.run",
  params: {
    message: "echo This app may need at least 8 GB VRAM"
  }
}
```

---

# Bug Fix

## Cache handling

Pinokio now preflights managed cache directories for `TMP`, `TEMP`, `TMPDIR`, `PIP_TMPDIR`, `UV_CACHE_DIR`, and `PIP_CACHE_DIR`. Normal healthy directories are left alone; broken managed directories can be repaired before they turn into confusing package-install failures.

## `pre` syntax

Malformed `pre` or environment metadata no longer crashes preflight or the `/pre/api/:name` page. Invalid app, plugin, and task manifests are routed through content validation so users get a fixable error state instead of a server-side exception.

## `huggingface_hub` fix

The managed Hugging Face runtime is pinned to `huggingface_hub=1.20.1`, and Windows symlink behavior is handled so model downloads avoid the known symlink-related failure mode.

## Python SSL fix

The managed Python base is pinned to `3.10.20`, with the Windows conda-forge build requirement that includes the SSL/certificate fix. This keeps SSL-sensitive package and model downloads from inheriting the older broken base state.

## Homebrew fix

Homebrew install steps now run with `HOMEBREW_NO_ASK=1` so Homebrew does not unexpectedly prompt during Pinokio onboarding. The Xcode command-line tools path also distinguishes between installable states and manual states such as an unaccepted Xcode license.

## UV upgrade

The managed uv module is pinned to `0.11.23`, and install checks compare the installed version instead of treating any old uv binary as good enough.

---

# Misc

## Pin Conda

Pinokio protects its managed Conda base from launcher scripts that try to update Conda or `conda-libmamba-solver`. The base runtime is owned by Pinokio, so apps should not mutate it as part of app installation.

## Plugin

### Native plugin

Native plugins are now bundled under Pinokio's system plugin source instead of being cloned from GitHub at runtime. That makes the core plugin list available immediately and removes a network-dependent bootstrap step.

### Plugin actions as JavaScript functions

Plugin `run`, `install`, `uninstall`, `update`, and `installed` actions can now be JavaScript functions, not only static arrays. This allows plugins to compute actions from current state while still going through Pinokio's validation and install-state APIs.

### Additional plugins

This release bundles managed tool entries for:

- Antigravity CLI
- Antigravity CLI Auto
- OpenAI Codex
- OpenAI Codex Auto
- Codex Desktop
- Claude Code
- Claude Code Auto
- Claude Desktop
- VS Code
- Cursor

## Native Login

Hugging Face login now uses a native device-authorization flow inside Pinokio, with clear connection state and provider ownership. GitHub login also moved to a managed Git Credential Manager path so GitHub authentication no longer depends on users typing credentials into a terminal prompt.

![Hugging Face native login flow](media/huggingface-login.png)

## Manage skills

Pinokio now ships managed skills that can be synced into local agent skill folders. The Skills page shows the source library, sync targets, validity, conflicts, and ON/OFF state for each managed skill. Built-in `pinokio` and `gepeto` skills can be disabled without deleting their source copies, and additional skills can be downloaded from a Git URL.

![Managed skills page with sync targets and toggles](media/skills-management.png)

# Versions

## 7.5.21

### Fix Antigravity CLI plugin

Antigravity CLI now installs and runs through Pinokio's managed `agy` binary instead of relying on the old broken CLI path. Install and update download the official Antigravity release asset, verify the release digest metadata, place the binary under Pinokio's managed `bin`, and route missing installs back to the plugin install page.

![antigravity](media/antigravity.png)

### Display plugin description metadata on the Dev page

The Dev page now shows plugin description metadata directly in the Terminal Apps and Desktop Apps lists. Plugin-provided descriptions appear under each tool, and plugin apps are listed before the Project Shell so users can choose an agent or editor without scanning past generic terminal entries first.

![Dev page plugin descriptions](media/dev_detail.png)

### Clean up default plugins

The default plugin bundle is trimmed for this beta. Qwen Code, Crush, and Windsurf are removed from the bundled defaults for now, leaving the built-in list focused on OpenAI Codex, Claude Code, Antigravity CLI, VS Code, Cursor, Codex Desktop, and Claude Desktop.

![Cleaned default plugin list](media/plugins-agent-tools.png)

### Add mobile bottom-row window controls

The mobile footer now carries the app-window controls that previously required desktop width: Home, Back, Forward, Refresh, vertical split, horizontal split, New window, and Close pane when the current pane can be closed.

![Mobile home layout with footer navigation](media/mobileview.gif)

### Keep Home row position after stopping an app

Stopping an app from Home now updates the row in place. The app no longer jumps to the bottom of the list just because its running state changed, so users can stop a process without losing their position in the current sort order.

![preserve](media/preserve.gif)

### Redesign window splitter modal

The vertical and horizontal split controls now open a redesigned pane picker. Users can choose a running app/process, pick Run or Dev for an installed app, or enter a local URL before opening the new pane.

![Redesigned window splitter modal](media/splitter-modal-redesign.png)

### Animate sidebar toggle transition

The sidebar toggle now animates between expanded and collapsed states, so the layout change feels connected to the control instead of snapping instantly.

![Sidebar toggle animation](media/sidebar_toggle.gif)

### Auto-select default script when enabling Autolaunch

If a user turns `Start with Pinokio` on before choosing a script, Pinokio now selects the app's menu default automatically when one exists. This removes the old warning-only path for launchers that already declare a safe default script, while still asking the user to choose when no default script is available.

![Autolaunch toggle](media/autolaunch_toggle.gif)

## 7.5.24

### Plugin dashboard refactor

The plugin page automatically closes the terminal after any of the tasks has finished (install/update/uninstall/etc.), and refreshes, letting the user know what to do next.

![pluginupdate.gif](media/pluginupdate.gif)


## 7.5.26

Download at [https://github.com/peanutcocktail/pinokio/releases/tag/v7.5.26](https://github.com/peanutcocktail/pinokio/releases/tag/v7.5.26)

### Network discovery fix

Properly find listening services on the machine, not by looking for LISTENING on netstat but by looking at IP

### Network page inline refresh

Previously the network page used to keep hard reloading whenever there's a change. Now they refresh inline without a full page reload.

### Full log report per session

Previously only the LATEST log was included in the "Get help" report section, which would miss a lot of useful logs for reporting.

For example when you run `install.js`, which calls `torch.js`, and then after the install `start.js` is called, all within one run, now all these are grouped into a single session, and included in the final report.

Also the user can flip through sessions to check AND post the logs per session.

### Redaction for global logs page 

The global logs page (which includes files like `state.json`, `stdout.json`, `system.json`, etc.) can now be redacted via privacy filter before creating a zip file


## 7.5.27

Download at [https://github.com/peanutcocktail/pinokio/releases/tag/v7.5.27](https://github.com/peanutcocktail/pinokio/releases/tag/v7.5.27)

### do not print env variables in logs

do not print environment variables in ~/pinokio/logs/shell/cleaned/index.txt and ~/pinokio/logs/shell/info/index.txt

## 7.5.28

Download at [https://github.com/peanutcocktail/pinokio/releases/tag/v7.5.28](https://github.com/peanutcocktail/pinokio/releases/tag/v7.5.28)

### {{ready}}

a new template variable that checks if a script is ready or not

```
{
  "when": "{{ready('start.js')}}",
  "method": "shell.run",
  "params": {
    "message": "python app.py"
  }
}
```

### sidebar hover view

When the sidebar is collapsed, hovering your mouse to the left edge will display the sidebar drawer, and automatically collapse when moved away.

![media/sidebar_hover.gif](media/sidebar_hover.gif)


### persist sidebar toggle status

The app pages used to remember the toggle state, but home and other pages did not reemmber the sidebar toggle state. Now once you collapse it will stay collapsed even when you navigate away and come back

### Add explore button to the navbar

Now the explore button is always visible regardless of which page you're on

![media/global_explore_button.gif](media/global_explore_button.gif)

### remove logs/info

The `PINOKIO_HOME/logs/info` folder is not really useful so removed it from logging

### refactor home context menu 

There are no tabs anymore, just a single simple list with everything. Also the delete button is immediately visible when the context menu opens, so no need to navigate to "Files" tab to delete.

![media/context_menu.png](media/context_menu.png)

## 7.5.29

Download at [https://github.com/peanutcocktail/pinokio/releases/tag/v7.5.29](https://github.com/peanutcocktail/pinokio/releases/tag/v7.5.29)

### Home context menu fix

Previously clicking menu items from the home context menu would start the selected script but ALSO select the default script.

The fix: Send to the "open without launching" view and run the selected script only. This means it will ONLY run the selected script and won't automatically run other scripts even after this script has finished running.
