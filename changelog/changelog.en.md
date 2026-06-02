# 1.0.1

### Highlights

- Added iPhone recording support.
- Added keyboard recording support.
- Added Live Photo export support.
- Updated the recording toolbar with a cleaner presentation.
- Redesigned the export dialog as a polished in-editor overlay with smoother sizing, clearer controls, adaptive Live Photo preview, 60-second Live Photo trimming, and better switching behavior.
- Added preview playback speed controls from 0.25x to 2x.
- Added Open at Login and cleaner general settings.
- Added a new Appearance settings page for theme color, toolbar material, and tooltip material.
- Added typed hex value support for color pickers.
- Added tooltips for recording controls, inspector tabs, and undo/redo shortcuts.
- Improved area selection with typed dimensions, center guides, aspect ratio presets, and Shift/Option resize shortcuts.
- Added camera beauty filters with live preview, recording defaults, editor adjustments, and face-aware shape controls.
- Improved default camera animation with softer spring motion and stronger motion blur.
- Improved shortcut settings with larger animated keycaps and removable bindings.
- Added more export canvas aspect presets, source crop controls, and 5K-capped source exports.
- New recordings are now autosaved as .cam workspaces in a configurable location before the editor opens.
- Recording settings now show workspace and raw cache size, with cleanup options.
- The editor title can now reveal the workspace in Finder.
- About settings can now export recent error logs for troubleshooting.
- Stopping a recording now enters Processing immediately and keeps finalization alive longer.

### Fixes

- Fixed source-resolution export sizing to match the final preview composition.
- Fixed black bars on exported canvases caused by pixel rounding.
- Fixed display and laptop mockup exports, including animated wallpapers, frame backgrounds, and rounded screen clipping.
- Fixed native traffic-light button positioning during fullscreen transitions.
- Fixed window recording corner radius by reading the captured window mask instead of using a fixed estimate.
- Increased viewport and CLI window-capture corner radius support up to 120.
- Fixed full-volume audio exports preserving H.264 bitrate instead of inflating file size.
- Fixed mockup zoom behavior near source edges.
- Fixed Intel Mac crashes during capture target selection and menu bar updates.
- Fixed area and window capture selection on secondary displays.
- Fixed capture selection fronting, cancel button hit area, and start button hover crash.
- Fixed MP4 exports for better Preview and Finder compatibility.
- Fixed preview camera motion with smoother edge-clamped zoom paths, cleaner auto-follow movement, and more accurate directional motion blur.
- Fixed color picker drag handles staying anchored while editing.
- Fixed declined screen recording permission handling.
- Fixed repeated recording clips exporting stale frames.
- Fixed 4K exports stalling around 3% on high-resolution recordings.
- Fixed preview playback and export preview blanking issues.
- Fixed recording toolbar visibility when switching desktops.
- Improved recording toolbar audio meter movement.
- Fixed system-audio recordings hanging during processing.
- Fixed unsaved editor close/quit behavior to use ScreenCam’s own prompt.
- Fixed long exports with animated wallpapers or camera overlays stalling near 79%.

### Performance

- Improved editor resizing with large keyboard tracks.
- Optimized recording with leaner video buffers.
- Reduced extra capture work for window recordings with system audio.
- Reduced unnecessary mouse tracking during preview playback.
- Improved long high-resolution exports with faster chunked rendering and lower CPU and memory use.
