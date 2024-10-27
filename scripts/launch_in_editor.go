package main

// server which listens for requests from the corresponding launch_in_editor.js
// and launches the editor with the given file in nvim
//
// this runs in the background on my machine on port 12593
// and uses my 'launch' script to open the file in nvim
// https://purarue.xyz/d/.local/scripts/cross-platform/launch?redirect

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

type ServerConfig struct {
	launchScript string
	port         int
	baseDir      string
	editor       string
}

func ParseServerConfig() ServerConfig {
	launchScript := flag.String("launch", "", "path to the launch script")
	port := flag.Int("port", 12593, "port to listen on")
	baseDir := flag.String("dir", "", "base directory to launch from")
	editor := flag.String("editor", "", "editor to use")
	flag.Parse()
	if *launchScript == "" {
		// try to find 'launch' in the PATH
		lScript, err := exec.LookPath("launch")
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %s\n", err)
			os.Exit(1)
		}
		if lScript == "" {
			fmt.Fprintln(os.Stderr, "Error: no launch script found")
			os.Exit(1)
		}
		*launchScript = lScript
	}
	if *baseDir == "" {
		fmt.Fprintln(os.Stderr, "No base directory specified, this should be the location of src/content")
		os.Exit(1)
	}

	baseDirAbs, err := filepath.Abs(*baseDir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %s\n", err)
		os.Exit(1)
	}

	// check if baseDirAbs exists
	if _, err := os.Stat(baseDirAbs); os.IsNotExist(err) {
		fmt.Fprintf(os.Stderr, "Error: '%s' base directory does not exist\n", baseDirAbs)
		os.Exit(1)
	}

	// check $EDITOR and $VISUAL if no editor is specified
	if *editor == "" {
		for _, env := range []string{"EDITOR", "VISUAL"} {
			*editor = os.Getenv(env)
			if *editor != "" {
				break
			}
		}
	}

	if *editor == "" {
		fmt.Fprintln(os.Stderr, "No editor specified and $EDITOR and $VISUAL are not set")
		os.Exit(1)
	}

	return ServerConfig{*launchScript, *port, baseDirAbs, *editor}
}

var possibleExts = [...]string{"md", "mdx", "astro", "html", "ts"}

func (config *ServerConfig) LaunchServer(w http.ResponseWriter, r *http.Request) {
	log.Printf("URL: %s\n", r.URL)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	// get the file from the request
	file := r.URL.Query().Get("file")
	if file == "" {
		http.Error(w, "No file specified", http.StatusBadRequest)
		return
	}

	absFile, err := filepath.Abs(filepath.Join(config.baseDir, file))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// check if the file is in the base directory
	if !strings.HasPrefix(absFile, config.baseDir) {
		http.Error(w, fmt.Sprintf("File '%s' is not in the base directory '%s'", file, config.baseDir), http.StatusBadRequest)
		return
	}

	log.Printf("Allowed prefix: %s\n", absFile)

	// try to find the file with a supported extension
	found := false
	for _, ext := range possibleExts {
		possibleTarget := absFile + "." + ext
		log.Printf("Testing %s", possibleTarget)
		if _, err := os.Stat(possibleTarget); err == nil {
			absFile = possibleTarget
			found = true
			break
		}
	}

	if !found {
		http.Error(w, "No supported file found", http.StatusBadRequest)
		return
	}

	// launch the file in nvim
	cmd := []string{config.launchScript, fmt.Sprintf("%s '%s'", config.editor, absFile)}
	fmt.Printf("Running %s\n", cmd)
	err = exec.Command(cmd[0], cmd[1:]...).Start()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Launched %s in %s", file, config.editor)
}

func main() {
	config := ParseServerConfig()
	http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		fmt.Fprintln(w, "pong")
	})
	http.HandleFunc("/launch", config.LaunchServer)
	fmt.Printf("Listening on port %d with launch script '%s', base directory '%s', and editor '%s'\n", config.port, config.launchScript, config.baseDir, config.editor)
	err := http.ListenAndServe(fmt.Sprintf(":%d", config.port), nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
