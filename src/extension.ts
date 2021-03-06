// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { wrap } from 'module';
import { env } from 'process';
import * as vscode from 'vscode';


function addRole(role: string){
	const editor = vscode.window.activeTextEditor;
	if (editor && editor.selection){
		const document = editor.document;
		editor.edit(editBuilder => {
			editor.selections.forEach(sel => {
				var text = editor.document.getText(sel);
				const roleAddition = `[role="${role}"]\n`;
				text = roleAddition + text;
				editBuilder.replace(sel, text);
			});
		});
	}
}

function formatText(marker: string){
	const editor = vscode.window.activeTextEditor;
	if (editor && editor.selection){
		const document = editor.document;
		editor.edit(editBuilder => {
			editor.selections.forEach(sel => {
				var text = editor.document.getText(sel);
				var empty = false;
				if (text === '') {var empty = true;};
				// do the replacement
				if (text.substring(0,1) !== marker && text.substring(text.length, text.length +1) !== marker){
					text = `${marker}${text}${marker}`;
				} else {
					text = text.substring(1, text.length -1);
				}
				editBuilder.replace(sel, text);
				// if empty, move the cursor inbetween the markers
				if (empty === true){
					// have to do it twice b/c first is to clear selection
					vscode.commands.executeCommand("cursorMove",
						{
							"to": "right",
							"by": "character",
							"value": 1
						});
					vscode.commands.executeCommand("cursorMove",
						{
							"to": "left",
							"by": "character",
							"value": 1
						});
					};
			});
		});
	}
}

function forceFormatText(marker:string){
	const editor = vscode.window.activeTextEditor;
	if (editor && editor.selection){
		const document = editor.document;
		editor.edit(editBuilder => {
			editor.selections.forEach(sel => {
				var text = editor.document.getText(sel);
				let formatChars: RegExp = /\*|_|`|\+/g;
				text = text.replace(formatChars, marker);
				editBuilder.replace(sel, text);
			});
		vscode.window.showInformationMessage('Forced character replacement in selected text strings. Please check for any internal formatting that should have remained.');
		});
	}
}

function wrapWithClass(cls: string){
	const editor = vscode.window.activeTextEditor;
	if (editor && editor.selection){
		const document = editor.document;
		editor.edit(editBuilder => {
			editor.selections.forEach(sel => {
				var text = editor.document.getText(sel);
				text = `[.${cls}]#${text}#`;
				editBuilder.replace(sel, text);
			});
		});
	};
};

function addXrefPass(xrefstyle: string){
	const editor = vscode.window.activeTextEditor;
	if (editor && editor.selection){
		const document = editor.document;
		editor.edit(editBuilder => {
			editor.selections.forEach(sel => {
				const text = editor.document.getText(sel);
				if (text.charAt(0) === "<" && text.charAt(text.length -1 ) === ">"){
					const idlen = text.length - 4;
					const id = text.substr(2, idlen);
					const passthrough = `pass:[<a href="#${id}" data-type="xref" data-xrefstyle="${xrefstyle}">#${id}</a>]`;
					editBuilder.replace(sel, passthrough);
				} else {
					vscode.window.showInformationMessage("Error: Not a valid xref; please select only the '<<>>' delimited xref.");
				}
			});
		});
	}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, "asciidoc-writing-helpers" is now active!');

	// command to wrap text in italic
	let makeRoman = vscode.commands.registerCommand('asciidoc-writing-helpers.makeRoman', () => {
			forceFormatText('');
		}
	);
	context.subscriptions.push(makeRoman);

	// command to wrap text in italic
	let italicWrap = vscode.commands.registerCommand('asciidoc-writing-helpers.wrapItalic', () => {
			formatText('_');
		}
	);
	context.subscriptions.push(italicWrap);
	
	// command to force italic
	let forceItalic = vscode.commands.registerCommand('asciidoc-writing-helpers.forceWrapItalic', () => {
			forceFormatText('_');
		}
	);
	context.subscriptions.push(forceItalic);

	// command to wrap text in bold	
	let boldWrap = vscode.commands.registerCommand('asciidoc-writing-helpers.wrapBold', () => {
		formatText('*');
		}
	);
	context.subscriptions.push(boldWrap);	

	// command to force bold
	let forceBold = vscode.commands.registerCommand('asciidoc-writing-helpers.forceWrapBold', () => {
			forceFormatText('*');
		}
	);
	context.subscriptions.push(forceBold);

	// command to force code
	let forceCode = vscode.commands.registerCommand('asciidoc-writing-helpers.forceWrapCode', () => {
			forceFormatText('`');
		}
	);
	context.subscriptions.push(forceCode);

	// command to keep a string together
	let keepTogether = vscode.commands.registerCommand('asciidoc-writing-helpers.keepTogether', () => {
			wrapWithClass('keep-together');
		}
	);
	context.subscriptions.push(keepTogether);

	// command to add a pagebreak less_space role
	let pageBreakLessSpace = vscode.commands.registerCommand('asciidoc-writing-helpers.pageBreakLessSpace', () => {
			addRole('pagebreak-before less_space');
		}
	);
	context.subscriptions.push(pageBreakLessSpace);

	// command to add select:labelnumber xref passthrough
	let selectLabelNumber = vscode.commands.registerCommand('asciidoc-writing-helpers.selectLabelNumber', () => {
			addXrefPass('select:labelnumber');
		}
	);
	context.subscriptions.push(selectLabelNumber);

// command to add select:labelnumber xref passthrough
	let selectChapNumTitle = vscode.commands.registerCommand('asciidoc-writing-helpers.selectChapNumTitle', () => {
		addXrefPass('chap-num-title');
		}
	);
	context.subscriptions.push(selectChapNumTitle);	

	// command to add a pagebreak less_space role
	let writeOutISBN = vscode.commands.registerCommand('asciidoc-writing-helpers.writeOutISBN', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor && editor.selection){
			const document = editor.document;
			editor.edit(editBuilder => {
				editor.selections.forEach(sel => {
					var text = editor.document.getText(sel);
					if (/[0-9]{13}/.test(text)){
						// if it's not expanded, expand it
						const a = text.slice(0,3);
						const b = text.slice(3,4);
						const c = text.slice(4,7);
						const d = text.slice(7,12);
						const e = text.slice(12,13);
						const isbn = `${a}-${b}-${c}-${d}-${e}`;
						editBuilder.replace(sel, isbn);
					} else if (/[0-9]{3}\-[0-9]\-[0-9]{3}\-[0-9]{5}\-[0-9]/.test(text)) {
						// if it is, unexpand it
						text = text.replace(/\-/g, '');
						editBuilder.replace(sel, text);
					} else {
						vscode.window.showInformationMessage("Error: not an ISBN-13.");
					}
				});
			});
		}
	}
	);
	context.subscriptions.push(writeOutISBN);
	
	let pasteWrapLink = vscode.commands.registerCommand('asciidoc-writing-helpers.pasteWrapLink', () => {
		vscode.env.clipboard.readText().then((clipboard) => {
			const editor = vscode.window.activeTextEditor;
			if (editor && editor.selection){
				const document = editor.document;
				editor.edit(editBuilder => {
					editor.selections.forEach(sel => {
						var text = editor.document.getText(sel);
						if (/htt(p|ps):\/\/(.*?)/.test(clipboard)){
							text = `${clipboard}[${text}]`;
							editBuilder.replace(sel, text);
						} else {
							vscode.window.showInformationMessage("Error: You tried to paste-wrap something other than a link.");
						}
					});
				});
			}
		});
	});
	context.subscriptions.push(pasteWrapLink);

	let writeOutNumbers = vscode.commands.registerCommand('asciidoc-writing-helpers.writeOutNumbers', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor && editor.selection){
			const document = editor.document;
			editor.edit(editBuilder => {
				editor.selections.forEach(sel => {
					var text = editor.document.getText(sel);
					text = text.replace(/ 1 /g, ' one ');
					text = text.replace(/ 2 /g, ' two ');
					text = text.replace(/ 3 /g, ' three ');
					text = text.replace(/ 4 /g, ' four ');
					text = text.replace(/ 5 /g, ' five ');
					text = text.replace(/ 6 /g, ' six ');
					text = text.replace(/ 7 /g, ' seven ');
					text = text.replace(/ 8 /g, ' eight ');
					text = text.replace(/ 9 /g, ' nine ');
					text = text.replace(/ 10 /g, ' ten ');
					editBuilder.replace(sel, text);
					});
				});
			}
		}
	);
	context.subscriptions.push(writeOutNumbers);

	let codeblockPass = vscode.commands.registerCommand('asciidoc-writing-helpers.codeblockPass', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor && editor.selection){
			const document = editor.document;
			// some code
			function langCheck(selText: string){
				const select: string = selText;
				const reg = /\[source,(.*?)\]/g;
				const sourcematch = String(select.match(reg));
				if (sourcematch !== null){
					return sourcematch.slice(8,-1).trim();
				} else {
					return "";
				}
			} // end langCheck
			function convert(selText: string, language: string){
				const select = selText;
				const open = `++++
<pre data-type="programlisting" data-code-language="${language}">
				`;
				const close = `</pre>
++++`;
				const getCodeReg = /----+\n[\s\S]+----+/g;
				var code = String(select.match(getCodeReg)).slice(4,-4);
				// replace suspicious things
				const ampCheck = /&(?!amp;|#)/g;
				code = code.replace(ampCheck, '&amp;');
				// replace < chars
				const ltCheck = /<(?!lt)/g;
				code = code.replace(ltCheck, '&lt;');
				// replace > chars
				const gtCheck = />(?!lt)/g;
				code = code.replace(gtCheck, '&gt;');
				return open + code + close;
			}
			editor.edit(editBuilder => {
				editor.selections.forEach(sel => {
					const selText = editor.document.getText(sel);
					const language = langCheck(selText);
					editBuilder.replace(sel, convert(selText, language));
				});
			});
		}
	});
	context.subscriptions.push(codeblockPass);

	let ormHideURL = vscode.commands.registerCommand('asciidoc-writing-helpers.ormHideURL', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor && editor.selection){
			const document = editor.document;
			editor.edit(editBuilder => {
				editor.selections.forEach(sel => {
					const text = editor.document.getText(sel);
					const endURL = text.search(/\[/);
					const endAnchor = text.length - 1;
					const url = text.substring(0,endURL);
					var anchorText = text.substring(endURL + 1, endAnchor);
					if (anchorText.charAt(0) === "_" && 
						anchorText.charAt(anchorText.length - 1) === "_"){
							anchorText = "<em>" + anchorText.substring(1, anchorText.length - 1) + "</em>";
					} else if (text.search(/oreilly.com\/library\/view/) !== -1){
						anchorText = "<em>" + anchorText + "</em>";
					}
					const newLink = `pass:[<a href="${url}" class="orm:hideurl">${anchorText}</a>]`;
					editBuilder.replace(sel, newLink);
					});
				});
			}
		}
	);
	context.subscriptions.push(ormHideURL);

	let codePassLetterbreaks = vscode.commands.registerCommand('asciidoc-writing-helpers.codePassLetterbreaks', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor && editor.selection){
			const document = editor.document;
			editor.edit(editBuilder => {
				editor.selections.forEach(sel => {
					const text = editor.document.getText(sel);
					const regMatch = /(`|\+)/g; // fixed-width
					const joiner = ''; // note remove this since it causes odd breaks in the epub
					if (/`|\+/.test(text.charAt(0)) && 
						/`|\+/.test(text.charAt(text.length -1 ))){
							var splitText = text.substring(1, text.length - 1).split('');
							var brokenText = splitText.join(joiner);
							var brokenTextStr = `pass:[<code>${brokenText}</code>]`;
							editBuilder.replace(sel, brokenTextStr);
						} else {
							vscode.window.showInformationMessage("Error: Please select an inline code phrase to break.");
						}
					});
				});
			}
		}
	);
	context.subscriptions.push(codePassLetterbreaks);

}
// this method is called when your extension is deactivated
export function deactivate() {}
