# SongStar V31 — Quick Start Guide

SongStar turns a song, lyrics, and images or video into a timed lyric film. This guide covers the V31 Export Size Fix build: `SongStar-V31-Export-Size-Fix.html`.

## 1. Open SongStar

1. Open `SongStar-V30-Stretch-Fit.html` in a recent version of Microsoft Edge or Google Chrome.
2. Select **PLAYER** to watch the film or **STUDIO** to edit it.
3. Use **DEMO SONG** to return to the sample project at any time.

## Choose a color theme

- Click the **heart** in the top bar to cycle between **Balabolka Dark**, **Matt Blue + Gold**, **Default Black**, and **Yellow**.
- The selected color theme is remembered in this browser.
- The **SHADE ON/OFF** button in the top bar controls the cinematic shade in both Player and Studio. The shade darkens backgrounds behind lyrics for readability; turn it off for a brighter image.

## 2. Start a project

- Choose **NEW PROJECT** to begin with a blank project. This replaces the project currently open, so export anything you want to keep first.
- In **STUDIO → SETUP**, enter the title and artist, then add an audio file by dropping it into the **AUDIO** area or clicking the area to browse. SongStar reads the track duration from the audio file.
- Add the audio before splitting and distributing lyrics so the section timings use the correct song duration.
- To continue a project, use **Open films** in the top toolbar and select its exported SongStar JSON file. The **PLAYER** view can play the loaded project; **STUDIO** is where you edit it.

## 3. Add and organize lyrics

1. In **QUICK TOOLS**, paste lyrics into the large text box. Put a blank line between stanzas.
2. Choose **AUTO SPLIT** to make one section for each stanza. This replaces the current section list, so use it before adding section images or making detailed timing changes.
3. Choose **EVEN DISTRIBUTE** to space the current sections evenly across the song.
4. In the middle timeline, select a section and edit its **Lyric lines...** text area. Edit the section title in its label field.
5. Use **ADD** or **Add section at end** to create a section. Use **Split** to divide the selected section at the playhead.
6. Adjust a section's **End at** slider to change its end time. With **Auto-Chain** on, later sections move along to follow the adjusted section.
7. Reorder cards with the **↑/↓** controls or drag the **⋮⋮** handle. Use **Insert section after** at the bottom of a card to add a new card between it and the next one.

### Show lyrics one line at a time

Section lyrics can remain as a full stanza on screen. To create individually timed lines:

- Select the section you want in the timeline, then choose **SUB-SPLIT BLOCK** in Quick Tools or on the card to time its lines.
- The card's control changes to **UNSPLIT BLOCK** after splitting. Choose it to show the section's full lyric block together again. This choice remains in effect when you edit the lyrics.
- Choose **SUB-SPLIT ALL** to time the lines in every section that has lyrics.
- Sub-split assigns lines across each section's duration. The first line begins at the section start; following lines transition about 0.45 seconds early.
- After editing lyrics, check their timing again in the preview. If you add or remove lines in a section that has already been sub-split, SongStar recalculates those lines for the new line count.

## 4. Add backgrounds and choose how lyrics look

- In each timeline section, drop an image or video into its media area, or click the area to browse. Choose **Auto**, **Cover**, **Contain**, or **Stretch** and adjust the focal position with **Top**, **Center**, or **Bottom**.
- These media controls change how the active section appears in the Studio preview, Player, and exported HTML. **Cover** fills the screen and may crop; **Contain** shows the whole image or video; **Stretch** fills the screen but can distort the media; **Auto** chooses based on the media and screen shapes. Top/Center/Bottom sets the crop position.
- To use one background throughout the song, enable **Use single media for entire song** in **GLOBAL BACKGROUND** and add an image or video there. This overrides section backgrounds in the Player.
- Use **CINEMATIC SHADE** to switch the readability overlay on or off.
- In **PLAYER**, choose **Classic**, **Spotlight**, **Sing-along**, or **Full verse** from the **LYRICS** menu.
- When **Spotlight** is selected, use **BOLD ON/OFF** to adjust lyric weight. The exported HTML player includes the same toggle for viewers.

## 5. Preview and navigate

- Use the main playback controls in **PLAYER** to play, pause, or seek through the song.
- In **STUDIO**, use **LIVE PREVIEW** to check the selected section and edit timing. Its slider changes the preview's playback position.
- Scroll the Studio middle timeline independently to reach lower sections. If the Studio page is scrolled, a floating seek bar appears. Drag its **⋮⋮** grip up or down to reposition it; focus the grip and press the arrow keys to move it with the keyboard.
- The section pills along the bottom of the Player can be scrolled horizontally when they do not all fit. Select a pill to jump to that section.
- The timeline overview at the top of the middle pane can also be clicked or adjusted to navigate and fine-tune section boundaries.

## 6. Save, reopen, and export

- SongStar automatically saves the current project in this browser's offline storage. This is a working copy on this device and browser; it is not a backup file and does not automatically create a separate JSON file.
- For a separate copy, use **EXPORT JSON** or choose **Editable project · JSON** in the export preset and select **Export**. Keep the JSON file somewhere safe; open it later with **Open films**.
- To export a finished film, choose **Offline film · HTML** and select **Export**, or use **Export HTML** in the top toolbar. Open the resulting HTML file in a browser to play it.
- Exported JSON and HTML include each media file once; temporary preview URLs are not included in the exported project data.
- Choose **Captions · SRT** and select **Export**, or use **SRT**, to create subtitle captions.
- **Download Lyrics .txt** saves a text copy of the lyrics.
- Use **Choose save folder** if you want SongStar to write exports to a folder you select. If folder access is unavailable or not granted, the browser downloads the file instead. Check the browser's Downloads list if you cannot see it.

## Helpful reminders

- Export JSON before major edits; it is the portable, editable backup.
- A saved lyric edit is not the same as a new export. Export the HTML film again after changes you want included in the presentation.
- If an exported film looks old, open the newly exported HTML file rather than an earlier copy with the same title.
- The Batch Converter can prepare up to 50 pictures at 1920×1080. Use **×** on an image card to remove just that image; **Download** saves its converted copy.
- The Studio shows keyboard shortcuts for playback, seeking, undo, and adding a section near the bottom of the timeline.
- Playback now keeps each timed lyric with its own section after cards are moved or inserted, and timed lyric changes animate smoothly.

