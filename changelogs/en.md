# 1.3.1

- Screenshot quick-action cards remain usable and can always be dismissed when a desktop wallpaper or temporary file is unavailable.

# 1.3.0

- 3D Lens camera controls are now available by default.
- ScreenCam now launches correctly on macOS 15.
- iPhone recordings now capture the selected Mac microphone.
- iPhone recordings now fit their device frame correctly, including iPhone 17 Pro, without extra wallpaper, padding, or thin edge lines.
- Area screenshots now preserve open macOS menus, ignore repeated shortcuts, support very small selections, and stay responsive while dragging.

# 1.2.0

- Experimental 3D Lens zoom clips can tilt the screen plane, preview and drag focus points, double-click the canvas to focus, adjust depth of field, and transition smoothly between adjacent 3D shots.
- 3D Lens clips can add customizable moving glass reflections with softbox, window, or strip-light shapes.
- Zoom clips show their entry curve on the timeline, where dragging its anchor adjusts or disables the zoom-in animation.
- 3D Lens focus previews fall back to the zoom clip's first frame when the intended frame is unavailable.
- Cursor click sounds now play distinct press and release audio in sync with clicks, long presses, and drags.
- Area and window selection overlays now appear reliably for recordings and screenshots, and completing a screenshot no longer crashes while closing the overlay or showing its quick-action card.
- Frozen window screenshots preserve the exact frame shown during selection.
- Screenshot shortcuts remain available while recording, recording controls stay clickable, and global shortcuts require exact modifier combinations.
- Screenshot annotations now support reusable dashed pen styles, show both curve handles for lines and arrows, lock pen and highlighter strokes to fixed directions with Shift, and clearly mark move-only freehand selections.
- Timeline clips now show identifying icons and manual zoom levels; Command-dragging a Zoom entry anchor adjusts its level.
- Moving or resizing a Zoom clip, or adjusting its entry-speed anchor, no longer changes the selection; adjacent resize handles also remain assigned to the correct clip at shared edges.
- Slow custom spring curves now preview and animate smoothly through the end instead of jumping to the final position.
- Moving and resizing Zoom clips stays smooth while their curves and adjacent transitions update live.
- Capture selection, screenshot editing and quick previews, large-project zoom waveforms, and 3D Lens editing now respond more quickly.
- Resizing the recording editor window now stays responsive by avoiding repeated preview resource rebuilds.

# 1.1.3

- Capture screenshots or open existing images for editing, with optional custom shortcuts, instant capture of the display under the pointer with visual and shutter-sound feedback, frozen-screen selection, temporary-file cleanup, quick actions, window screenshot background presets using the captured desktop wallpaper, device mockups, final canvas aspect ratios, cropping, annotations, responsive copy progress, and live export size and quality previews up to 5K.
- Optional Cursor timeline clips can override the global cursor style for any part of a recording.
- MacBook mockup previews and exports no longer crash when rendering very small or invalid frame geometry.
- Preview and export stay smooth in projects with many cursor style override clips.
- Cursor animations and caption editing stay responsive in long, event-heavy recordings.
- Large-window recording startup uses less memory, while background previews and cursor pack downloads keep the editor responsive.
- Window screenshot quick-action cards now appear before full-resolution background rendering completes, and resizing the screenshot editor reuses the rendered preview to avoid repeated checkerboard and shadow compositing.

# 1.1.2

- Recording clips now support playback speeds up to 10x.
- Window recordings no longer flicker in translucent sidebars or along window edges.
- Finder reveal actions now bring Finder to the foreground, and quick exports return to the recording actions after revealing the result.
- Project file pickers now remember the last folder used to open a project.
- Cursor style packs load instantly from the local library and can be downloaded, updated in place, localized, privately renamed, imported, shared, and managed in Settings.
- Create cursor packs from cropped images with automatic background removal and an adjustable click point, preview them in Finder, and render them consistently in projects and exports.
- Submit locally created cursor packs to the open official catalog through an agent-assisted pull request.
- Cursor size and movement rotation now support wider adjustment ranges.
- Cursor size stays consistent between the editor preview and exported video.

# 1.1.1

- Caption settings are always available, captions can be added manually, and caption or word clips can be deleted directly from their timelines.
- Automatically detected window corners and curved Screen insets now follow matching, even smoothing.
- Zoom clips can be selected and resized reliably, including on zoomed-in timelines.
- Timeline clips no longer flicker while zooming.
- Timeline zooming and Zoom clip resizing stay responsive in projects with many clips.

# 1.1.0

- Cursor movement can now tilt subtly left or right with an adjustable maximum angle.
- Camera motion blur now fades around movement without softening static preview frames.
- Zoomed previews keep source text sharp when mockups use animated backgrounds.
- Cursor movement and long presses now stay consistent between preview and export, with speed-aware interpolation and zoom-aware motion blur.
- Cursor rendering no longer crashes before the first recorded event.
- Post-recording previews now open smoothly, and their Space shortcut works without Input Monitoring permission.
- Screen and mockup custom backgrounds now support smoothly looping videos with adjustable 0.1x–2x playback speed in preview and export.
- ScreenCam now targets Apple silicon Macs exclusively, significantly reducing the app's install size.
- High-resolution custom video backgrounds stay smooth, load reliably in paused previews under system load, and export significantly faster.
- Partial exports keep video backgrounds aligned to the correct timeline position.
- Playback preview keeps cursor motion synchronized while zoom and camera movement remain smooth across speed changes.
- Canvas aspect-ratio and crop controls no longer drag the editor window.
- Manual Zoom clips stay steady near source edges through the end of zoom-out.
- Shadow controls now use tactile two-dimensional pads with size-aware direction, offset, blur, and strength, while large offsets keep shadows soft instead of turning solid black.
- Window controls now support adjustable corner smoothness and configurable border width and color while preserving captured-content geometry and crisp edges at every zoom level.
- Screen frames keep smooth corners, clean edges, and visible shadows on light backgrounds.
- Quick Focus adds customizable shortcuts, interactive locked zoom with edge-push navigation and seamless level switching, plus optional ProMotion rendering up to 120 Hz.
- Custom sliders, draggable number inputs, and precise editor interactions now provide tactile trackpad feedback.
- Keyboard overlays show the correct base key, and held keys stay stable until the first matching key release.
- Mixed-audio exports preserve rendered video without an extra encoding pass, and exports no longer fail when a recorded audio track is disabled.
- The recording toolbar stays on the correct display in vertically arranged multi-monitor setups.
- Manual Zoom clips now use a single center and zoom level, with the mini map in Clip Settings.
- Adjacent Zoom clips now move and scale together without merging or resetting to 1x.
- Zoomed previews preserve source detail at every editor window size.
- Timeline hover previews stay responsive across Zoom clip boundaries.

# 1.0.9

- Manual Zoom anchors now use responsive 1:1 canvas controls with a render-aligned mini map.
- Presets keep custom backgrounds and wallpapers available across projects, launches, and sharing.
- Zoomed previews keep source text sharp in smaller editor windows.
- Generic Display mockups can be customized with border size, inner and outer corner radius, stand style, and stand size.
- Exports now check available disk space before rendering to avoid late failures.
- High-frame-rate screen and iPhone recording keeps audio responsive while reducing redundant queued and rendered frames.
- Trimmed video, GIF, and Live Photo exports start decoding near the selected range, while audio-only changes can reuse already rendered video.
- Preview, timeline, cursor, waveform, caption, camera overlay, and workspace processing use bounded caches and shared work for smoother long recordings.
- GIF and parallel exports use bounded pipelines and fairer resource scheduling to reduce contention.
- Timeline hover previews no longer flicker back to the playhead frame when moving vertically across clips.
- Timeline scrubbing during playback pauses while dragging and resumes after release.
- Timeline hover cursors, scrub playheads, and ruler labels stay more responsive through preview refreshes, playback, and zoom boundaries.

# 1.0.8

- Recordings can finish into a floating quick-action card with rendered preview thumbnails, replay-from-start preview, editing, preset, export, save, source-save, and draft actions.
- Camera background removal supports cached sticker styling with adjustable portrait-scaled outline, shadow, and frame preview.
- Appearance settings can switch the editor, inspector panels, export surfaces, recording toolbar, tooltips, and material previews between dark, light, and automatic modes.
- App language settings now include Traditional Chinese, Spanish, French, Brazilian Portuguese, and Italian.
- Camera overlays support more aspect ratios, background removal with inline progress, transparent portrait mode, packaged custom image backgrounds, and one-click settings copy to every camera clip.
- Quick-action cards hide during capture selection, return after recording or cancellation, follow the active display, and keep every visible card clickable.
- Transparent portrait camera overlays export correctly, gradient background edits refresh the preview immediately, manual zoom anchors stay visible, number-input dragging remains stable across screen edges, and the purchase screen follows the selected appearance.

# 1.0.7

- Captions support provider and local-model transcription, editable read-along segments, per-caption visibility, preset-backed styling, and cleaner export backgrounds.
- Caption backgrounds support blur and liquid-glass materials with adjustable blur, saturation, glass style, and tint.
- Camera overlays support adjustable corner smoothness and a softer square default style.
- Effect layers are now named Annotation throughout the editor.
- Editor settings can reorder and hide feature entries, with Animation, Keyboard, and Beauty hidden by default and extra hidden entries collected under More.
- Recordings wait for enabled screen, microphone, and system audio inputs before writing media, and delayed audio sidecars stay aligned in preview, export, timeline clips, and waveforms.
- Camera cleanup after early recording failures no longer crashes, and low-storage write failures keep recoverable media with a clear warning.
- Disabled keyboard keys stay hidden after reopening projects, including preview and export.
- Project opening and exports render initial video frames reliably, and dense caption and timeline groups separate correctly after deeper zoom.
- Timeline hover cursors, scrub playheads, and zoom anchoring stay stable during playback, dragging, scrolling, and zooming.
- Remote caption transcription uploads optimized temporary audio to reduce request size and catch provider file-size limits earlier.
- Camera overlay previews, dense timeline tracks, and caption segment editing are more responsive on long recordings.

# 1.0.6

- Recordings can be paused and resumed from the toolbar, menu bar, or CLI, with paused time omitted from the saved workspace.
- Image effect layers can fade in and out or skip entrance and exit animations.
- Editor header title opens workspace options for renaming and showing the .cam file in Finder.
- Crop Source can scale source dimensions by ratio, width, or height.
- Screen Size padding can be adjusted per edge with a higher maximum range, and Device Padding supports negative offsets up to 3000 px.
- Draft recordings stay separate from saved .cam workspaces, keep close-time save/delete choices, appear in Recent, and save to selected folders without repeated authorization or missing-media errors.
- H.264 screen recordings start reliably on systems that reject unsupported frame-rate encoder hints.
- Editor undo and preview cursor rendering are more reliable during repeated undo and transient layout updates.
- Camera overlays no longer turn black after trimming a recording clip to its minimum length and undoing.
- Zoom-track creation previews create the zoom clip when clicked.
- Cursor click effects stay aligned on rotating iPhone mockups.
- Mockup edges hide thin gaps without drawing over the recording.
- Cursor click effects default to off, and clicked cursors shrink more clearly.
- Recorded cursor shapes preserve more system states, with custom cursor styles falling back to the default pointer for unsupported shapes.
- The recording toolbar opens reliably from the Dock, menu bar, and shortcuts after switching desktop spaces, while keeping its glass and position during audio capture and recording.
- Window recording selection keeps a compact toolbar prompt with clickable Esc exit controls.
- Click-sound preview playback stays responsive on recordings with dense cursor event histories.

# 1.0.5

- Exports can continue in the background with remaining-time estimates, a customizable notch progress surface, completed export actions, and genie-style window restore.
- Timeline splitting has a dedicated mode with Option hold, a scissors cursor, and linked recording-audio focus.
- Cursor settings can hide an idle cursor and use downloadable click sounds that play in preview and export, with downloaded sounds available offline.
- Mockup assets can be downloaded and updated from the catalog, with series, model, color, and Apple Watch case and band choices reflected in the preview.
- GIF export adds 1080p-and-lower resolution presets and estimated file size before export.
- Existing workspaces keep their selected mockup while migrated assets finish downloading.
- GIF exports preserve light UI colors and effect layer geometry more accurately.
- Switching between GIF and Live Photo export keeps the trim preview stable, and the GIF format selector responds across its full segment.
- Very short timeline clips are easier to select without accidentally trimming them.
- Mockup catalog downloads use less memory, and long GIF exports allocate fewer frame buffers.

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
