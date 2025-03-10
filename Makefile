SOURCE_FILES := $(shell find ./src ./public -type f ! -iname '*syncthing*')
PYTHON_FILES := scripts/exo-upload.py scripts/check_conflicting_dirs.py scripts/check_fields.py scripts/journal-public scripts/meam-add

##############
#            #
#  BUILDING  #
#            #
##############

./dist/sitemap-0.xml: .env package.json package-lock.json astro.config.mjs tsconfig.json $(SOURCE_FILES)
	npm run build
	uglifycss ./dist/global.css --output ./dist/global.css

# if the sitemap is newer than all the source files, site is considered 'built'
built: ./dist/sitemap-0.xml

build:
	npm run build
	uglifycss ./dist/global.css -o ./dist/global.css

# helper script
# just generate types for the one library javascript file I have
# needs to be JS since its used in astro.config.js
generate_types: built
	npx -p typescript tsc src/helpers/join.js --declaration --allowJs --emitDeclarationOnly --outDir src/helpers

#############
#           #
#  LINTING  #
#           #
#############

# https://github.com/codespell-project/codespell using a wrapper script of mine:
# https://github.com/purarue/dotfiles/blob/08c77680069ffd3313e02d4c99fa1f7b1f0c4169/.config/shortcuts.toml#L838-L850
spell:
	spell '.' './src/'

check:
	python3 ./scripts/check_conflicting_dirs.py ./src/content

frontmatter:
	python3 ./scripts/check_fields.py photos

mypy:
	find $(PYTHON_FILES) -exec mypy --install-types {} \;

flake8:
	find $(PYTHON_FILES) -exec flake8 {} +;

lint: check frontmatter spell mypy flake8

dev: stork
	cp ./dist/index.st ./public/index.st
	# wait 2 seconds, then open in browser
	setsid -f sh -c 'sleep 2 && xdg-open http://localhost:4321/x/'
	npm run dev


##################
#                #
#  SEARCH INDEX  #
#                #
##################

stork:
	stork build --input ./stork_input.toml --output ./dist/index.st

./dist/index.st: built ./stork_input.toml stork

built_and_stork: built ./dist/index.st

#######################
#                     #
#  SYNCING TO SERVER  #
#                     #
#######################

# For examples of use, check out the ./push script

LOCAL_NOTES_DIR := $(shell if [ -d "${XDG_DOCUMENTS_DIR}" ]; then realpath "$(XDG_DOCUMENTS_DIR)/Notes/exo/"; else echo ""; fi)

link_personal_notes:
	@ # sync from ~/Documents/Notes/exo/ to ./src/content/notes/personal
	rsync -Pavh --checksum --delete --link-dest="$(LOCAL_NOTES_DIR)/" "$(LOCAL_NOTES_DIR)/" ./src/content/notes/personal

# in case I made changes on my phone in my ~/Documents directory
# I can't link between the two directories because its a cross-device link
# TODO: might be able to use a symbolic link? Not sure how that would work with astros content collections
copy_personal_notes:
	rsync -Pavh --checksum "$(LOCAL_NOTES_DIR)/" ./src/content/notes/personal

# sync from the local directory to remote, so that if we're building on remote, we can build
# the latest notes. this is needed sometimes since I can't build on my phone
sync_personal_notes_to_server:
	rsync -Pavh --checksum ./src/content/notes/personal/ vultr:~/code/exobrain/src/content/notes/personal

sync_on_server: built
	# dont delete here, since search index/personal files/photography images are
	# synced from my machine, and not stored in the git repo
	rsync -Pahz --checksum ./dist/ ~/static_files/x

# typically done on my laptop
sync_to_server:
	rsync -Pahz --exclude=.stfolder --checksum -e ssh --delete ./dist/ vultr:~/static_files/x
	@ echo "Synced to server" | boxes

# done on the server
# since stork just seems to hang there, this just ignores that while deploying remotely
deploy: package.json built sync_on_server
	@ echo "Manual compile on server done"

clean:
	rm -rf ./dist
