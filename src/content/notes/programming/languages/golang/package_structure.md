---
title: Structuring Projects
---

### Starting projects:

Run:

`go mod init github.com/purarue/project_name`

when in `$GOPATH/src/github.com/purarue/project_name`

.. to initialize your project properly.

There is no canonical specification for where you put your files/packages.

If:

- ... you're making a command, you want a `main.go` in the same directory, using `package main` and `func main`. With the `go mod` file, `go build` builds the proper binary. You can split the `main` package across multiple files without messing with import paths, everything acts as a global within the package across multiple files. Can also just do `go install` to run `go build` and install it into your `$GOBIN`
- ... you're making a library, which would be importable through the path above specified in the `go mod` command. There's no requirement to do so, but you typically create a file with the same name as the package (e.g. `package_name.go`), at the root directory. A `lib`/`src` folder is often used, but its not required. You should think a lot about how your package is structured, because people will _directly_ reference the path of the package structure.

Making functions start with uppercase automatically exports the function from the package.

To do both a command and a library, you typically have a `cmd/package_name/main.go` file, which can then be installed from:

`go get github.com/purarue/project_name/cmd/command_name`

.. and installed locally like:

```
go install ./cmd/command_name
```

### Basic Testing

For basic tests, 9 times out of 10, you want to make the package name for the test file `packagename_test`, and call it `packagename_test.go`.

You can use the `testing` library like:

```
func TestFunctionName(t* testing.T) {
  packagename.FunctionName()
}
```

.. and then run `go test`
