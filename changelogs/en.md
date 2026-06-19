# 1.0.4

- Preview overlays share square resize handles, edge resizing, modifier-key resizing, and direct corner-radius dragging.
- Focus effects can cover the full frame while editing mockup recordings.
- Effect clips show type icons, can be renamed, and use text content as labels when unnamed.
- ScreenCam can select and record its own app windows.
- The purchase screen offers a one-time ScreenCam Pro Lifetime purchase alongside subscriptions.
- Preview overlay dragging and resizing stays accurate during camera zoom and camera auto-scale.
- Text effects keep their configured font size when text boxes are resized smaller.
- Focus effect masks better match mockup screen corners and selection outlines.
- Renamed workspace packages keep autosaving without missing-media alerts.
- Recording device menus refresh when microphones or cameras are connected or removed.
- Trimmed master recordings can be dragged back to their original length, and dense timelines scroll vertically in short editor windows.
- Toolbar Open Workspace starts in the default recordings workspace folder.

# 1.0.3

- Effect layers can add mosaic, focus, text, and image clips from a compact preview grid, with multi-lane timeline placement and export rendering.
- Effect editing is more precise with focused text editing, stable zoomed text layout, off-screen placement, preview resizing, zoom-aware editing, and live image-corner previews.
- The timeline track area can be resized while keeping the preview visible and avoiding empty track space.
- CLI workspace commands can create and update effect clips.
- About settings can open the website changelog.
- Keyboard event settings include an Enable All switch for selected keys.
- Recorded system audio and microphone tracks can be boosted above 100%.
- Recorded system audio and microphone clips stay aligned with recording splits, trims, and speed changes, with stable preview and export volume.
- Microphone meters animate correctly while recording from 24-bit input devices.
- Camera animation defaults start from a softer spring profile.
- Camera beauty starts from a stronger, more natural default look.
- Background music can be browsed, previewed, imported from the catalog or files, adjusted per clip, and exported with recording audio.
- Newly finished recordings recover the editor preview more reliably, including wallpaper loading and video wallpaper selection changes.
- Editor preview and mockup exports better match final output, including edges, text layout, and zoom animation timing.
- Zoomed timeline tracks keep rulers, playheads, hover previews, and clip cursors aligned while horizontally scrolling, and restore the left edge to 00:00 when zooming back out.
- Editor preview fully mutes system audio when its clip or track is disabled or deleted.
- Effect preview, zoom playback, export, and large workspace editing are faster on dense timelines.

# 1.0.2

- Support and Docs links are available from Settings, About, and the Help menu.
- Animation settings show Motion first and support collapsible groups.
- Editor number inputs use icon drag handles and commit typed values when clicking outside the field.
- Screen Size warns about export black bars when the background is None and can remove them.
- Fixed screen dimensions shrink correctly with locked ratios, with natural height dragging.
- Zoom clips support scale levels up to 5x, with steadier manual zoom transitions.
- Recording camera previews explain that they are preview-only and can be hidden from future recordings.
- Manual zoom, custom wallpaper selection, keyboard-event alignment, and source-crop editing are more reliable.
- Camera beauty uses less CPU in recording previews and editor preview playback.
- Preview playback no longer blocks editor close or native file panels during heavy composited rendering.
- Camera beauty adjustments avoid runaway preview CPU usage.
- Camera beauty adds natural localized lip tint, smoother lighting, and better blemish handling.
- Autosaved .cam workspaces keep folder access so editor saves and closes are more reliable in protected locations.
- Camera beauty exports finish faster, especially with smaller camera overlays and lower-resolution output.
- Aspect ratio menus show shape previews for each preset.
- Editor presets save without crashing the preset menu.
- Device mockups shrink their screen opening when needed so recordings cover the screen without letterboxing.
- Paywall purchases avoid binding Apple's confirmation dialog to a specific app window.
- Apple subscription confirmation is more reliable on multi-display setups, with focused diagnostics for suspicious confirmation failures.

# 1.0.1

- New recordings are autosaved as .cam workspaces in a configurable default location before the editor opens.
- Recording settings show autosaved workspace and raw recording cache size, with cleanup for old or all cache items.
- Settings add Appearance controls for theme color, toolbar material, and tooltip material.
- Settings add Open at Login, larger shortcut keycaps while recording, removable shortcut bindings, and recent error-log export.
- The File menu adds lazy Recent and Default Directory submenus for opening saved workspaces.
- The editor header adds preset save, rename, reorder, delete, apply, share, and import actions.
- The editor header adds more export canvas aspect presets, source crop controls, and 5K-capped source exports.
- The editor title can reveal the workspace in Finder.
- Timeline track order persists as an editor preference while hidden tracks reset per session.
- Timeline and source crop support trackpad pinch zoom, with panning in the crop sheet after zooming.
- Area selection supports typed dimensions, center guides, aspect ratio presets, and Shift/Option resize shortcuts.
- Timeline preview controls add playback speeds from 0.25x to 2x.
- Camera beauty filters can be previewed and toggled while recording, saved as defaults, adjusted later, and refined with face-aware shape controls.
- Default camera animation settings use a softer spring profile and stronger motion blur for smoother zooms.
- Preview camera motion keeps edge-clamped zoom-in and zoom-out paths straight and uses directional motion blur from the correct zoom center.
- Cursor playback follows recorded movement with less lag.
- Cursor position and camera focus stay aligned after source cropping.
- Camera overlays stay synchronized with their frame during preview playback.
- Recording stop switches to Processing immediately and keeps finalization alive longer.
- The floating recording toolbar stays visible when switching desktops during recording.
- Recording toolbar audio meters show clearer level movement.
- Area capture selection reliably comes to the front from the floating recording toolbar.
- Window and area capture selection work on secondary displays.
- Declining screen recording permission cancels recording without showing an error.
- Capture selection controls avoid Intel TestFlight crashes, including target hover, menu bar status menu updates, and reopening from the Dock.
- The capture selection cancel button responds across the full circular control.
- Hovering the capture selection start button no longer crashes the app.
- Recordings with system audio enabled finish without hanging in Processing.
- Closing or quitting with an unsaved editor shows ScreenCam's close flow instead of the system document save panel.
- Workspace autosave waits while native file panels are open and writes .cam packages more safely.
- Timeline scrubbing and interrupted interactions no longer leave preview playback frozen or jumping to the end.
- Resizing or dragging timeline clips no longer jumps the playhead when grabbing a clip.
- Preview audio mute and volume controls stay in sync, animate smoothly, and no longer add undo steps.
- Color pickers accept typed hex values and keep drag handles anchored while adjusting color.
- Inspector labels use Screen and Device terminology, and the size preset picker matches other menu controls.
- Tooltips appear on recording controls, inspector tabs, and undo/redo shortcuts.
- Clear tooltip material keeps hover bubbles visible on white backgrounds.
- Exported MP4 videos use Preview-compatible H.264 frame ordering, avoid quarantine metadata, and keep normal-speed audio timing.
- Source-resolution export sizing uses the final preview composition, including frame padding, fixed canvas size, and mockup size.
- Exported canvases avoid edge black bars caused by pixel rounding.
- Display mockup exports render animated wallpaper and frame backgrounds correctly inside the screen frame.
- Laptop mockup exports clip recording content to rounded screen corners.
- Mockup zooms can follow cursor movement past the source edge without snapping the enlarged device to the canvas edge.
- Repeated recording clips export from the correct source frames instead of stale tail frames.
- 4K exports start reliably on high-resolution recordings instead of stalling around 3%.
- Long exports with animated wallpapers or camera overlays no longer stall near 79%.
- Full-volume audio exports preserve rendered H.264 video bitrate instead of inflating file size during audio muxing.
- Recording, preview playback, high-resolution export, and large keyboard timelines use less CPU and memory.
- Editor traffic-light buttons keep native positioning during fullscreen transitions.
