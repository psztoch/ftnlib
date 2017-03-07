// fountain-js 0.1.10
// http://www.opensource.org/licenses/mit-license.php
// Copyright (c) 2012 Matt Daly

;
(function() {
	'use strict';

	var regex = { // title_page :
		// /^((?:title|credit|author[s]?|source|notes|draft
		// date|date|contact|copyright)\:)/gim,
		title_page : /^((?:title|credit|author[s]?|source|notes|draft date|date|contact|copyright|lang|language|acronym|series|locked)\:)/gim,

		scene_prefix : '(INT.[^\\/]|EXT.[^\\/]|INT.\\/EXT.|EXT.\\/INT.|PL.[^\\/]|WN.[^\\/]|WN.\\/PL.|PL.\\/WN.)',
//		scene_prefix : '(INT\.[^\\/]|EXT\.[^\\/]|INT\.\\/EXT\.|EXT\.\\/INT\.|PL\.[^\\/]|WN\.[^\\/]|WN\.\\/PL\.|PL\.\\/WN\.)',
		scene_heading : /^((?:\*{0,3}_?)?(?:(?:int|ext|est|i\/e)[. ]).+)|^(?:\.(?!\.+))(.+)/i,
		scene_number : /( *#(.+)# *)/,

		transition : /^((?:FADE (?:TO BLACK|OUT)|CUT TO BLACK)\.|.+ TO\:)|^(?:> *)(.+)/,

		dialogue : /^([A-Z*_]+[0-9A-Z (._\-–'‘’“„”")]*)(\^?)?(?:\n(?!\n+))([\s\S]+)/,
		dialogue2 : /^(?:@)(.*)(\^?)?(?:\n(?!\n+))([\s\S]+)/, // [0-9A-Za-z
		// (._\-')]
		parenthetical : /^(\(.+\))$/,

		action : /^(.+)/g,
		action_pu : /^(?:\!)(.+)/gm,

		lyrics : /^(?:~)/gm,

		centered : /^(?:> *)([^\n]+)(?: *<)(\n.+)*/g,

		section : /^(#+)(?: *)(.*)/,
		synopsis : /^(?:\=(?!\=+) *)(.*)([\s\S]*)/,

		note : /^(?:\[{2})([\s\S]+?)(?:\]{2})$/,
		// note : /^(?:\[{2}(?!\[+))(.+)(?:\]{2}(?!\[+))$/,
		note_inline : /(?:\[{2}(?!\[+))([\s\S]+?)(?:\]{2}(?!\[+))/g,
		boneyard : /(^\/\*|^\*\/)$/gm,

		page_break : /^\={3,}$/,
		line_break : /^ {2}$/,

		emphasis : /(_|\*{1,3}|_\*{1,3}|\*{1,3}_)(.+)(_|\*{1,3}|_\*{1,3}|\*{1,3}_)/g,
		bold_italic_underline : /(_{1}\*{3}(?=.+\*{3}_{1})|\*{3}_{1}(?=.+_{1}\*{3}))(.+?)(\*{3}_{1}|_{1}\*{3})/g,
		bold_underline : /(_{1}\*{2}(?=.+\*{2}_{1})|\*{2}_{1}(?=.+_{1}\*{2}))(.+?)(\*{2}_{1}|_{1}\*{2})/g,
		italic_underline : /(_{1}\*{1}(?=.+\*{1}_{1})|\*{1}_{1}(?=.+_{1}\*{1}))(.+?)(\*{1}_{1}|_{1}\*{1})/g,
		bold_italic : /(\*{3}(?=.+\*{3}))(.+?)(\*{3})/g,
		bold : /(\*{2}(?=.+\*{2}))(.+?)(\*{2})/g,
		italic : /(\*{1}(?=.+\*{1}))(.+?)(\*{1})/g,
		underline : /(_{1}(?=.+_{1}))(.+?)(_{1})/g,

		splitter : /\n{2,}/g,
		cleaner : /^\n+|\n+$/,
		standardizer : /\r\n|\r/g,
		whitespacer : /^\t+|^ {3,}/gm
	};

	var lexer = function(script) {
		return script.replace(regex.standardizer, '\n').replace(regex.boneyard,
				'\n$1\n').replace(/^(\[{2}Shot:([\s\S]+?)\]{2})\s*$/mg,
				'\n\n$1\n\n').replace(regex.cleaner, '');// .replace(regex.whitespacer,
		// '');
	};

	var tokenize = function(script) {
		var src = lexer(script), i, line, linew, match, parts, text, meta, x, xlen, dual = undefined, tokens = [];
		src = src.split(regex.splitter);
		i = src.length;
		while (i--) {
			linew = src[i];
			if (linew == '')
				continue;
			line = linew.replace(regex.whitespacer, '');
			// Power User forced action
			if (regex.action_pu.test(linew)) {
				match = linew.replace(/^(?:\!)/gm, '');
				// .split(regex.splitter).reverse();
				tokens.push({
					type : 'action',
					text : match
				});
				continue;
			}

			// lyrics
			if (regex.lyrics.test(line)) {
				match = line.replace(regex.lyrics, '');
				tokens.push({
					type : 'lyrics',
					text : match
				});
				continue;
			}

			// title page
			if (regex.title_page.test(line)) {
				match = line.replace(regex.title_page, '\n$1').split(
						regex.splitter).reverse();
				for (x = 0, xlen = match.length; x < xlen; x++) {
					parts = match[x].replace(regex.cleaner, '').split(/\:\n*/);
					tokens.push({
						type : parts[0].trim().toLowerCase().replace(' ', '_'),
						text : parts[1].trim()
					});
				}
				continue;
			}

			// scene headings
			if (match = line.match(regex.scene_heading)) {
				text = match[1] || match[2];

				if (line.indexOf('\n') != -1) {
					parts = line.split(/\n/g).reverse();
					tokens.push({
						type : 'boneyard_end',
					});
					for (x = 0, xlen = parts.length; x < xlen - 1; x++) {
						if (parts[x].length > 0) {
							tokens.push({
								type : 'action',
								text : parts[x]
							});
						}
					}
					tokens.push({
						type : 'boneyard_begin',
					});
				}
				// if (text.indexOf(' ') !== text.length - 2) {
				if (meta = text.match(regex.scene_number)) {
					meta = meta[2];
					text = text.replace(regex.scene_number, '');
				}
				tokens.push({
					type : 'scene_heading',
					text : text,
					scene_number : meta || undefined
				});
				// }
				continue;
			}

			// centered
			if (match = line.match(regex.centered)) {
				/*
				 * parts = match[0].split(/\n/); for ( x = 0, xlen =
				 * parts.length; x < xlen; x++) { text = parts[x].replace(/>|</g,"");
				 * tokens.push({ type : 'centered', text : text }); }
				 */

				tokens.push({
					type : 'centered',
					text : match[0].replace(/>|</g, '')
				});
				continue;
			}

			// dialogue blocks - characters, parentheticals and dialogue
			if (match = line.match(regex.dialogue)
					|| line.match(regex.dialogue2)) {
				// if (match[1].indexOf(' ') !== match[1].length - 2) {
				// we're iterating from the bottom up, so we need to push these
				// backwards
				if (match[2] && !dual) {
					tokens.push({
						type : 'dual_dialogue_end'
					});
				}

				tokens.push({
					type : 'dialogue_end'
				});

				parts = match[3].split(/(\(.+\))(?:\n+)/).reverse();
				for (x = 0, xlen = parts.length; x < xlen; x++) {
					text = parts[x].replace(/\n$/, "");

					if (text.length > 0) {
						tokens
								.push({
									type : regex.parenthetical.test(text) ? 'parenthetical'
											: 'dialogue',
									text : text
								});
					}
				}

				tokens.push({
					type : 'character',
					text : match[1].trim()
				});
				tokens.push({
					type : 'dialogue_begin',
					dual : match[2] ? 'right' : dual ? 'left' : undefined
				});

				if (dual) {
					tokens.push({
						type : 'dual_dialogue_begin'
					});
				}

				dual = match[2] ? true : false;
				continue;
			}
			// }

			// section
			if (match = line.match(regex.section)) {
				tokens.push({
					type : 'section',
					text : match[2],
					depth : match[1].length
				});
				continue;
			}

			// synopsis
			if (match = line.match(regex.synopsis)) {
				if (match.length > 2 && match[2].length > 0) {
					parts = match[2].split(/\n/g).reverse();
					for (x = 0, xlen = parts.length; x < xlen; x++) {
						if (parts[x].length > 0) {
							tokens.push({
								type : 'action',
								text : parts[x]
							});
						}
					}
				}
				tokens.push({
					type : 'synopsis',
					text : match[1]
				});
				continue;
			}

			// notes
			if (match = line.match(regex.note)) {
				if (match[1].indexOf(']]') == -1) {
					var type = "note";
					var ret = match[1].replace(/&nbsp;/, ' ');
					if ((/^Shot: /).test(ret)) {
						type = "noteblue", ret = ret.substring(6);
					} else if ((/^Res: /).test(ret)) {
						type = "notegreen", ret = ret.substring(5);
					} else if ((/^\? /).test(ret)) {
						type = "noteviolet", ret = ret.substring(2);
					} else if ((/^! /).test(ret)) {
						type = "notered", ret = ret.substring(2);
					}
					tokens.push({
						type : type,
						text : ret
					});
					continue;
				}
			}

			// boneyard
			if (match = line.match(regex.boneyard)) {
				tokens.push({
					type : match[0][0] === '/' ? 'boneyard_begin'
							: 'boneyard_end'
				});
				continue;
			}

			// transitions
			if (match = line.match(regex.transition)) {
				tokens.push({
					type : 'transition',
					text : match[1] || match[2]
				});
				continue;
			}

			// page breaks
			if (regex.page_break.test(line)) {
				tokens.push({
					type : 'page_break'
				});
				continue;
			}

			// line breaks
			if (regex.line_break.test(line)) {
				tokens.push({
					type : 'line_break'
				});
				continue;
			}
			tokens.push({
				type : 'action',
				text : linew
			});
		}
		return tokens;
	};

	var inline = {
		note : '<span class="note">$1</span>',

		line_break : '<br />',

		bold_italic_underline : '<span class=\"bold\"><span class=\"italic\"><span class=\"underline\">$2</span></span></span>',
		bold_underline : '<span class=\"bold\"><span class=\"underline\">$2</span></span>',
		italic_underline : '<span class=\"italic\"><span class=\"underline\">$2</span></span>',
		bold_italic : '<span class=\"bold\"><span class=\"italic\">$2</span></span>',
		bold : '<span class=\"bold\">$2</span>',
		italic : '<span class=\"italic\">$2</span>',
		underline : '<span class=\"underline\">$2</span>'
	};

	inline.lexer = function(s, type) {
		if (!s) {
			return '';
		}
		if (type == 'action' || type == 'scene_heading' || type == 'section'
				|| type == 'dialogue')
			s = s.replace(/ ( +)/g, function(a, b) {
				return "&nbsp;" + b.replace(/ /g, '&nbsp;');
			});
		var styles = [ 'underline', 'italic', 'bold', 'bold_italic',
				'italic_underline', 'bold_underline', 'bold_italic_underline' ], i = styles.length, style, match;

		s = s.replace(regex.note_inline, function(a, b) {
			var type = "note";
			var ret = b.replace(/&nbsp;/, ' ');
			if ((/^Shot: /).test(ret)) {
				type = "noteblue", ret = ret.substring(6);
			} else if ((/^Res: /).test(ret)) {
				type = "notegreen", ret = ret.substring(5);
			} else if ((/^\? /).test(ret)) {
				type = "noteviolet", ret = ret.substring(2);
			} else if ((/^! /).test(ret)) {
				type = "notered", ret = ret.substring(2);
			}
			return '<span class="' + type + '">' + ret + '</span>';
		});

		s = s.replace(/\\\*/g, '[star]').replace(/\\_/g, '[underline]')
				.replace(/\n/g, inline.line_break);

		// if (regex.emphasis.test(s)) { // this was causing only every other
		// occurence of an emphasis syntax to be parsed
		while (i--) {
			style = styles[i];
			match = regex[style];

			if (match.test(s)) {
				s = s.replace(match, inline[style]);
			}
		}
		// }

		return s.replace(/\[star\]/g, '*').replace(/\[underline\]/g, '_');// .trim();
	};

	var parse = function(script, toks, callback) {
		if (callback === undefined && typeof toks === 'function') {
			callback = toks;
			toks = undefined;
		}

		var tokens = tokenize(script), i = tokens.length, token, title = undefined, title_page = [], html = [], output;

		var inDualDialog = false;
		var rightDialog = false;
		var inComment = false;
		var idCounter = 1;

		function spanComment(val) {
			if (inComment) {
				return '<span class="comment">' + val + '</span>';
			} else {
				return val;
			}
		}

		var titleMeta = {};

		while (i--) {
			token = tokens[i];
			token.text = inline.lexer(token.text, token.type);
			switch (token.type) {
			case 'title':
				title_page.push('<p class=\"title\">' + token.text + '</p>');
				title = token.text.replace('<br />', ' ').replace(
						/<(?:.|\n)*?>/g, '');
				break;

			// Mają nie być dodawane do strony tytułowej, żeby się dwa razy nie
			// dodawały przy zapisywaniu
			case 'lang':
				// title_page.push('<p class=\"language\">' + token.text +
				// '</p>');
				titleMeta.language = token.text;
				break;
			case 'language':
				// title_page.push('<p class=\"language\">' + token.text +
				// '</p>');
				titleMeta.language = token.text;
				break;
			case 'acronym':
				// title_page.push('<p class=\"acronym\">' + token.text +
				// '</p>');
				titleMeta.acronym = token.text;
				break;
			case 'series':
				titleMeta.series = token.text;
				break;
			case 'locked':
				// title_page.push('<p class=\"locked\">' + token.text +
				// '</p>');
				titleMeta.locked = token.text;
				break;
			case 'credit':
				title_page.push('<p class=\"credit\">' + token.text + '</p>');
				break;
			case 'author':
				title_page.push('<p class=\"authors\">' + token.text + '</p>');
				break;
			case 'authors':
				title_page.push('<p class=\"authors\">' + token.text + '</p>');
				break;
			case 'source':
				title_page.push('<p class=\"source\">' + token.text + '</p>');
				break;
			case 'notes':
				title_page.push('<p class=\"notes\">' + token.text + '</p>');
				break;
			case 'draft_date':
				title_page.push('<p class=\"draft-date\">' + token.text
						+ '</p>');
				break;
			case 'date':
				title_page.push('<p class=\"date\">' + token.text + '</p>');
				break;
			case 'contact':
				title_page.push('<p class=\"contact\">' + token.text + '</p>');
				break;
			case 'copyright':
				title_page
						.push('<p class=\"copyright\">' + token.text + '</p>');
				break;

			case 'scene_heading':
				html.push('<h3 id=\"id'
						+ (idCounter++)
						+ '\">'
						+ spanComment('<span class=\"number\">'
								+ (token.scene_number ? token.scene_number
										: '&nbsp;') + '</span>' + token.text)
						+ '</h3>');
				break;
			case 'transition':
				html.push('<h2>' + spanComment(token.text) + '</h2>');
				break;

			case 'dual_dialogue_begin':
				if (!inDualDialog) {
					inDualDialog = true;
					rightDialog = false;
				}
				break;
			case 'dialogue_begin':
				break;
			case 'character':
				html.push('<h4 class=\"'
						+ (rightDialog ? "dialogright" : "dialog") + '\">'
						+ spanComment(token.text) + '</h4>');
				if (inDualDialog)
					if (!rightDialog)
						rightDialog = true;
				break;
			case 'parenthetical':
				html.push('<div class=\"parenthetical\">'
						+ spanComment(token.text.substring(1,
								token.text.length - 1)) + '</div>');
				break;
			case 'dialogue':
				html.push('<div class=\"talk\">' + spanComment(token.text)
						+ '</div>');
				break;
			case 'dialogue_end':
				break;
			case 'dual_dialogue_end':
				inDualDialog = false;
				rightDialog = false;
				break;

			case 'section':
				html.push('<h1 id=\"id' + (idCounter++) + '\" data-depth=\"'
						+ token.depth + '\">' + spanComment(token.text)
						+ '</h1>');
				break;
			case 'synopsis':
				html.push('<h5>' + spanComment(token.text) + '</h5>');
				break;

			case 'note':
				html.push('<div id=\"id' + (idCounter++) + '\" class="note">'
						+ spanComment(token.text) + '</div>');
				break;
			case 'noteblue':
				html.push('<div id=\"id' + (idCounter++)
						+ '\" class="noteblue">' + spanComment(token.text)
						+ '</div>');
				break;
			case 'notegreen':
				html.push('<div id=\"id' + (idCounter++)
						+ '\" class="notegreen">' + spanComment(token.text)
						+ '</div>');
				break;
			case 'noteviolet':
				html.push('<div id=\"id' + (idCounter++)
						+ '\" class="noteviolet">' + spanComment(token.text)
						+ '</div>');
				break;
			case 'notered':
				html.push('<div id=\"id' + (idCounter++)
						+ '\" class="notered">' + spanComment(token.text)
						+ '</div>');
				break;
			case 'boneyard_begin':
				inComment = true;
				break;
			case 'boneyard_end':
				inComment = false;
				break;

			case 'action':
				html.push('<p>' + spanComment(token.text) + '</p>');
				break;
			case 'centered':
				html.push('<div class=\"centered\">' + spanComment(token.text)
						+ '</div>');
				break;

			case 'page_break':
				html.push('<hr />');
				break;
			case 'line_break':
				html.push('<br />');
				break;
			case 'lyrics':
				html.push('<div class=\"lyrics\">' + spanComment(token.text)
						+ '</div>');
				break;
			}
		}

		output = {
			title : title,
			html : {
				title_page : title_page.join(''),
				script : html.join('')
			},
			tokens : toks ? tokens.reverse() : undefined,
			titleMeta : titleMeta
		};

		if (typeof callback === 'function') {
			return callback(output);
		}

		return output;
	};

	var fx = function(script, tokens, callback) {
		return parse(script, tokens, callback);
	};
	var fountain = function(script, callback) {
		return fx(script, callback);
	};

	fountain.parse = fx;
	fountain.regex = regex;
	fountain.inline = inline;

	if (typeof module !== 'undefined') {
		module.exports = fountain;
	} else {
		this.fountain = fountain;
	}
}).call(this);
