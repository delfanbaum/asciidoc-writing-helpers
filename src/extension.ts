// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { wrap } from 'module';
import { env } from 'process';
import * as vscode from 'vscode';

function formatText(marker: string){
	const editor = vscode.window.activeTextEditor;
	if (editor && editor.selection){
		const document = editor.document;
		editor.edit(editBuilder => {
			editor.selections.forEach(sel => {
				var text = editor.document.getText(sel);
				if (text.substring(0,1) !== marker && text.substring(text.length, text.length +1) !== marker){
					text = `${marker}${text}${marker}`;
				} else {
					text = text.substring(1, text.length -1);
				}
				editBuilder.replace(sel, text);
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

	// command to force code
	let keepTogether = vscode.commands.registerCommand('asciidoc-writing-helpers.keepTogether', () => {
			wrapWithClass('keep-together');
		}
	);
	context.subscriptions.push(keepTogether);
	
	let pasteWrapLink = vscode.commands.registerCommand('asciidoc-writing-helpers.pasteWrapLink', () => {
		vscode.env.clipboard.readText().then((clipboard) => {
			const editor = vscode.window.activeTextEditor;
			if (editor && editor.selection){
				const document = editor.document;
				editor.edit(editBuilder => {
					editor.selections.forEach(sel => {
						var text = editor.document.getText(sel);
						text = `${clipboard}[${text}]`;
						editBuilder.replace(sel, text);
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
}
// this method is called when your extension is deactivated
export function deactivate() {}
