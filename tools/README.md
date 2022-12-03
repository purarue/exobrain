---
Title: Tools, or how I do everything
---

This is an extension of my [`dotfiles`](https://github.com/seanbreckenridge/dotfiles)

This is an ever evolving list of tools and scripts I use and recommend, or combinations of tools I use to optimize my workflow.

Most of these are command line based, I wrap a lot of them in scripts [here](https://github.com/seanbreckenridge/dotfiles/tree/master/.local/scripts)

For more, see [my github stars](https://github.com/seanbreckenridge?direction=desc&sort=stars&tab=stars)

- Shells
  - [`zsh`](http://zsh.sourceforge.net/) - for the [`fish`](https://fishshell.com/)-like [highlighting and auto completion](https://github.com/marlonrichert/zsh-autocomplete), while still being _somewhat_ posix compliant. Manually configuring everything makes this much faster than the monstrous `oh-my-zsh`
  - bash/[`dash`](https://wiki.archlinux.org/index.php/Dash) - for shell scripting. My `zsh` setup is also much more dependent on external plugins, so I don't use that on servers, I just stick to bash there. My [`bootstrap`](https://github.com/seanbreckenridge/bootstrap/) script sets up new bash servers for me nicely, see [this post](/post/server_setup) for more info
- Terminal
  - [`kitty`](https://github.com/kovidgoyal/kitty), which I've customized some
    - a special [`cat`](https://github.com/seanbreckenridge/dotfiles/blob/8457f501779f6eefccef14a9551c1eeafe0d629e/.config/zsh/progressive_enhancement.zsh#L72-L107) alias which lets me `cat` images and directories, while in the terminal
- OS-stuff
  - [Arch](https://wiki.archlinux.org/index.php/)
    - Window Manager: `i3-gaps` - not amazing but covers all my usecases and have everything configured nicely. `qtile` had some graphical issues for bad GUI apps, and I don't feel like messing up my `haskell` installation for `xmonad`
    - [`i3lock`](https://i3wm.org/i3lock/) for screen lock; [daemon process](https://sean.fish/d/lock-screen?redirect) caches pixelated version of screen to speed up start time. [Corresponding service file](https://sean.fish/d/lockscreen@.service?redirect) to lock my screen whenever my laptop suspends
    - [`rofi`](https://github.com/davatorium/rofi) for launching applications and switching windows
    - [`dunst`](https://dunst-project.org/) for notifications, pretty normal configuration
    - [`autotiling`](https://github.com/nwg-piotr/autotiling) for automatic tiling
    - [`redshift`](http://jonls.dk/redshift/) to adjust color temperature
  - Mac
    - I use [`skhd`](https://github.com/koekeishiya/skhd) as a hotkey daemon. My dotfiles are cross-platform, lots of scripts in [`cross-platform`](https://github.com/seanbreckenridge/dotfiles/tree/master/.local/scripts/cross-platform) that handle switching on the OS to call out to platform-specific behavior (sending notifications, clipboard management, asking for user input)
  - Android (using [termux](https://termux.dev/en/))
- Editors
  - nvim using [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) for completion, [configured here](https://github.com/seanbreckenridge/dotfiles/tree/master/.config/nvim), mostly in lua
- Browsers
  - [`firefox-developer-edition`](https://www.mozilla.org/en-US/firefox/developer/), with extensions:
    - [`vimium-ff`](https://addons.mozilla.org/en-US/firefox/addon/vimium-ff/). Learning vimium has virtually killed the mouse for me. Especially the `f` binding, which highlights all clickable items and lets me click something with a keybind. I now sit feet away from my laptop with mechanical keyboard in hand, reaching over only for horrible sites which don't comply to the HTML standard (looking at you, clicking the `next episode` button on `Netflix`)
    - [`RES`](https://addons.mozilla.org/en-US/firefox/addon/reddit-enhancement-suite/), to make reddit manageable, though I don't go to reddit much these days
    - [Violentmonkey](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/) so I can add bits of JS to sites I want to fix
    - [Refined Github](https://addons.mozilla.org/en-US/firefox/addon/refined-github-/) for general Github improvements
    - [Stylus](https://addons.mozilla.org/en-US/firefox/addon/styl-us/), so I can dark mode common websites
    - [Sponsorblock](https://sponsor.ajay.app/) to skip ads in youtube videos
    - [Dark Reader](https://addons.mozilla.org/en-US/firefox/addon/darkreader), so I can dark mode every website I visit. Does have considerable overhead, so I prefer finding CSS through stylus for websites I visit often
    - [uBlock Origin](https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/) to block ads
  - I use [`lynx`](https://www.lynxproject.org/) to do quick `duckduckgo` searches [without leaving the terminal](https://sean.fish/d/duck?redirect)
- General Workflow/Tools
  - [`neomutt`](https://github.com/neomutt/neomutt) for email, using [mutt-wizard](https://github.com/LukeSmithxyz/mutt-wizard) as a configuration layer to set it up
  - I use [`newsboat`](https://newsboat.org/) RSS for youtube/news/blogs. I have a [script](https://sean.fish/d/youtube-user-id?redirect) to grab a youtube users RSS feed, since youtube doesn't list that publicly. [`linkhandler`](https://sean.fish/d/linkhandler?redirect) lets me open youtube videos from `newsboat` using [`mpvf`](https://github.com/seanbreckenridge/mpvf/) instead of visiting youtube in the browser
  - For system backups, I use [SyncThing](https://github.com/syncthing/syncthing) to Sync important directories across all my computers, and to my NAS
  - to-do list - [`todotxt`](http://todotxt.org/) for todos, with a [rofi interface](https://sean.fish/d/todo-prompt?redirect) as GUI, and [TUI](https://github.com/seanbreckenridge/full_todotxt) for adding todos. The TUI I wrote forces me to specify a `deadline` for each todo, which I then get notified by [this](https://github.com/seanbreckenridge/todotxt_deadline_notify), which runs on my server
  - [`calcurse`](https://github.com/lfos/calcurse) as a calendar, with my [`calcurse-load`](https://github.com/seanbreckenridge/calcurse-load) hooks to add Google Calendar and `todo.txt` to calcurse automatically
  - a heavily customized [`ranger`](https://github.com/ranger/ranger) as my file manager. See [`rifle.conf`](https://sean.fish/d/rifle.conf?redirect) (file handler) and [`scope.sh`](https://sean.fish/d/scope.sh?redirect) (previewer)
  - [`yadm`](https://yadm.io) to manage dotfiles. Once I have a terminal running, my [`bootstrap`](https://sean.fish/d/bootstrap?redirect) script sets up my system entirely
  - For basic image cropping, I use [`pinta`](https://www.pinta-project.com/). For general image manipulation tasks I create lots of small [`imagemagick`](https://imagemagick.org/index.php) scripts to do random resizes/converts. I have a larger script to [convert videos to gifs](https://github.com/seanbreckenridge/core/blob/main/shellscripts/gifme), and use [`gifsicle`](https://github.com/kohler/gifsicle) for manipulating gifs
  - Lots of small [`ffmpeg`](https://ffmpeg.org/) scripts to convert between video formats. For trimming video, I use an [edited version](https://sean.fish/d/slicing.lua?redirect) of [this](https://github.com/Kagami/mpv_slicing) mpv plugin
  - Use the `dict://` protocol with `curl` at `dict.org` as a dictionary with [this](https://sean.fish/d/dict?redirect). [`moby`](https://github.com/words/moby) as a thesaurus
  - On top of all the [git aliases](https://sean.fish/d/git_aliases?redirect), one of my scripts I use most commonly are my [`giturl`](https://sean.fish/d/giturl?redirect)/[`gitopen`](https://sean.fish/d/gitopen?redirect) scripts, which will open the current git directory I'm in in my browser
  - [`ix`](https://github.com/seanbreckenridge/core/blob/main/shellscripts/ix) to create pastebin links from the command line
  - To host files publicly and mirror video/audio, I use my [`remsync`](https://github.com/seanbreckenridge/vps/blob/master/remsync) and [`mediaproxy`](https://github.com/seanbreckenridge/vps/blob/master/mediaproxy) scripts. [`croc`](https://github.com/schollz/croc) is nice, but that assumes the other person has terminal literacy
  - the [`mvlast`](https://sean.fish/d/mvlast?redirect)/[`mvlastpic`](https://sean.fish/d/mvlastpic?redirect)/[`lastdown`](https://sean.fish/d/lastdown?redirect) collection of scripts, which lets me quickly move items from my Downloads/Screenshots to my current folder. Was taken from an <https://rwx.gg> stream; very basic but incredibly useful
  - `curl "https://cheat.sh/$*"`, to access quick cheatsheets for unix tools
  - [my own password generator](https://github.com/seanbreckenridge/genpasswd)
  - A bash script ([`bgproc`](https://github.com/seanbreckenridge/bgproc)) with an infinite loop which runs in the background instead of `cron` (uses my [`evry`](https://github.com/seanbreckenridge/evry) tool to schedule tasks)
  - my `bash` [terminal playlist manager](https://github.com/seanbreckenridge/plaintext-playlist) using `fzf`/`mpv` to store playlists for local music in local text files
  - my own [url shortener](https://github.com/seanbreckenridge/no-db-static-shorturl/) with [this script](https://github.com/seanbreckenridge/vps/blob/master/shorten)
  - `mpv`/`chatterino` to watch twitch, see [here](/post/how_i/watch_twitch/)

### Android Apps

- [termux](https://termux.dev/en/) - terminal
- [F-droid](https://f-droid.org/) to download applications not on the play store
- [Pano-Scobbler](https://play.google.com/store/apps/details?id=com.arn.scrobble&hl=en_US&gl=US&pli=1) to scrobble to last.fm/listenbrainz
- [gpslogger](https://gpslogger.app/) to save my location
- [syncthing](https://f-droid.org/packages/com.nutomic.syncthingandroid/) to sync music/data from my computer to my phone
- [keepass2android](https://play.google.com/store/apps/details?id=keepass2android.keepass2android&hl=en_US&gl=US) to use my password database on my phone (synced using syncthing)
- [sms backup & restore](https://play.google.com/store/apps/details?id=com.riteshsahu.SMSBackupRestore&hl=en_US) to save my call logs/sms messages

### CLI tools I use all the time

- [`datamash`](https://www.gnu.org/software/datamash/) to perform basic statistics on text files/STDIN
- [`dragon`](https://github.com/mwh/dragon), to be able to dragon and drop items from/to the terminal. Have my [`dragon-sink`](https://sean.fish/d/dragon-sink?redirect) script, which accepts and `cp`/`mv`'s files from applications, and bindings in `ranger` to drag files into my browser. Also use [`draglastpic`](https://sean.fish/d/draglastpic) very often, which lets me drag the latest screenshot to some application
- [`dust`](https://github.com/bootandy/dust); a fancy du clone
- [`entr`](https://eradman.com/entrproject/) for lots of small build scripts
- [`exa`](https://github.com/ogham/exa) aliased to `ls`
- [`fd`](https://github.com/sharkdp/fd); a fancy find clone
- [`fzf`](https://github.com/junegunn/fzf) everywhere, to fuzzy match in shell pipelines
- [`glow`](https://github.com/charmbracelet/glow) to render markdown in the terminal
- [`hyperfine`](https://github.com/sharkdp/hyperfine) to do benchmarks
- [`imgur-uploader`](https://pypi.org/project/imgur-uploader/) to quickly upload images online, with a [script](https://sean.fish/d/screenshot-to-imgur?redirect) to upload my most recent screenshot to imgur
- [`jq`](https://stedolan.github.io/jq/) to process json streams
- [`oh-my-stars`](https://github.com/seanbreckenridge/oh-my-stars) (my fork) to search github stars offline
- [`vipe`](https://linux.die.net/man/1/vipe), to quickly edit my clipboard in a vim buffer
- [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) to download video/audio from [tons of places](https://ytdl-org.github.io/youtube-dl/supportedsites.html). `yt-dlp` is a fork which downloads faster and has more features
- my `cat` is aliased to [`bat`](https://github.com/sharkdp/bat), a fancy cat clone which highlights text based on extension/mimetype

### Other CLI Tools I use less often

- [`boxes`](https://boxes.thomasjensen.com/) to print fancy boxes in the terminal
- [`chafa`](https://github.com/hpjansson/chafa/) to print gifs in terminal
- [`dex`](https://github.com/jceb/dex) to open `.desktop` files
- [`dunk`](https://github.com/darrenburns/dunk), for nicer git diffs in the terminal
- [`figlet`](http://www.figlet.org/) to print large letters
- [`gron`](https://github.com/tomnomnom/gron) when I cant be bothered to use `jq`
- [`imgur-uploader`](https://pypi.org/project/imgur-uploader/) to push images to imgur
- [`jpegtran`](http://jpegclub.org/jpegtran/) to compress JPEG files
- [`ldm`](https://github.com/LemonBoy/ldm), to do basic drive mounting for external drives/USBs
- [`linkcheck`](https://github.com/filiph/linkcheck) to check for broken links on websites
- [`lorem`](https://github.com/jamen/lorem) to create a bunch of lorem-ipsum
- [`misspell`](https://github.com/client9/misspell) corrects commonly misspelled words; my [`misspell-context`](https://sean.fish/d/misspell-context?redirect) script to give mistakes in context
- [`ncdu`](https://dev.yorhel.nl/ncdu) to preview disk space interactively
- [`nsxiv`](https://github.com/nsxiv/nsxiv) as an image viewer for more complicated/macro-like tasks
- [`optipng`](http://optipng.sourceforge.net/) to compress PNG files
- [`pastel`](https://github.com/sharkdp/pastel) to generate/pick color schemes/hex codes from the terminal
- [`pup`](https://github.com/ericchiang/pup) to parse HTML on the command line
- [`qr`](https://sean.fish/d/qr?redirect) ([`qrencode`](https://fukuchi.org/works/qrencode/)), to create QR images from command line
- [`qrc`](https://github.com/fumiyas/qrc) to create QR codes in the terminal
- [`readability`](https://gitlab.com/gardenappl/readability-cli); cli tool for Mozilla's readability library, for parsing contents out of HTML
- [`screenkey`](https://gitlab.com/screenkey/screenkey) when recording demonstrations to display keys
- [`shellcheck`](https://github.com/koalaman/shellcheck) to check shell scripts for syntax errors
- [`speedtest-cli`](https://github.com/sivel/speedtest-cli) to test internet bandwidth
- [`sqleton`](https://github.com/inukshuk/sqleton) to visualize sqlite databases
- [`termdown`](https://github.com/trehn/termdown) to countdown in the terminal
- [`toilet`](https://github.com/cacalabs/toilet) is another implementation of figlet, gives fancy colors in the terminal
- [`up`](https://github.com/akavel/up) - to interactively explore/pipe text data. Especially useful when doing data wrangling, like when using tools like `jq`/`grep`/`cut` to extract some information from a data source
- [`whiptail`](https://en.wikibooks.org/wiki/Bash_Shell_Scripting/Whiptail) (libnewt) for fancy dialog prompts in scripts
- [`wuzz`](https://github.com/asciimoo/wuzz), a postman-like CLI application

### Other GUI Applications I use less often

- [`simplescreenrecorder`](https://github.com/MaartenBaert/ssr) to do simple screen recordings; I use this to make demonstration gifs
- [`sqlitebrowser`](https://sqlitebrowser.org/) to explore sqlite databases
