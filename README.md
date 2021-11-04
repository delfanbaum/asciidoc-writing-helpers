# Asciidoc Writing Helpers

This extension provides a number of (hopefully useful) helper commands and keyboard shortcuts for writing, editing, and otherwise working with asciidoc text files.

## Features

Current features include:

* cmd/ctrl+(i/b) for toggling italic/bold markup on selected text

* cmd/ctrl+shift+l paste link around selected text (as `http://example.com[selected text]`)

* Format selected text as roman (remove formatting) (asciidoc)
** Formats selected text as roman

* ISBN dashes toggle (all languages)
    * Adds (in the right place) or removes dashes from isbn13s

* Write out numerals 1-9 (asciidoc)
    * Takes "George steals 1 cookie from each of the 3 jars" and makes it "George steals one cookie from each of the three jars"

* Add orm:hideurl link passthrough (asciidoc)
    * Takes an asciidoc link (https://example.com[Anchor text]) and adds the `orm:hideurl` class to it as a passthrough (pass:[<a href="https://example.com" class="orm:hideurl">Anchor text</a>])

* Add 'select:labelnumber' xref passthrough (asciidoc)
    * Take an asciidoc xref (e.g., <<chapter-99>>) and adds the `select:labelnumber` xref-datatype attribute (e.g., pass:[<a href="#chapter-99" data-type="xref" data-xrefstyle="select:labelnumber">#chapter-99</a>])

* Add 'chap-num-style' xref passthrough (asciidoc)
    * Take an asciidoc xref (e.g., <<chapter-99>>) and adds the `chap-num-style` xref-datatype attribute (e.g., pass:[<a href="#chapter-99" data-type="xref" data-xrefstyle="chap-num-title">#chapter-99</a>])

* Add letterbreaks and passthrough to inline code (asciidoc)
    * Takes a code snippet (e.g., `com.oreilly.examples.this.that`) and adds letterbreaks, so you can fine-tune where it breaks across a line (e.g., pass:[<code>c&#x2060;o&#x2060;m&#x2060;.&#x2060;o&#x2060;r&#x2060;e&#x2060;i&#x2060;l&#x2060;l&#x2060;y&#x2060;.&#x2060;e&#x2060;x&#x2060;a&#x2060;m&#x2060;p&#x2060;l&#x2060;e&#x2060;s&#x2060;.&#x2060;t&#x2060;h&#x2060;i&#x2060;s&#x2060;.&#x2060;t&#x2060;h&#x2060;a&#x2060;t</code>])

* Take a [source, <lang>] codeblock and rewrite as passthrough (asciidoc)
* Takes a `[source, lang]` codeblock and rewrites it as a fenced HTML passthrough.


## Known Issues

Some known issues include:

- No tests on code
- Documentation needs work

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial (internal) release!

<!--
## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

-----------------------------------------------------------------------------------------------------------
## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
-->