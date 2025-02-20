---
title: Tools
---

This describes a lot of the tools I use in my [`dotfiles`](https://github.com/purarue/dotfiles)

This is an ever evolving list of tools and scripts I use and recommend, or combinations of tools I use to optimize my workflow.

Most of these are command line based, I wrap a lot of them in scripts [here](https://github.com/purarue/dotfiles/tree/master/.local/scripts) and in my [`pura-utils`](https://github.com/purarue/pura-utils) scripts repo

For other stuff I might be using, see [my github stars](https://github.com/purarue?direction=desc&sort=stars&tab=stars)

- Shells
  - [`zsh`](http://zsh.sourceforge.net/) - for the [`fish`](https://fishshell.com/)-like [highlighting and auto completion](https://github.com/marlonrichert/zsh-autocomplete). Manually configuring everything makes this much faster than the monstrous `oh-my-zsh`
  - bash/[`dash`](https://wiki.archlinux.org/index.php/Dash) - for shell scripting. My `zsh` setup is also much more dependent on external plugins, so I don't use that on servers, I just stick to bash there. My [`bootstrap`](https://github.com/purarue/bootstrap/) script sets up new bash servers for me nicely, see [this post](../../blog/server-setup/) for more info
- Terminal
  - [`wezterm`](https://wezfurlong.org/wezterm/index.html), which I've customized some:
    - a special [`cat`](https://github.com/purarue/dotfiles/blob/8457f501779f6eefccef14a9551c1eeafe0d629e/.config/zsh/progressive_enhancement.zsh#L72-L107) alias which lets me `cat` images and directories, while in the terminal

### OS-stuff

- [Arch](https://wiki.archlinux.org/index.php/)
  - Window Manager: `i3-gaps` - not amazing but covers all my usecases and have everything configured nicely. `qtile` had some graphical issues for bad GUI apps, and I don't feel like messing up my `haskell` installation for `xmonad`
  - [`i3lock`](https://i3wm.org/i3lock/) for screen lock; [daemon process](https://purarue.xyz/d/lock-screen?redirect) caches pixelated version of screen to speed up start time. [Corresponding service file](https://purarue.xyz/d/lockscreen@.service?redirect) to lock my screen whenever my laptop suspends
  - [`rofi`](https://github.com/davatorium/rofi) for launching applications and switching windows
  - [`dunst`](https://dunst-project.org/) for notifications, pretty normal configuration
  - [`autotiling`](https://github.com/nwg-piotr/autotiling) for automatic tiling
  - [`redshift`](http://jonls.dk/redshift/) to adjust color temperature
- Mac
  - I use [`skhd`](https://github.com/koekeishiya/skhd) as a hotkey daemon. My dotfiles are cross-platform, lots of scripts in [`cross-platform`](https://github.com/purarue/pura-utils#script-index) that handle switching on the OS to call out to platform-specific behavior (sending notifications, clipboard management, asking for user input)
- Android (using [termux](https://termux.dev/en/))

### Browsers

- [`firefox-developer-edition`](https://www.mozilla.org/en-US/firefox/developer/), with extensions:
  - [`vimium-ff`](https://addons.mozilla.org/en-US/firefox/addon/vimium-ff/). Learning vimium has virtually killed the mouse for me. Especially the `f` binding, which highlights all clickable items and lets me click something with a keybind. I now sit feet away from my laptop with mechanical keyboard in hand, reaching over only for horrible sites which don't comply to the HTML standard (looking at you, clicking the `next episode` button on `Netflix`)
  - [`RES`](https://addons.mozilla.org/en-US/firefox/addon/reddit-enhancement-suite/), to make reddit manageable, though I don't go to reddit much these days
  - [Violentmonkey](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/) so I can add bits of JS to sites I want to fix
  - [Refined Github](https://addons.mozilla.org/en-US/firefox/addon/refined-github-/) for general Github improvements
  - [Stylus](https://addons.mozilla.org/en-US/firefox/addon/styl-us/), so I can dark mode common websites
  - [Sponsorblock](https://sponsor.ajay.app/) to skip ads in youtube videos
  - [Dark Reader](https://addons.mozilla.org/en-US/firefox/addon/darkreader), so I can dark mode every website I visit. Does have considerable overhead, so I prefer finding CSS through stylus for websites I visit often
  - [uBlock Origin](https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/) to block ads
- I use [`lynx`](https://www.lynxproject.org/) to do quick `duckduckgo` searches [without leaving the terminal](https://purarue.xyz/d/duck?redirect)/display some HTML nicely in the terminal (e.g. in [rread](https://purarue.xyz/d/rread?dark))

### General Workflow/Tools

- Editor: nvim using [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) for completion, [configured here](https://github.com/purarue/dotfiles/tree/master/.config/nvim), mostly in lua
- Email [`neomutt`](https://github.com/neomutt/neomutt) for email, using [mutt-wizard](https://github.com/LukeSmithxyz/mutt-wizard) as a configuration layer to set it up
- RSS: [`newsraft`](https://codeberg.org/grisha/newsraft) for youtube/news/blogs. I have a [script](https://purarue.xyz/d/youtube-user-id?redirect) to grab a youtube users RSS feed, since youtube doesn't list that publicly. [`linkhandler`](https://purarue.xyz/d/linkhandler?redirect) lets me open youtube videos from `newsboat` using [`mpvf`](https://github.com/purarue/mpvf/) instead of visiting youtube in the browser
- Backups:
  - [SyncThing](https://github.com/syncthing/syncthing) to Sync important directories across all my computers, and to my NAS
  - [restic](https://restic.net/) to a local drive, to have separate, offline, snapshots, using a [small script](https://purarue.xyz/d/restic-backup?redirect) to help manage all of that
- Todo list: [`todotxt`](http://todotxt.org/) for todos, with a [rofi interface](https://purarue.xyz/d/todo-prompt?redirect) as GUI, and [TUI](https://github.com/purarue/full_todotxt) for adding todos. The TUI I wrote forces lets me enter a deadline using plain english and converts it to a datetime, so is nice for quick reminders. [todotxt-more](https://git.sr.ht/~proycon/todotxt-more) has some great addons as well
- Calendar: [`calcurse`](https://github.com/lfos/calcurse) as a calendar, with my [`calcurse-load`](https://github.com/purarue/calcurse-load) hooks to add Google Calendar and `todo.txt` to calcurse automatically
- File Manager: a heavily customized [`ranger`](https://github.com/ranger/ranger) . See [`rifle.conf`](https://purarue.xyz/d/rifle.conf?redirect) (file handler) and [`scope.sh`](https://purarue.xyz/d/scope.sh?redirect) (previewer)
- Task Scheduler: bash script ([`bgproc`](https://github.com/purarue/bgproc)) with an infinite loop which runs in the background instead of `cron` (uses my [`evry`](https://github.com/purarue/evry) tool to schedule tasks)

### Media

- `mpv` to listen/watch media in general, integrated with my file manager ([ranger](https://github.com/ranger/ranger))/playlist manager and just through a basic [`list-music`](https://github.com/purarue/pura-utils/blob/main/shellscripts/list-music)/[`play-music`](https://purarue.xyz/d/play-music?dark) script from the terminal
- Music:
  - [`beets`](https://github.com/beetbox/beets) to organize/tag my music; [config file](https://purarue.xyz/d/.config/beets/config.yaml?redirect)
  - my `bash` [terminal playlist manager](https://github.com/purarue/plaintext-playlist) using `fzf`/`mpv` to store playlists for local music in local text files
- Images/Video:
  - For basic image cropping, I use [`pinta`](https://www.pinta-project.com/) (should probably learn gimp but Ive never had the need).
  - For general image manipulation tasks I create lots of small [`imagemagick`](https://imagemagick.org/index.php) scripts to do random resizes/converts. I have a larger script to [convert videos to gifs](https://github.com/purarue/pura-utils/blob/main/shellscripts/gifme), and use [`gifsicle`](https://github.com/kohler/gifsicle) for manipulating gifs
  - Lots of small [`ffmpeg`](https://ffmpeg.org/) scripts to convert between video formats.
  - For trimming video, I use an [encode_webm](https://github.com/occivink/mpv-scripts/blob/master/script-opts/encode_webm.conf) keybinding in mpv

### Android Apps

- [termux](https://termux.dev/en/) - terminal
- [F-droid](https://f-droid.org/) to download applications not on the play store
- [Pano-Scobbler](https://play.google.com/store/apps/details?id=com.arn.scrobble&hl=en_US&gl=US&pli=1) to scrobble to last.fm/listenbrainz
- [gpslogger](https://gpslogger.app/) to save my location
- [syncthing](https://f-droid.org/packages/com.nutomic.syncthingandroid/) to sync music/data from my computer to my phone
- [activity watch](https://play.google.com/store/apps/details?id=net.activitywatch.android&hl=en_US&gl=US) - app usage tracker
- [keepass2android](https://play.google.com/store/apps/details?id=keepass2android.keepass2android&hl=en_US&gl=US) to use my password database on my phone (synced using syncthing)
- [sms backup & restore](https://play.google.com/store/apps/details?id=com.riteshsahu.SMSBackupRestore&hl=en_US) to save my call logs/sms messages

### CLI tools I use all the time

Mine:

- FileHosting: To host files publicly quickly, I just sync it up to my server and serve it with `nginx`, using my [`remsync`](https://github.com/purarue/vps/blob/master/bin/remsync) script. [`croc`](https://github.com/schollz/croc) is nice, but that assumes the other person has terminal literacy
- [password generator](https://github.com/purarue/genpasswd)
- [url shortener](https://github.com/purarue/no-db-shorturl/) with [this script](https://github.com/purarue/vps/blob/master/bin/shorten) to create new public URLs

Others:

- [`abook`](https://abook.sourceforge.io/) as an addressbook, because of its nice integration with neomutt
- [`datamash`](https://www.gnu.org/software/datamash/) to perform basic statistics on text files/STDIN
- [`dragon`](https://github.com/mwh/dragon), to be able to dragon and drop items from/to the terminal. Have my [`dragon-sink`](https://purarue.xyz/d/dragon-sink?redirect) script, which accepts and `cp`/`mv`'s files from applications, and bindings in `ranger` to drag files into my browser. Also use [`draglastpic`](https://purarue.xyz/d/draglastpic) very often, which lets me drag the latest screenshot to some application
- [`dust`](https://github.com/bootandy/dust); a fancy du clone
- [`entr`](https://eradman.com/entrproject/) for lots of small build scripts
- [`eza`](https://github.com/eza-community/eza) aliased to `ls`
- [`fd`](https://github.com/sharkdp/fd); a fancy find clone
- [`fzf`](https://github.com/junegunn/fzf) everywhere, to fuzzy match in shell pipelines
- [`glow`](https://github.com/charmbracelet/glow) to render markdown in the terminal
- [`hyperfine`](https://github.com/sharkdp/hyperfine) to do benchmarks
- [`pandoc`](https://pandoc.org/) to convert formats (lots of markdown -> html)
- [`pygmentize`](https://pygments.org/docs/cmdline/) to convert text to HTML - [`text2html`](https://purarue.xyz/d/text2html?redirect)
- [`jq`](https://stedolan.github.io/jq/) to process json streams
- [`oh-my-stars`](https://github.com/purarue/oh-my-stars) (my fork) to search github stars offline
- [`vipe`](https://linux.die.net/man/1/vipe), to quickly edit my clipboard in a vim buffer
- [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) to download video/audio from [tons of places](https://ytdl-org.github.io/youtube-dl/supportedsites.html). `yt-dlp` is a `youtube-dl` fork which downloads faster and has more features
- [`yadm`](https://github.com/TheLocehiliosan/yadm) to manage my dotfiles
- my `cat` is aliased to [`bat`](https://github.com/sharkdp/bat), a fancy cat clone which highlights text based on extension/mimetype

### Other CLI Tools I use less often

- [`boxes`](https://boxes.thomasjensen.com/) to print fancy boxes in the terminal
- [`codepsell`](https://github.com/codespell-project/codespell) to correct common misspellings in code files
- [`chafa`](https://github.com/hpjansson/chafa/) to print gifs in terminal
- [`dex`](https://github.com/jceb/dex) to open `.desktop` files
- [`dunk`](https://github.com/darrenburns/dunk), for nicer git diffs in the terminal
- [`figlet`](http://www.figlet.org/) to print large letters
- [`gron`](https://github.com/tomnomnom/gron) when I can't be bothered to use `jq`
- [`jpegtran`](http://jpegclub.org/jpegtran/) to compress JPEG files
- [`ldm`](https://github.com/LemonBoy/ldm), to do basic drive mounting for external drives/USBs
- [`linkcheck`](https://github.com/filiph/linkcheck) to check for broken links on websites
- [`lorem`](https://github.com/jamen/lorem) to create a bunch of lorem-ipsum
- [`ncdu`](https://dev.yorhel.nl/ncdu) to preview disk space interactively
- [`optipng`](http://optipng.sourceforge.net/) to compress PNG files
- [`pastel`](https://github.com/sharkdp/pastel) to generate/pick color schemes/hex codes from the terminal
- [`pup`](https://github.com/ericchiang/pup) to parse HTML on the command line
- [`qr`](https://purarue.xyz/d/qr?redirect) ([`qrencode`](https://fukuchi.org/works/qrencode/)), to create QR images from command line
- [`qrc`](https://github.com/fumiyas/qrc) to create QR codes in the terminal
- [`readability`](https://gitlab.com/gardenappl/readability-cli); cli tool for Mozilla's readability library, for parsing contents out of HTML
- [`screenkey`](https://gitlab.com/screenkey/screenkey) when recording demonstrations to display keys
- [`shellcheck`](https://github.com/koalaman/shellcheck) to check shell scripts for syntax errors
- [`speedtest-cli`](https://github.com/sivel/speedtest-cli) to test internet bandwidth
- [`sqleton`](https://github.com/inukshuk/sqleton) to visualize sqlite databases
- [`termdown`](https://github.com/trehn/termdown) to countdown in the terminal
- [`toilet`](https://github.com/cacalabs/toilet) is another implementation of figlet, gives fancy colors in the terminal
- [`up`](https://github.com/akavel/up) - to interactively explore/pipe text data. Especially useful when doing data wrangling, like when using tools like `jq`/`grep`/`cut` to extract some information from a data source
- [`moby`](https://github.com/words/moby) as a thesaurus
- [`ix`](https://github.com/purarue/pura-utils/blob/main/shellscripts/ix) to create pastebin links from the command line

### Other GUI Applications I use less often

- [`nsxiv`](https://github.com/nsxiv/nsxiv) as an image viewer for more complicated/macro-like tasks
- [`simplescreenrecorder`](https://github.com/MaartenBaert/ssr) to do simple screen recordings; I use this to make demonstration gifs
- [`sqlitebrowser`](https://sqlitebrowser.org/) to explore sqlite databases
