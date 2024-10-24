---
title: How I watch Twitch
description: How I watch Twitch streams from the command line
pubDate: "Jun 13 2020"
---

Running the heavy [Twitch](https://twitch.tv) Web UI lags my computer considerably, so I prefer not to use it.

For interacting with chat, I use [chatterino](https://chatterino.com/), which handles that part completely.

For streaming video, the core of it all depends on [`youtube-dl`](https://github.com/ytdl-org/youtube-dl/), which handles grabbing the URLs to stream from. [`mpv`](https://mpv.io) has a good interop and can make calls out to `youtube-dl`. So the easiest way to do this - with no configuration - would be to install `mpv` and `youtube-dl`, and then run:

`mpv https://twitch.tv/<username>`

However, that gives you no control over the quality of the stream.

To get the format codes, you pass the `-F` flag to `youtube-dl`:

```
$ youtube-dl -F "https://twitch.tv/<username>"
[twitch:stream] boxbox: Downloading access token JSON
[twitch:stream] 38881685: Downloading stream JSON
[twitch:stream] 38881685: Downloading m3u8 information
[info] Available formats for 38640062448:
format code       extension  resolution note
audio_only        mp4        audio only  165k , mp4a.40.2
160p              mp4        284x160     230k , avc1.4D401F, 30.0fps, mp4a.40.2
360p              mp4        640x360     630k , avc1.4D401F, 30.0fps, mp4a.40.2
480p              mp4        852x480    1434k , avc1.4D401F, 30.0fps, mp4a.40.2
720p              mp4        1280x720   2379k , avc1.4D401F, 30.0fps, mp4a.40.2
720p60            mp4        1280x720   3429k , avc1.4D401F, 60.0fps, mp4a.40.2
1080p60__source_  mp4        1920x1080  6909k , avc1.64002A, 60.0fps, mp4a.40.2 (best)
```

The format code is the first column, so if you wanted to stream in `480p` to conserve bandwidth, you'd use `480p`, and pass that to `mpv` like:

```
mpv "https://twitch.tv/<username>" --ytdl-format="480p"
```

That's the basics. I have a couple wrapper scripts I use, so if you're interested in those, keep reading.

I do this so often - picking a format code and using mpv to stream something, that I wrote [`mpvf`](https://github.com/purarue/mpvf/). That takes a link, calls `youtube-dl -F` on it, prompts you to select one, and then streams that with `mpv`.

![example using fzf to prompt](https://raw.githubusercontent.com/purarue/mpvf/master/.github/demo.gif)

I further wrapped `mpvf` into a script called `twitch`, which:

- accepts the name of a twitch streamer as the first argument
- opens chatterino if its not already open
- prompts me to select a format and starts streaming in the background.

```
#!/bin/sh
# open chatterino and use mpv to stream from twitch
STREAMER="${1:?'Pass the twitch user to stream from as the first argument.'}"
export MPVF_PICKER=rofi
pgrep -x chatterino >/dev/null || chatterino &
setsid mpvf "https://www.twitch.tv/${STREAMER}" &
```

The `setsid` is to run `mpv` in a new session, to make sure that I don't have to leave the terminal which I ran `twitch <username>` from open, that can be closed once `mpv` starts running. Run `man setsid` for more info.

All of this streaming from command line is sort of useless if I still have to open the Twitch website to see if someone is online, so I wrote [twitchlive](https://github.com/purarue/twitchlive/) to be able to see which streamers I'm following are online. Its a bit annoying to set up due to how the twitch API is aimed towards web and not CLI applications, but it works well:

```
twitchlive -output-format=table
+---------------+--------+--------------+-------------------------------------+
|     USER      | UPTIME | VIEWER COUNT |            STREAM TITLE             |
+---------------+--------+--------------+-------------------------------------+
| nl_Kripp      | 05:27  |        14683 | Chill BG Night | Twitter            |
|               |        |              | @Kripparrian                        |
| sodapoppin    | 06:42  |        14003 | serkfgjhlbnlsebfoldtghnodilurngudrg |
| LilyPichu     | 04:01  |         7676 | hhiiiii                             |
| SirhcEz       | 01:44  |         1430 | SINGEEDDDDDD | SirhcEz cafe &       |
|               |        |              | chill | #LeaguePartner              |
+---------------+--------+--------------+-------------------------------------+
```

The two commands could even be combined like:

```
twitchlive -output-format json | jq -r '.[] | .username' | fzf | xargs twitch
```

... which uses `twitchlive` to get a list of currently live channels, prompting me to select one with `fzf`, and then passing that on to the `twitch` script to start watching them.
