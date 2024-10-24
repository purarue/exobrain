---
title: Bash Notes
---

Useful resources:

- [bash hackers wiki](https://wiki.bash-hackers.org/start)
- [devhints](https://devhints.io/bash) for a quick reference on syntax

Use bash substitutions when possible instead of `sed`/`awk`.

#### temporary file

to create a (single) temporary file, removing it when the script exits:

```bash
tf="$(mktemp)"
trap 'rm -f "$tf"' EXIT

# do stuff ...
```

#### tty/scripting

Its useful to check the response of the `tty` command when doing interactive scripts. I use it for my [`launch`](https://sean.fish/d/cross-platform/launch?dark) script. If I run `launch htop`. If I'm already in a terminal, it just launches `htop`, but if its being run from a keybind/in the background, it opens a new terminal and runs that as an argument.

As an example, to prompt me to select something:

```bash
pick='fzf'
# if run from rofi/i3, use picker instead
if [[ "$(tty)" = "not a tty" ]]; then
    # https://github.com/purarue/pura-utils/blob/main/shellscripts/picker
	pick='picker'
fi

# run some command, use the picker chosen, and copy what I chose to my clipboard
something | "$pick" | clipcopy
```

If I'm running using a keybind in the background, that would use [`rofi`](https://github.com/davatorium/rofi) (`picker`), If I'm running from a terminal, it'd use [`fzf`](https://github.com/junegunn/fzf)

The `[[ "$(tty)" = "not a tty" ]]` is the important bit; that means this isn't being run from a terminal. If it is, the result is something like:

```bash
$ tty
/dev/pts/9
```

Note: may be some issues depending on how you've started your display server, see comments in my [`attached-to-terminal`](https://sean.fish/d/attached-to-terminal) script

#### Auto expanding variable contents:

```bash
# special syntax to expand \n to actual newline in string
name=$'First\nLast'
echo "$name" # receives one argument

# weird printf trickery
printf "%s" $name # auto expands to two arguments, only prints 'Sean'
printf "%s %s" $name # printf receives two arguments

# safest is to quote your variables
printf "%s" "$name"
```

---

#### Modifying IFS to read into arrays:

You can use `$'\n'` to expand an actual newline into the internal field separator, and then use a subshell to split lines into an array:

```bash
declare -a dircontents
IFS=$'\n' dircontents=($(ls -1))
for val in "${dircontents[@]}"; do
  echo "value: ${val}"
done
```

The default value for `IFS` is whitespace.

---

Maybe look into `perl` instead of `sed`/`awk`/`tr`/`cut`, look at `perlre` and `perlrun` man pages.

Startup time for running a script is much more than using an exported function or alias, but it also makes it less portable. Despite there being a huge difference, to the human eye its typically not noticeable.

Read the bash man page! Bashisms can be bad if you're trying to be POSIX compliant, but bashisms also save lots of time.

You may need to use POSIX complaint code for something like Solaris SVR4 packages which requires Bourne shell for any scripts.

#### Function return values

The last statement in a functions' return value is the return value of the function.

```
#!/bin/bash

setup() {
  ls kdsajfksajfda
}

if setup; then
  echo worked
else
  echo didn't work
fi
```

The above prints `didn't work`

#### Early Exit

Print message to STDERR if value is unset and exit:

```bash
# if $1 is unset/empty
USER_INPUT="${1:?must provide something as first argument}"
```

---

`2>/dev/null 1>&2` to completely silence a script, `echo something >&2` (or `1>&2`) to print an error.

---

#### Extensions

`.sh` at the end of scripts is only necessary if you're creating libraries, or if you're for some reason in windows land. Otherwise you're only making yourself do more typing. If you're making libraries, there is no shebang line and there shouldn't be - its meant to be `source`d into some other script. If its a library, it should have a `.sh` or `.bash` extension and the file shouldn't be executable.

---

Use short circuiting when doing simple tests, case statements for basic subcommands, and getopts if you want to have short and long (`-h`, `--help`) options for consistency/larger programs.

SUID/SGID are forbidden on shell scripts (running as owner as script instead of person executing the script). Too many security risks that come along with using that, use `sudo` if you need elevated access.

#### Styling/Formatting

Notes from [Google StyleGuide](https://google.github.io/styleguide/shellguide.html):

Don't need to use the `function` keyword, as its optional. Also, there aren't really functions, they're procedures/methods. No reason to break POSIX compliance and using `function`.

Using hyphens (or nothing) instead of underscores for variable/script names.

I tend to just use [`shfmt`](https://github.com/mvdan/sh) for everything.

HEREDOCs that have indentation need tabs, so it can make formatting confusing - so they need to left justified. You can use a dash to chomp tabs, but then it removes _all_ surrounded tabs.

One can use embedded newlines:

```bash
some_string="I am a string
with multiple lines"
```

Don't but `do` and `then` on their own line when using `for`/`if` loops:

```bash
for ....; do
  expression
done
if ....; then
  expression
done
```

Using semicolons makes the indent more obvious.

When doing _lots_ of parameter expansion when doing an echo, would make more sense to separate that into another variable, or use `printf`. Avoid stuff like:

```bash
echo "${1}0${2}0${3}"
```

Quoting:

- _Always quote your strings!_ Often better to 'over-quote' than to get an error with shell expansion.
- Never quote literal integers
- Use `"$@"` unless you have a specific reason to use `$*`, like splatting in the individual elements into a string: `"search?q=$*"`
- Single quotes doesn't do any shell substitution.
- Always do shell expansion

It may not be necessary, but always quote your command substitutions to be safe:

```bash
some_val="$(subshell command "$@")"
```

`readonly` is a synonym for `declare -r`, which makes a variable constant.

```bash
FLAGS=( --foo --bar='baz' )
readonly FLAGS
```

Don't need to quote variables in arithmetic subshells

```bash
if (( $# > 3 )); then
  echo "too many arguments"
fi
```

Don't need to quote literal integers, but you may want to single quote words:

```bash
exit_code=3
some_value='true'
```

Use `$(command)` instead of back ticks. Nested back ticks require escaping the inner ones. `$(command)` doesn't change and is easier to read:

```bash
# Do:
var="$(command "$(command)")"
# instead of:
var="`command \`command\``"
```

Use `[[ ... ]]` instead of `[ ... ]`, `test` and `/usr/bin/[` to avoid POSIX issues. `[[ ]]` is **built-in** to bash, doing `[` causes you to do a subshell out to the `[` command, and offers you the advantage that:

`[[ ... ]]` reduces errors as no pathname expansion or word splitting takes place. To exemplify what that means, you can do `[[ $VAR == test ]]`, without worrying about `$VAR` expanding to multiple words. You can still do `"$VAR"`, but its not required.

This also means when you're doing regex, you can splat a variable into a regex to test against a string:

```
[[ $filename =~ ^[[:alnum:]]+$pattern ]]
```

For regex:

```bash
# this matches
[[ "filename" == f* ]]
# this doesn't
[[ "filename" == "f*" ]]
```

Bash is smart enough to deal with empty strings in test. (`/usr/bin/[` is not!)

Use `-z` to empty strings, and `-n` to test if strings has value:

```bash
[[ -z "$1" ]] && echo "argument is empty"
[[ -n "$1" ]] && echo "argument has value: ${1}"
```

Using `(( ... ))` makes sure that the values are integers, don't have to use `$` and means you don't have to use `-gt` or `-lt` in `[[ .. ]]`:

```bash
if (( some_var > 3 )); then

fi
```

Use an explicit `./` path when doing wildcard expansion of filenames:

```bash
find . -name "./*.txt"
```

**Don't use `eval`**.

### Arrays

Arrays should be used for lists of items, to avoid complications with quoting.

Using a single string to multiple command arguments to another command should be avoided, as it leads to having to either doing an eval or parameter expansion.

```bash
# Do this:
declare -a flags
flags=(--foo --bar='baz')
flags+=(--greeting="Hello ${name}")
binary_command "${flags[@]}"
# Instead of:
flags='--foo --bar=baz'
flags+=' --greeting="Hello world"' # not trivial to do variable expansion
binary_command "${flags}"
```

`"${flags[@]}"` expands the array properly into its properly quoted arguments. To demonstrate:

`testarr`:

```bash
#!/bin/bash
declare -a arr
arr=('1' '2')
arr+=("something" 'something else')
python3 ./testarr.py "${arr[@]}"

```

`testarr.py`

```python
import sys
import pprint

pprint.pprint(sys.argv)
```

Output: `['./testarr.py', '1', '2', 'something', 'something else']`

Command expansions return single strings, not arrays. Avoid trying to capture subshell into array assignments since it won't work if the command contains special characters or whitespace. Better to read into a string and then use `readarray`

#### Piping to While

Use process substitution or `readarray` instead of directly piping into while. Pipes create subshells, so the block in the while loop doesn't have access to un-exported variables in the script, and can't change anything in the parent shell.

_Don't do this:_

```bash
my_variable='something'
command | while read -r line; do
  my_variable+="${line}\n"
done
echo "$my_variable"  # prints 'something', wasn't modified in loop
```

_Do this instead:_

```bash
my_variable='something'
while read -r line; do
  my_variable+="${line}\n"
done < <(command)
```

That leaves the while loop in the parent process, but still runs the command in a subshell.

You can also:

```bash
my_variable='something'
command_output="$(command)"
while read -r line; do
  my_variable+="${line}\n"
done <<<"$command_output"
```

... which sends the string into `STDIN`.

Another alternative with `readarray`:

```bash
my_variable='something'
readarray -t lines < <(command)
for line in "${lines[@]}"; do
  my_variable+="${line}\n"
done
```

---

Should be careful about using a for-loop to iterate over output using `for something in $(...)`, since the output is split by whitespace, not by line. This can be safe, if you're sure the subshell output can't contain whitespace, but `while` with `readarray` is often safer.

`<` and `>` in `[[ ... ]]` perform **lexicographic**, not numerical comparisons.

### Math subshells:

```bash
# do some simple arithmetic and print it
echo "$(( 2 + 2)) is 4"
# assign to variable
(( i = 10 * j + 400))
echo "$i"
```

In a math subshell, `0` is false and anything else is true. Can be treated as a boolean. As an example to check external commands:

```bash
COND=1
command -v "command_name" >/dev/null || COND=0
command -v "some_other_command" >/dev/null || COND=0
if ((COND)); then
	command_name "something"
	some_other_command "something"
else
	echo "you don't have command"
fi
```

`let` isn't `declare` or `local` - just avoid it.

Stylistic considerations aside, shell built-in arithmetic is way faster than a subshell out to `expr` - avoid it.

### Local/Declare

`local` and `declare` have the same flags. `declare` works a global level and `local` works in functions.

same thing:

```bash
readonly SOME_PATH='/some/path'
declare -r SOMEPATH='/some/path'
```

```bash
# makes constant and exports variable:
declare -rx SOMEPATH='/some/path'
```

Can set a variable to be readonly after checking opts:

```bash
VERBOSE='false'
while getopts 'v' flag; do
  case "${flag}" in
    v) VERBOSE='true' ;;
  esac
done
readonly VERBOSE
```

### Clobbering Exit Codes

You should separate the declaration of `declare` and `local` from its `RHS` value if that includes a call to a subshell which could fail. For example:

```bash
declare my_var="$(command)"
(( $? == 0 )) || return
```

will _always_ succeed, since the `declare` returns a 0 exit code.

Should instead do:

```bash
declare my_var
my_var="$(command)"
(( $? == 0))
```

When a script gets large enough, you may start separating parts into functions. That means that an `exit` that may have previously existed wouldn't exit the script, but instead the function. Those should be converted to `return` and then the main invocation to the function should be `||`'d or `(( $? == 0))`d against. This also leads itself well to exporting functions in `bash` for interactive use.

So, it makes more sense to create a `main` or top-level function that includes your entire script, like:

```bash
main() {
  [ -z "$1" ] && {
    echo "error" >&2
    return 1
  }
}

main "$@" || exit $?
```

For short scripts that just once from top to bottom, that's slight overkill, but once you're doing lots of `getopts`/`validation` or have a sufficient amount of functionality, it makes sense to do that.

### Checking Return Values

Instead of explicitly checking `$?` to check the error code, you can use an if statement, or just a `||` with curly brackets:

```bash
if ! mv "$something" "$somewhere"; then
  echo "Error, couldn't move ${something}"
  exit 1
fi

# or...
if ! some_error="$(mv "$something" "$somewhere")"; then
  echo "$some_error"
  exit 1
fi

# or...
mv "$something" "$somewhere" || {
  echo "Error, couldn't move ${something}"
  exit 1
}
```

Bash also has `PIPESTATUS` that lets you check the return code from every part of a pipe.

```bash
tar -cf - ./* | ( cd "${dir}" && tar -xf - )
if (( PIPESTATUS[0] != 0 || PIPESTATUS[1] != 0 )); then
  echo "Unable to tar files to ${dir}" >&2
fi
```

Another alternative if you're pipelining text is to use `xargs -r`, which doesn't run if the STDIN is empty, which is typically the case if a command failed:

```bash
some_command_that_might_print_nothing | xargs -r -I "{}" echo "{}"
```

Notes from: <https://www.youtube.com/watch?v=uqHjc7hlqd0>

For help: `type`, `help`, `apropos`, `man`, `info`

Return value of the last command executed is captured in the special parameter `$?`.

#### loops

`while list1; do list2; done`

Execute `list1`; if success, execute list2 and repeat. Continue until list1 returns a non-zero status (fails).

`for name in words; do list; done`

Can also use an arithmetic expression, with look like C-styled for loops:

`for (( expr1; expr2; expr3 )); do list; done`

`select name in words; do list; done`

Create a menu item for each word. Provide the user with an interactive interface to select one of them. Each time the user makes a selection from the menu, `name` is assigned the value of the selected word and `REPLY` is assigned the `index` number of the selection.

```bash
select result in Yes No Cancel Exit
    do
        if [ "$result" = "Exit" ]; then
        echo "$result"
        exit 0
        fi
        echo $result
    done
```

`[[ -t 0 ]]` can be used to check if `STDOUT` (file descriptor 0) refers to a terminal. It returns 0 if it is a terminal, and 1 if its being redirected input from some other command/file. This lets you choose to be interactive with the user, or assume some default value if its being called from a script.

### Command Groups

- Subshell: Evaluate list of commands in a subshell, has a distinct environment and does not affect the parent environment. `(list)`
- Group Command: Evaluate list of commands in the current shell, sharing the environment. `{ list; }` (spaces are trailing semicolon are obligatory)

Something I never really comprehended, this is still a subshell, its just not assigning to some variable, so you don't need to prepend the `$`

`(echo b; echo a) | sort`

The `$(list)` replaces the output of the `list` in-line with the output of its subshell. Referred to as _command substitution_.

`$$` is a special parameter that specifies your current PID.

### Parameters

Like `${param:-$HOME}`, `${param:=$HOME}` returns `$HOME` if `${param}` is empty or unset, but it _also_ sets `param` to `$HOME`, without you having to do the assignment explicitly.

Can think of these as:

Removal from left edge:

- `${param#pattern}`
- `${param##pattern}` ( greedy match )

```bash
[ ~ ] $ echo ${HOME}
/home/sean
[ ~ ] $ echo ${HOME#*/}
home/sean
[ ~ ] $ echo ${HOME##*/}
sean
```

Reminder that `*` is the typical posix globbing, its matching zero or more of any character (`.*` in PCRE terms)

Removal from right edge

- `${param%pattern}`
- `${param%%pattern}`

Can search the env for names matching something (this parameter expansion doesn't work in `zsh`):

```bash
$ echo "${!XDG_@}"
XDG_CACHE_HOME XDG_CONFIG_HOME XDG_CURRENT_DESKTOP XDG_DATA_HOME XDG_GREETER_DATA_DIR XDG_RUNTIME_DIR XDG_SEAT XDG_SEAT_PATH XDG_SESSION_CLASS XDG_SESSION_DESKTOP XDG_SESSION_ID XDG_SESSION_PATH XDG_SESSION_TYPE XDG_VTNR
```

### brace expansion

```bash
$ echo ba{t,r}
bat bar
```

Can also use this to generate a cartesian product of any dimension:

```bash
$ echo {1..5}{0,5}%
10% 15% 20% 25% 30% 35% 40% 45% 50% 55%
$ echo {10..55..5}%  # can also use a iterator to count by 5
10% 15% 20% 25% 30% 35% 40% 45% 50% 55%
```

Functions receive input from STDIN, and send to STDOUT. The `{ }` is not required, its a Group Command, which often just makes things easier to read. For example:

```bash
words ()
for word
do
  echo "$word"
  echo "$word" >&2
done 2>/dev/null
```

works fine, since the command there is the `for`.

A function definition is just a statement, so the `2>/dev/null` means that when the function is called, all of the functions STDERR is ignored.

```bash
$ words one two
one
two
```

## Session Portability

Import elements from a current session directly into a new local or remote session.

```bash
sudo bash -c "
$(declare -p parameters;
declare -f functions)
code and stuff"
```

... imports parameters and functions into the root shell, and then run `code and stuff`

similarly, could use this with `ssh`:

```bash
ssh remote@host "
$(declare -f functionname)
functionname arguments"
```

References:

- <https://google.github.io/styleguide/shellguide.html>
- bash man page
