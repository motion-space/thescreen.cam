# 1.0.15

<!-- highlights
- Click the tray icon to restore your editor
-->

- Clicking the system tray icon now brings the open editor or its dialog to the front, restoring the editor if it is minimized.

# 1.0.14

<!-- highlights
- Smoother cursor motion and blur
- Fixed toolbar white blocks after waking
- More reliable updates and restarting
-->

- Smoother cursor motion blur, with more consistent cursor sampling in new recordings.
- Fixed white blocks in the recording toolbar and improved its recovery after sleep or display changes.
- Update prompts stay visible beside the toolbar and no longer offer the version already installed.
- Improved exit and restart reliability.
- Fixed missing tooltip text on the system tray icon.

# 1.0.13

<!-- highlights
- Fixes a crash at launch in many regions
-->

- Fixed ScreenCam closing right after it starts when Windows uses a regional format with a decimal comma, such as German, French, Russian, Polish, Slovenian or Brazilian Portuguese.
- Crash reports are now saved and offered reliably whatever the regional format or calendar.

# 1.0.12

<!-- highlights
- Store update reminders with what's new
- Screenshots select like recordings
- Faster editing in long recordings
-->

- Get notified of Microsoft Store updates and see what's new.
- Screenshot selection now works like recording selection.
- Redesigned screenshot quick actions card with a faster menu.
- Faster editing in long recordings.
- Export dialogs stay centred, and the editor opens at a better size.
- Interface text follows the app language, and Chinese text is no longer too bold.

# 1.0.11

<!-- highlights
- Word-by-word captions, offline or cloud
- New Screenshots settings and shutter sound
- Send feedback from inside the app
-->

- Generate word-by-word captions for your recordings, either fully offline on your PC with a local Whisper model (downloaded on first use) or through a cloud transcription provider with your own API key.
- Edit captions on the new caption lane, in the Captions inspector, or in the Edit Captions window; select a caption to play it back, see its waveform, and adjust the timing of individual words.
- Caption styles, including blur and glass backgrounds, appear in the preview and in exports, and presets now save the caption look.
- A new Screenshots settings page lets you choose the shutter sound, the quick actions card, deleting or closing after copy, and a separate cleanup period for temporary screenshots.
- Full-display screenshots play a shutter sound and briefly flash the screen, and a new "Open Screenshot Toolbar" shortcut and tray menu item are available.
- Screenshots now behave like the macOS app: area screenshots are taken as soon as you release the mouse, display screenshots capture the display under the pointer, and files are named like "Screenshot 2026-10-23 14.30.00.png".
- Screenshot shortcuts are no longer assigned by default; shortcuts already saved in your settings are kept.
- Send feedback to the developers from inside the app.
- The welcome tour ends by asking whether to share anonymous usage analytics.
- HDR recordings keep the color of bright highlights when converted to SDR.
- Preview audio keeps playing through sped-up clips.
- Projects created on macOS keep their captions and keyboard data when saved on Windows.

# 1.0.10

<!-- highlights
- Screenshots now available to everyone
- Double-click a selection to capture
- Faster screenshots, including on HDR
-->

- Screenshots are now available to everyone instead of being an experimental setting, with entries in the recording toolbar and the tray menu.
- Double-click inside a selected area to take the screenshot.
- The area outside the selection is shaded while you select on a frozen screen.
- Screenshots start faster, including on HDR displays.
- Screenshot cards show sharper text and thumbnails, and the quick actions menu and Show in Explorer work more reliably.
- The screenshot editor can be dragged by its title bar again.
- Selection handles look and behave the same when selecting an area for screenshots, recordings, and Crop.

# 1.0.9

<!-- highlights
- New first-run welcome tour
- Sharper toolbar icons at 150% scaling
- Cleaner Settings window
-->

- A first-run welcome tour introduces recording and editing, as in the macOS app.
- Recording toolbar icons are sharper at 150% display scaling, and Chinese window titles and labels in the selection bar are easier to read.
- The Settings window no longer shows a redundant Close button.

# 1.0.8

<!-- highlights
- Redesigned recording toolbar with pause
- GIF export and copy to clipboard
- Faster background exports with HEVC
-->

- Redesigned recording toolbar matching the macOS app, with acrylic capsule cards, live audio meters, smooth transitions, and buttons to mute the camera, microphone, system audio, and keyboard overlay while recording.
- Pause and resume recordings from the toolbar or the tray menu, which now shows the current recording state.
- A compact selection bar for Display, Window, and Area capture; press Enter to start recording, and window capture shows the app icon and window title.
- Cameras are recorded natively, including OBS Virtual Camera, and ScreenCam only records the camera you selected, warning you while recording if it sends no video.
- Windows screen capture permission is settled before recording starts, and capture permissions can be managed in Settings.
- HDR app windows are tone-mapped correctly on HDR displays, and capture runs smoothly at up to 60 fps with less overhead.
- Recordings end cleanly when the captured window closes or an audio device is disconnected.
- Exports run in the background with a progress indicator that you can cancel at any time.
- Export to GIF or copy the result to the clipboard from the export dialog and quick export.
- Faster exports in a single encoding pass; the Automatic codec uses H.265/HEVC, a default codec can be set in Settings > Export, and MP4 files start playing sooner when streamed.
- The export dialog starts from the macOS defaults and shows a steadier remaining-time estimate, a clear canceled state, and readable default file names.
- Export, Crop, and preset confirmation dialogs open in their own windows above the editor.
- A File menu with Open Recent, Rename, Save, and Save As, plus recent projects in the taskbar jump list.
- Add your own wallpaper images in Settings.
- Open ScreenCam at login, and a new About page in Settings.
- Timeline improvements, including a zoom clip context menu, an easier-to-find Split action, Ctrl+Y to redo, and single-step undo for more edits.
- Keyboard overlays label Windows modifier keys with words and no longer show phantom or duplicate key presses.
- Simplified Chinese now covers the editor, toolbar, export, and quick actions throughout.
- Deleted drafts are moved to the Recycle Bin, and a saved crash report is offered on the next launch.
- A redesigned ScreenCam Pro window, with support for monthly subscribers and 60-, 90-, and 180-day codes, and the remaining Pro period shown in Settings.
- Background music stays in sync in exports, and audio in sped-up clips is time-stretched.
- The editor opens faster, plays back more smoothly, and frees memory after it is closed.

# 1.0.7

<!-- highlights
- Mesh gradient backgrounds with noise texture
- Refreshed sliders and segmented controls
- Fixed startup without Visual C++ runtime
-->

- Mesh gradient backgrounds, plus an optional noise texture with adjustable density, intensity, and size.
- Refreshed sliders and segmented controls matching the macOS app.
- Support for 365-day ScreenCam Pro codes.
- Fixed ScreenCam failing to start on PCs without the Visual C++ runtime installed.

# 1.0.5

<!-- highlights
- Smaller download, about 120 MB installed
-->

- Smaller download: the installed app shrinks from about 214 MB to about 120 MB.

# 1.0.4

<!-- highlights
- First release on the Microsoft Store
- Record a display, window or area
- Zooms, cursor styles and MP4 export
-->

- First release of ScreenCam for Windows on the Microsoft Store.
- Record a display, a window, or an area, with camera, microphone, and system audio.
- Edit recordings with zooms and 3D spatial zoom, cursor styles and click sounds, keyboard overlays, annotations, backgrounds and wallpapers, device mockups, background music, crop, speed changes, and presets.
- A quick actions card after each recording, and customizable global recording shortcuts.
- Export edited recordings to MP4.
- ScreenCam Pro unlocks export, as a one-time purchase, a monthly subscription, or a 30-day code.
- Screenshots are available as an experimental feature in Settings.
