/**
 * @file Dostarcza API
 * @name FTN Editor - API
 * @author Robert Jaros
 * @copyright 2014
 *
 */

/**
 * 
 * Obiekt FountainExt z podstawowymi elementami
 * 
 * @constructor
 * 
 * @property {string} htmlTp - HTML strony tytułowej
 * @property {string} htmlScen - HTML scenariusza
 * @property {string} srcTp - Źródło strony tytułowej
 * @property {string} srcScen - Źródło scenariusza
 * @property {string} src - Źródło całego scenariusza wraz ze stroną tytułową
 * @property {array} model - Uproszczony model scenariusza
 * @property {array} indeks - Indeks adresow dla elementów modelu scenariusza
 * @property {boolean} hasSections - Czy scenariusz posiada sekcje
 * @property {integer} totalTime - Czas całego scenariusza
 * @property {array} elements - Jakie elementy posiada scenariusz [sekcje,
 *           streszczenia, sceny, akcje, postacie, dialogi, nawiasy, przejścia,
 *           notatka, notatkaV, notatkaR, notatkaB, notatkaG ]
 * @property {array} modelIndeks - indeks scen w oparciu o adres elementu
 * 
 */
function FountainExt() {
	this.htmlTp = null;
	this.htmlScen = null;
	this.srcTp = "";
	this.srcScen = "";
	this.src = "";
	this.model = null;
	this.indeks = null;
	this.__hasSections = false;
	this.__totalTime = 0;
	this.elemnets = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
	this.modelIndeks = [];
	this.titlePageMap = {};
}

FountainExt.prototype.htmlTp = null;
FountainExt.prototype.htmlScen = null;
FountainExt.prototype.srcTp = "";
FountainExt.prototype.srcScen = "";
FountainExt.prototype.src = "";
FountainExt.prototype.model = null;
FountainExt.prototype.indeks = null;
FountainExt.prototype.__hasSections = false;
FountainExt.prototype.__totalTime = 0;
FountainExt.prototype.elemnets = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
FountainExt.prototype.modelIndeks = [];
FountainExt.prototype.titlePageMap = {};

/**
 * Funkcja analizuje składnię dokumentu Fountain i wypełnia poszczegóne elementy
 * obiektu FountainExt.
 * 
 * @param {string}
 *            ftntxt - Źródło dokumnetu Fountain.
 * 
 */
FountainExt.prototype.parse = function(ftntxt) {
	var parsedFile = fountain.parse(ftntxt);
	this.htmlTp = parsedFile.html.title_page;
	this.htmlScen = parsedFile.html.script;
	this.titleMeta = parsedFile.titleMeta;
	this.srcTp = this.__formatTp(this.htmlTp);
	var modeltxt = this.__formatScen(this.htmlScen.replace(/&nbsp;/g, ' '));
	this.srcScen = modeltxt.txt;
	this.model = modeltxt.model;
	this.indeks = modeltxt.indeks;
	this.modelIndeks = modeltxt.modelIndeks;
	this.__hasSections = modeltxt.hasSections;
	this.__totalTime = modeltxt.totalTime;
	this.elements = modeltxt.elements;
	this.__updateSrc();
};

/**
 * Funkcja zwraca HTML strony tytułowej.
 * 
 * @return {string} Wartość elemetu htmlTp obiektu FountainExt.
 * 
 */
FountainExt.prototype.getHtmlTp = function() {
	return this.htmlTp;
};

/**
 * Funkcja zwraca HTML scenariusza.
 * 
 * @return {string} Wartość elemetu htmlScen obiektu FountainExt.
 * 
 */
FountainExt.prototype.getHtmlScen = function() {
	return this.htmlScen;
};

/**
 * Funkcja zwraca źródło całego scenariusza wraz ze stroną tytułową.
 * 
 * @return {string} Wartość elemetu src obiektu FountainExt.
 * 
 */
FountainExt.prototype.getSrc = function() {
	return this.src;
};

/**
 * Funkcja zwraca uproszczony model scenariusza.
 * 
 * @return {array} Wartość elemetu model obiektu FountainExt.
 * 
 */
FountainExt.prototype.getModel = function() {
	return this.model;
};

/**
 * 
 * @returns obiekt z właściwościami "Language", "Acronym", "Locked" tworzony w
 *          metodzie parse
 */
FountainExt.prototype.getTitleMeta = function() {
	return this.titleMeta;
};

FountainExt.prototype.getTitlePageMap = function() {
	return this.titlePageMap;
};

FountainExt.prototype.setTitleMeta = function(meta) {
	this.titleMeta = meta;

	if (this.titleMeta.resetDates) {
		var tpd = this.__formatTp(this.htmlTp);
		var parsedFile = fountain.parse(tpd);
		this.htmlTp = parsedFile.html.title_page;
	}
	this.srcTp = this.__formatTp(this.htmlTp);
	this.__updateSrc();
	// console.log("FountainExt.prototype.setTitleMeta", JSON.stringify(meta));

}

/**
 * Funkcja zwraca indeks model scenariusza.
 * 
 * @return {array} Wartość elemetu indeks obiektu FountainExt.
 * 
 */
FountainExt.prototype.getIndeks = function() {
	return this.indeks;
};

/**
 * Funkcja zwraca informację, czy scenariusz zawiera sekcje.
 * 
 * @return {boolean} Wartość elemetu hasSections obiektu FountainExt.
 * 
 */
FountainExt.prototype.hasSections = function() {
	return this.__hasSections;
};

/**
 * Funkcja zwraca informację, czy scenariusz zawiera czasy.
 * 
 * @return {integer} Wartość elemetu totalTime obiektu FountainExt.
 * 
 */
FountainExt.prototype.getTotalTime = function() {
	return this.__totalTime;
};

/**
 * Funkcja zwraca informację, jakie elementy zawiera scenariusz.
 * 
 * @return {array} Wartość elemetu elements obiektu FountainExt.
 * 
 */
FountainExt.prototype.getElements = function() {
	return this.elements;
};

/**
 * Funkcja zwraca informację o indeksach scen w oparciu o adres elementu.
 * 
 * @return {array} Wartość elemetu modelIndeks obiektu FountainExt.
 * 
 */
FountainExt.prototype.getModelIndeks = function() {
	return this.modelIndeks;
};

/**
 * Funkcja aktualizuje HTML i źródło strony tytułowej oraz źródło całego
 * scenariusza na podstawie HTML-a strony tytułowej.
 * 
 * @param {string}
 *            htmlTp - HTML strony tytułowej.
 * 
 */
FountainExt.prototype.updateHtmlTp = function(htmlTp) {
	this.htmlTp = htmlTp;
	this.srcTp = this.__formatTp(this.htmlTp);
	this.__updateSrc();
};

/**
 * Funkcja aktualizuje datę szkicu w stronie tytułowej.
 * 
 * @param {string}
 *            htmlTp - HTML strony tytułowej.
 * 
 */
FountainExt.prototype.updateDraftDate = function() {
	var tpd = this.__formatTp(this.htmlTp, true);
	var parsedFile = fountain.parse(tpd);
	this.htmlTp = parsedFile.html.title_page;
	this.srcTp = this.__formatTp(this.htmlTp);
	this.__updateSrc();
};

/**
 * Funkcja dodaje metadane z podanego obiektu do strony tytułowej. Unused
 * Deprecated - przeniesione do __formatTp
 */
FountainExt.prototype.addTitleMetaData = function(metadata) {
	if (metadata !== null && typeof metadata === 'object') {

		this.srcTp = this.srcTp
				+ [ "Language", "Acronym", "Locked", "Series" ].map(
						function(name) {
							var key = name.toLowerCase();
							if (key in metadata) {
								return "\n" + name + ": " + metadata[key];
							} else {
								return "";
							}
						}).join("");

		console.log("addTitleMetaData", metadata, this.srcTp);
		this.__updateSrc();
	}
}

/**
 * Funkcja aktualizuje HTML, źródło i uproszczony model scenariusza oraz źródło
 * całego scenariusza na podstawie HTML-a scenariusza.
 * 
 * @param {string}
 *            htmlScen - HTML scenariusza.
 * 
 */
FountainExt.prototype.updateHtmlScen = function(htmlScen) {
	this.htmlScen = htmlScen;
	var modeltxt = this.__formatScen(this.htmlScen);
	this.srcScen = modeltxt.txt;
	this.model = modeltxt.model;
	this.indeks = modeltxt.indeks;
	this.elements = modeltxt.elements;
	this.__hasSections = modeltxt.hasSections;
	this.__totalTime = modeltxt.totalTime;
	this.__updateSrc();
};

/**
 * Funkcja czyści wszystkie elementy obiektu FountainExt.
 * 
 */
FountainExt.prototype.clear = function() {
	this.htmlTp = null;
	this.htmlScen = null;
	this.srcTp = "";
	this.srcScen = "";
	this.src = "";
	this.model = null;
	this.indeks = null;
	this.elements = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
	this.__hasSections = false;
	this.__totalTime = 0;
};

FountainExt.prototype.__updateSrc = function() {
	this.src = (this.srcTp !== "" ? this.srcTp + "\n\n" : "") + this.srcScen;
};

// FIXME: obłużyć parametr resetDates, jeżeli true, to ma usunąć draftDate i
// ustawić date na wartość
// currentDate, a potem obie usunąć z this.titleMeta
FountainExt.prototype.__formatTp = function(html, forceDraftDate) {
	var htmlparser = requireIfy("htmlparser2");

	var handler = new htmlparser.DomHandler(function(error, dom) {
		if (error) {
			console.log("error: " + error);
		} else {
		}
	}, {
		verbose : false,
		ignoreWhitespace : true
	});
	var parser = new htmlparser.Parser(handler);
	parser.write(html);
	parser.done();

	var tp = {};
	for ( var i in handler.dom) {
		var e = handler.dom[i];
		if (e.type == 'tag' && e.name == 'p' && e.attribs !== undefined) {
			if (e.attribs['class'] == 'title') {
				tp.title = this.__parseInline(e.children, false, false, null,
						"");
			} else if (e.attribs['class'] == 'credit') {
				tp.credit = this.__parseInline(e.children, false, false, null,
						"");
			} else if (e.attribs['class'] == 'authors') {
				tp.authors = this.__parseInline(e.children, false, false, null,
						"");
			} else if (e.attribs['class'] == 'source') {
				tp.source = this.__parseInline(e.children, false, false, null,
						"");
			} else if (e.attribs['class'] == 'notes') {
				tp.notes = this.__parseInline(e.children, false, false, null,
						"");
			} else if (e.attribs['class'] == 'draft-date') {
				tp.draftDate = this.__parseInline(e.children, false, false,
						null, "");
			} else if (e.attribs['class'] == 'date') {
				tp.date = this
						.__parseInline(e.children, false, false, null, "");
			} else if (e.attribs['class'] == 'contact') {
				tp.contact = this.__parseInline(e.children, false, false, null,
						"");
			} else if (e.attribs['class'] == 'copyright') {
				tp.copyright = this.__parseInline(e.children, false, false,
						null, "");
			}
		}
	}
	var ret = "";
	if (tp.title !== undefined && tp.title.length > 0) {
		ret += "\nTitle:" + this.__formatIndentTp(tp.title);
	}
	if (tp.language !== undefined && tp.language.length > 0) {
		ret += "\nLanguage:" + this.__formatIndentTp(tp.language);
	}
	if (tp.acronym !== undefined && tp.acronym.length > 0) {
		ret += "\nAcronym:" + this.__formatIndentTp(tp.acronym);
	}
	if (tp.locked !== undefined && tp.locked.length > 0) {
		ret += "\nLocked:" + this.__formatIndentTp(tp.locked);
	}
	if (tp.series !== undefined && tp.series.length > 0) {
		ret += "\nSeries:" + this.__formatIndentTp(tp.series);
	}
	if (tp.credit !== undefined && tp.credit.length > 0) {
		ret += "\nCredit:" + this.__formatIndentTp(tp.credit);
	}
	if (tp.authors !== undefined && tp.authors.length > 0) {
		ret += "\nAuthors:" + this.__formatIndentTp(tp.authors);
	}
	if (tp.source !== undefined && tp.source.length > 0) {
		ret += "\nSource:" + this.__formatIndentTp(tp.source);
	}
	if (tp.notes !== undefined && tp.notes.length > 0) {
		ret += "\nNotes:" + this.__formatIndentTp(tp.notes);
	}
	if (forceDraftDate !== undefined) {
		tp.draftDate = this.__genDate();
	}

	if (this.titleMeta && this.titleMeta.resetDates) {
		delete tp.draftDate;
		tp.date = this.titleMeta.currentDate;
		delete this.titleMeta.resetDates;
		delete this.titleMeta.currentDate;
	}

	if (tp.draftDate !== undefined && tp.draftDate.length > 0) {
		ret += "\nDraft date:" + this.__formatIndentTp(tp.draftDate);
	}
	if (tp.date !== undefined && tp.date.length > 0) {
		ret += "\nDate:" + this.__formatIndentTp(tp.date);
	}
	if (tp.contact !== undefined && tp.contact.length > 0) {
		ret += "\nContact:" + this.__formatIndentTp(tp.contact);
	}
	if (tp.copyright !== undefined && tp.copyright.length > 0) {
		ret += "\nCopyright:" + this.__formatIndentTp(tp.copyright);
	}

	var _titleMeta = this.titleMeta; // ftneditor.getMainApp().__titleMetaPanel.getMetadata()
	// console.log("_titleMeta", JSON.stringify(_titleMeta));
	if (_titleMeta) {
		[ "Language", "Acronym", "Series", "Locked" ].forEach(function(name) {
			var key = name.toLowerCase();
			if (key in _titleMeta) {
				tp[key] = _titleMeta[key];
				ret += "\n" + name + ": " + _titleMeta[key];
			}
		});
	}

	this.titlePageMap = tp;

	if (ret.length > 0)
		return ret.substring(1);
	return ret;
};

FountainExt.prototype.__formatIndentTp = function(line) {
	if (line.indexOf('\n') != -1) {
		var lines = line.split('\n');
		var ret = "";
		for ( var i in lines) {
			if (lines[i] !== '') {
				ret += "\n\t" + lines[i].trim();
			}
		}
		return ret;
	} else {
		return " " + line;
	}
};

FountainExt.prototype.__compareItem = function(model, id1, id2) {
	var depth1 = 0;
	var depth2 = 0;
	var type1 = model[id1].type;
	var type2 = model[id2].type;
	switch (type1) {
	case 'section':
		depth1 = model[id1].depth;
		break;
	case 'scene':
		depth1 = 4;
		break;
	case 'note':
		depth1 = 5;
		break;
	}
	switch (type2) {
	case 'section':
		depth2 = model[id2].depth;
		break;
	case 'scene':
		depth2 = 4;
		break;
	case 'note':
		depth2 = 5;
		break;
	}
	return (depth1 >= depth2);
};

FountainExt.prototype.__calculateTime = function(type, idParent, model) {
	if (!model[model.length - 1].comment) {
		if ((idParent.length - 1) >= 0
				&& ((type == "note" && model[idParent[idParent.length - 1]].type != "note")
						|| (type == "scene" && "scene,note"
								.indexOf(model[idParent[idParent.length - 1]].type) < 0) || (type == "section"
						&& model[idParent[idParent.length - 1]].type == "section" && model[idParent[idParent.length - 1]].depth < model[model.length - 1].depth))) {
			model[model.length - 1].timeR = model[idParent[idParent.length - 1]].timeR;
		} else if ((idParent.length - 1) < 0) {
			model[model.length - 1].timeR = 0;
		}
		for (var i = idParent.length - 1; i >= 0; i--) {
			if (this.__compareItem(model, idParent[i], model.length - 1)) {
				if ((type == "note" && model[idParent[i]].type == "note")
						|| (type == "scene" && model[idParent[i]].type == "scene")
						|| (type == "section" && model[idParent[i]].depth == model[model.length - 1].depth)) {
					model[model.length - 1].timeR = model[idParent[i]].timeR
							+ (model[idParent[i]].time != null ? model[idParent[i]].time
									: model[idParent[i]].timeW);
				}
				idParent.pop();
			}
		}
		if (model[model.length - 1].time != null) {
			for (i = idParent.length - 1; i >= 0; i--) {
				model[idParent[i]].timeW = model[idParent[i]].timeW
						+ parseInt(model[model.length - 1].time);
				if (model[idParent[i]].time != null) {
					break;
				}
			}
		}
		idParent.push(model.length - 1);
	}
};

FountainExt.prototype.__propagateTime = function(model) {
	var timeR = 0;
	var time = 0;
	var id = 'ad0';
	for ( var i in model) {
		var elem = model[i];
		if (elem.timeR == undefined || elem.timeR == null) {
			elem.timeR = timeR;
		} else {
			timeR = elem.timeR;
		}
		if (!elem.comment && elem.time !== undefined && elem.time !== null) {
			time = elem.time;
		}
		if (!elem.comment && elem.id !== undefined && elem.id !== null
				&& elem.time) {
			id = elem.id;
		}
		elem.lastTimeId = id;
	}
	return timeR + time;
};

FountainExt.prototype.__formatScen = function(html) {
	var htmlparser = requireIfy("htmlparser2");
	var handler = new htmlparser.DomHandler(function(error, dom) {
		if (error) {
			console.log("error: " + error);
		} else {
		}
	}, {
		verbose : false,
		ignoreWhitespace : false
	});
	var parser = new htmlparser.Parser(handler);
	parser.write(html);
	parser.done();
	var ret = {};
	ret.model = [];
	ret.indeks = [];
	ret.elements = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
	ret.modelIndeks = [];
	var txt = "";
	var inDialog = false;
	var inComment = false;
	var prefix = "";
	var address = 0;
	var lastCharacter = null;
	var lastSceneNumber = null;
	var lastSceneIndex = null;
	var lastId = null;
	var hasSections = false;
	var characters = [];

	// liczenie czasu
	var idParent = [];

	// Numery sekcji
	var numerator = this.__createCounter();
	var numer = "";
	var lastSectionNumber = null;
	var lastSectionName = null;
	var lastSectionIndex = null;

	for ( var i in handler.dom) {
		var e = handler.dom[i];
		if (e.type == 'tag') {
			if (e.children !== undefined && e.children.length == 1
					&& e.children[0].type == 'tag'
					&& e.children[0].name == 'span'
					&& e.children[0].attribs !== undefined
					&& e.children[0].attribs['class'] == 'comment') {
				if (!inComment) {
					if (inDialog) {
						txt += "\n";
						inDialog = false;
					}
					inComment = true;
					txt += "/*\n\n";
				}
			} else {
				if (inComment) {
					if (inDialog) {
						txt += "\n";
						inDialog = false;
					}
					inComment = false;
					txt += "*/\n\n";
				}
			}

			if (!(e.name == 'div' && e.attribs !== undefined && (e.attribs['class'] == 'parenthetical' || e.attribs['class'] == 'talk'))) {
				if (inDialog) {
					txt += "\n";
					inDialog = false;
				}
			}
			if (e.name == 'p') {
				var akcja = this.__parseInline(e.children, inComment, false,
						ret.model, "mad" + address, idParent, lastSceneNumber,
						ret.elements);
				prefix = "";
				if (this.__matchesSceneHeading(akcja)
						|| this.__matchesTransition(akcja)
						|| this.__matchesLyrics(akcja)
						|| this.__matchesSection(akcja)
						|| this.__matchesSynopsis(akcja)) {
					prefix = "!";
				}
				txt += prefix + akcja + "\n\n";
				ret.model.push({
					type : "action",
					text : akcja,
					lastSceneIndex : lastSceneIndex,
					lastSectionIndex : lastSectionIndex,
					lastId : lastId,
					comment : inComment,
					sceneNumber : lastSceneNumber,
					lastSectionNumber : lastSectionNumber
				});
				if (!inComment) {
					ret.elements[3] = ret.elements[3] + 1;
				}
			} else if (e.name == 'h1') {
				var sekcja = this.__parseInline(e.children, inComment, false,
						ret.model, "mad" + address, idParent, lastSceneNumber,
						ret.elements);
				var stime = this.__parseTime(sekcja);
				var depth = null;
				var id = null;
				if (e.attribs !== undefined) {
					depth = parseInt(e.attribs['data-depth'], 10);
					id = e.attribs['id'];
				}
				if (id == null || id == undefined) {
					id = "ad" + address;
				}
				if (!id) {
					id = null;
				} else {
					id = id.toString();
				}
				lastId = id;
				numer = numerator.makeValue(depth);
				ret.model.push({
					type : "section",
					text : stime.txt,
					time : stime.time,
					timeW : null,
					timeR : null,
					depth : depth,
					sectionNumber : numer,
					id : id,
					lastSceneIndex : lastSceneIndex,
					lastSectionIndex : ret.model.length,
					comment : inComment
				});
				var dep = "";
				if (depth == '1') {
					dep = "# ";
				} else if (depth == '2') {
					dep = "## ";
				} else if (depth == '3') {
					dep = "### ";
				} else {
					dep = "# ";
				}
				txt += dep + sekcja + "\n\n";

				if (!inComment) {
					this.__calculateTime("section", idParent, ret.model);
					lastSceneNumber = null;
					hasSections = true;
					lastSectionNumber = numer;
					lastSectionName = stime.txt;
					lastSectionIndex = ret.model.length - 1;
					ret.elements[0] = ret.elements[0] + 1;
				}
			} else if (e.name == 'h2') {
				var przejscie = this.__parseInline(e.children, inComment,
						false, ret.model, "mad" + address, idParent,
						lastSceneNumber, ret.elements);
				przejscie = przejscie.toUpperCase();
				prefix = "";
				if (!this.__matchesTransition(przejscie)) {
					prefix = "> ";
				}
				txt += prefix + przejscie + "\n\n";
				ret.model.push({
					type : "transition",
					text : przejscie,
					lastSceneIndex : lastSceneIndex,
					lastSectionIndex : lastSectionIndex,
					lastId : lastId,
					comment : inComment,
					sceneNumber : lastSceneNumber,
					lastSectionNumber : lastSectionNumber
				});
				if (!inComment) {
					ret.elements[7] = ret.elements[7] + 1;
				}
			} else if (e.name == 'h3') {
				var scena = this.__parseInline(e.children, inComment, false,
						ret.model, "mad" + address, idParent, lastSceneNumber,
						ret.elements);
				scena = scena.toUpperCase(); 
				var sctime = this.__parseTime(scena);
				if (!inComment && sctime.time !== null)
					totalTime = true;
				var numer = "";
				var children = e.children;
				if (inComment) {
					children = e.children[0].children;
				}
				for ( var s in children) {
					var tag = children[s];
					if (tag.type == 'tag' && tag.name == 'span'
							&& tag.attribs !== undefined
							&& tag.attribs['class'] == 'number') {
						if (tag.children !== undefined
								&& tag.children[0] !== undefined
								&& tag.children[0].type == 'text') {
							numer = tag.children[0].data.trim();
						}
					}
				}
				var id = null;
				if (e.attribs !== undefined) {
					id = e.attribs['id'];
				}
				if (id == null || id == undefined) {
					id = "ad" + address;
				}
				if (!id) {
					id = null;
				} else {
					id = id.toString();
				}
				lastId = id;
				ret.model.push({
					type : "scene",
					text : sctime.txt,
					time : sctime.time,
					timeW : null,
					timeR : null,
					number : numer,
					id : id,
					lastSceneIndex : ret.model.length,
					lastSectionIndex : lastSectionIndex,
					comment : inComment,
					lastSectionNumber : lastSectionNumber,
					lastSectionName : lastSectionName
				});
				prefix = "";
				if (!this.__matchesSceneHeading(scena)) {
					prefix = ".";
				}
				txt += prefix + scena
						+ (numer !== "" ? " #" + numer + "#" : "") + "\n\n";

				if (!inComment) {
					this.__calculateTime("scene", idParent, ret.model);
					lastSceneNumber = numer;
					lastSceneIndex = ret.model.length - 1;
					ret.elements[2] = ret.elements[2] + 1;
					ret.modelIndeks[address] = ret.model.length - 1;
				}

			} else if (e.name == 'h4') {
				var character = this.__parseInline(e.children, inComment,
						false, ret.model, "mad" + address, idParent,
						lastSceneNumber, ret.elements);//.toUpperCase();
				character = character.toUpperCase(); 
				prefix = "";
				if (!this.__matchesDialog(character + "\n(test)")) {
					prefix = "@";
				}
				var chext = this.__parseCharacter(character);
				var jed = false;
				if (e.attribs !== undefined
						&& e.attribs['class'] == 'dialogright') {
					txt += prefix + character + " ^\n";
					jed = true;
				} else {
					txt += prefix + character + "\n";
				}
				inDialog = true;
				var id = null;
				if (e.attribs !== undefined) {
					id = e.attribs['id'];
				}
				if (id == null || id == undefined) {
					id = "ad" + address;
				}
				if (!id) {
					id = null;
				} else {
					id = id.toString();
				}
				lastId = id;

				var first = "0";
				if (characters.length === 0
						|| (characters.length > 0 && characters
								.indexOf(chext.txt) < 0)) {
					characters.push(chext.txt);
					first = "1";
				}

				ret.model.push({
					type : "character",
					name : chext.txt,
					ext : chext.ext,
					dual : jed,
					lastSceneIndex : lastSceneIndex,
					lastSectionIndex : lastSectionIndex,
					id : id,
					comment : inComment,
					sceneNumber : lastSceneNumber,
					lastSectionNumber : lastSectionNumber,
					first : first
				});
				lastCharacter = chext.txt;
				if (!inComment) {
					ret.elements[4] = ret.elements[4] + 1;
				}
			} else if (e.name == 'h5') {
				var streszczenie = this.__parseInline(e.children, inComment,
						false, ret.model, "mad" + address, idParent,
						lastSceneNumber, ret.elements);
				var sparts = streszczenie.split(/\n/g);
				for (i in sparts) {
					var st = sparts[i].trim();
					if (st !== '') {
						ret.model.push({
							type : "synopsis",
							text : st,
							lastSceneIndex : lastSceneIndex,
							lastSectionIndex : lastSectionIndex,
							lastId : lastId,
							comment : inComment,
							sceneNumber : lastSceneNumber,
							lastSectionNumber : lastSectionNumber
						});
						txt += "= " + st + "\n\n";
						if (!inComment) {
							ret.elements[1] = ret.elements[1] + 1;
						}
					}
				}
			} else if (e.name == 'div' && e.attribs !== undefined) {
				var id = e.attribs['id'];
				if (id == null || id == undefined) {
					id = "ad" + address;
				}
				if (e.attribs['class'] == 'parenthetical') {
					var nawias = this.__parseInline(e.children, inComment,
							false, ret.model, "mad" + address, idParent,
							lastSceneNumber, ret.elements);
					txt += "(" + nawias + ")\n";
					ret.model.push({
						type : "parenthetical",
						text : nawias,
						character : lastCharacter,
						lastSceneIndex : lastSceneIndex,
						lastSectionIndex : lastSectionIndex,
						lastId : lastId,
						comment : inComment,
						sceneNumber : lastSceneNumber,
						lastSectionNumber : lastSectionNumber
					});
					if (!inComment) {
						ret.elements[6] = ret.elements[6] + 1;
					}
				} else if (e.attribs['class'] == 'talk') {
					var dialog = this.__parseInline(e.children, inComment,
							false, ret.model, "mad" + address, idParent,
							lastSceneNumber, ret.elements);
					txt += dialog + "\n";
					ret.model.push({
						type : "dialogue",
						text : dialog,
						character : lastCharacter,
						lastSceneIndex : lastSceneIndex,
						lastSectionIndex : lastSectionIndex,
						lastId : lastId,
						comment : inComment,
						sceneNumber : lastSceneNumber,
						lastSectionNumber : lastSectionNumber
					});
					if (!inComment) {
						ret.elements[5] = ret.elements[5] + 1;
					}
				} else if (e.attribs['class'] == 'centered') {
					var c = this.__parseInline(e.children, inComment, false,
							ret.model, "mad" + address, idParent,
							lastSceneNumber, ret.elements);
					var parts = c.split(/\n/g);
					for (i in parts) {
						txt += "> " + parts[i].trim() + " <\n";
						ret.model.push({
							type : "centered",
							text : parts[i].trim(),
							lastSceneIndex : lastSceneIndex,
							lastSectionIndex : lastSectionIndex,
							lastId : lastId,
							comment : inComment,
							sceneNumber : lastSceneNumber,
							lastSectionNumber : lastSectionNumber
						});
					}
					txt += "\n";
				} else if (e.attribs['class'] == 'lyrics') {
					var c = this.__parseInline(e.children, inComment, false,
							ret.model, "mad" + address, idParent,
							lastSceneNumber, ret.elements);
					var parts = c.split(/\n/g);
					for (i in parts) {
						txt += "~" + parts[i].trim() + "\n";
						ret.model.push({
							type : "lyrics",
							text : parts[i].trim(),
							lastSceneIndex : lastSceneIndex,
							lastSectionIndex : lastSectionIndex,
							lastId : lastId,
							comment : inComment,
							sceneNumber : lastSceneNumber,
							lastSectionNumber : lastSectionNumber
						});
					}
					txt += "\n";
				} else if (e.attribs['class'] == 'note') {
					lastId = id;
					var note = this.__parseInline(e.children, inComment, true,
							ret.model, "mad" + address, idParent,
							lastSceneNumber, ret.elements);
					txt += "[[" + this.__formatNote(note) + "]]\n\n";
					ret.model.push({
						type : "note",
						text : note,
						color : 0,
						inline : false,
						id : id,
						lastSceneIndex : lastSceneIndex,
						lastSectionIndex : lastSectionIndex,
						comment : inComment,
						sceneNumber : lastSceneNumber,
						lastSectionNumber : lastSectionNumber
					});
					if (!inComment) {
						ret.elements[8] = ret.elements[8] + 1;
					}
				} else if (e.attribs['class'] == 'noteviolet') {
					lastId = id;
					var notev = this.__parseInline(e.children, inComment, true,
							ret.model, "mad" + address, idParent,
							lastSceneNumber, ret.elements);
					prefix = "";
					if (!(/^\?/).test(notev))
						prefix = "? ";
					txt += "[[" + prefix + this.__formatNote(notev) + "]]\n\n";
					ret.model.push({
						type : "note",
						text : notev,
						color : 1,
						inline : false,
						id : id,
						lastSceneIndex : lastSceneIndex,
						lastSectionIndex : lastSectionIndex,
						comment : inComment,
						sceneNumber : lastSceneNumber,
						lastSectionNumber : lastSectionNumber
					});
					if (!inComment) {
						ret.elements[9] = ret.elements[9] + 1;
					}
				} else if (e.attribs['class'] == 'notered') {
					lastId = id;
					var noter = this.__parseInline(e.children, inComment, true,
							ret.model, "mad" + address, idParent,
							lastSceneNumber, ret.elements);
					prefix = "";
					if (!(/^!/).test(noter))
						prefix = "! ";
					txt += "[[" + prefix + this.__formatNote(noter) + "]]\n\n";
					ret.model.push({
						type : "note",
						text : noter,
						color : 2,
						inline : false,
						id : id,
						lastSceneIndex : lastSceneIndex,
						lastSectionIndex : lastSectionIndex,
						comment : inComment,
						sceneNumber : lastSceneNumber,
						lastSectionNumber : lastSectionNumber
					});
					if (!inComment) {
						ret.elements[10] = ret.elements[10] + 1;
					}
				} else if (e.attribs['class'] == 'noteblue') {
					lastId = id;
					var noteb = this.__parseInline(e.children, inComment, true,
							ret.model, "mad" + address, idParent,
							lastSceneNumber, ret.elements);
					var ntime = this.__parseTime(noteb);
					if (!inComment && ntime.time !== null)
						totalTime = true;

					prefix = "";
					if (!(/^Shot:/).test(noteb))
						prefix = "Shot: ";
					txt += "[[" + prefix + this.__formatNote(noteb) + "]]\n\n";
					var shotNo = "";
					if (ntime.txt.indexOf('.') > -1)
						shotNo = ntime.txt.substring(0, ntime.txt.indexOf('.'));
					ret.model.push({
						type : "note",
						text : ntime.txt,
						time : ntime.time,
						number : shotNo,
						timeW : null,
						timeR : null,
						color : 3,
						inline : false,
						id : id,
						lastSceneIndex : lastSceneIndex,
						lastSectionIndex : lastSectionIndex,
						comment : inComment,
						sceneNumber : lastSceneNumber,
						lastSectionNumber : lastSectionNumber
					});

					if (!inComment) {
						this.__calculateTime("note", idParent, ret.model);
						ret.elements[11] = ret.elements[11] + 1;
					}
				} else if (e.attribs['class'] == 'notegreen') {
					lastId = id;
					var noteg = this.__parseInline(e.children, inComment, true,
							ret.model, "mad" + address, idParent,
							lastSceneNumber, ret.elements);
					prefix = "";
					if (!(/^Res:/).test(noteg))
						prefix = "Res: ";
					txt += "[[" + prefix + this.__formatNote(noteg) + "]]\n\n";
					ret.model.push({
						type : "note",
						text : noteg,
						color : 4,
						inline : false,
						id : id,
						lastSceneIndex : lastSceneIndex,
						lastSectionIndex : lastSectionIndex,
						comment : inComment,
						sceneNumber : lastSceneNumber,
						lastSectionNumber : lastSectionNumber
					});
					if (!inComment) {
						ret.elements[12] = ret.elements[12] + 1;
					}
				}
			} else if (e.name == 'hr') {
				txt += "===\n\n";
				ret.model.push({
					type : "pagebreak",
					comment : inComment,
					lastSceneIndex : lastSceneIndex,
					lastSectionIndex : lastSectionIndex,
					lastId : lastId,
					sceneNumber : lastSceneNumber,
					lastSectionNumber : lastSectionNumber
				});
			}
			ret.indeks.push(ret.model.length - 1);
			address++;
		} else if (e.type == 'text' && e.data.trim() !== "") {
			var akcja = e.data;
			prefix = "";
			if (this.__matchesSceneHeading(akcja)
					|| this.__matchesTransition(akcja)
					|| this.__matchesLyrics(akcja)
					|| this.__matchesSection(akcja)
					|| this.__matchesSynopsis(akcja)) {
				prefix = "!";
			}
			txt += prefix + akcja + "\n\n";
			ret.model.push({
				type : "action",
				text : akcja,
				lastSceneIndex : lastSceneIndex,
				lastSectionIndex : lastSectionIndex,
				lastId : lastId,
				comment : inComment,
				sceneNumber : lastSceneNumber,
				lastSectionNumber : lastSectionNumber
			});
			if (!inComment) {
				ret.elements[3] = ret.elements[3] + 1;
			}
		}
	}
	if (inComment) {
		if (inDialog) {
			txt += "\n";
		}
		txt += "*/\n\n";
	}
	ret.totalTime = this.__propagateTime(ret.model);
	ret.txt = txt;
	ret.hasSections = hasSections;
	return ret;
};

FountainExt.prototype.__parseInline = function(tab, inComment, inNote, model,
		mad, idParent, lastSceneNumber, elements) {
	var tekst = "";
	var note = null;
	var prefix = null;
	if (!mad) {
		mad = null;
	} else {
		mad = mad.toString();
	}
	if (!model)
		model = [];
	for ( var i in tab) {
		var elem = tab[i];
		if (elem.type == 'text') {
			tekst += elem.data;
		} else if (elem.type == 'tag' && elem.name == 'span'
				&& elem.attribs !== undefined) {
			if (elem.attribs['class'] == 'italic') {
				tekst += "*"
						+ this.__parseInline(elem.children, inComment, inNote,
								model, mad + "_" + i, idParent,
								lastSceneNumber, elements) + "*";
			} else if (elem.attribs['class'] == 'bold') {
				tekst += "**"
						+ this.__parseInline(elem.children, inComment, inNote,
								model, mad + "_" + i, idParent,
								lastSceneNumber, elements) + "**";
			} else if (elem.attribs['class'] == 'underline') {
				tekst += "_"
						+ this.__parseInline(elem.children, inComment, inNote,
								model, mad + "_" + i, idParent,
								lastSceneNumber, elements) + "_";
			} else if (elem.attribs['class'] == 'comment') {
				tekst += this.__parseInline(elem.children, inComment, inNote,
						model, mad + "_" + i, idParent, lastSceneNumber,
						elements);
			} else if (elem.attribs['class'] == 'note') {
				note = this.__parseInline(elem.children, inComment, true,
						model, mad + "_" + i, idParent, lastSceneNumber,
						elements);
				if (!inNote) {
					tekst += "[[" + this.__formatNote(note) + "]]";
					model.push({
						type : "note",
						text : note,
						color : 0,
						inline : true,
						id : mad,
						comment : inComment,
						sceneNumber : lastSceneNumber
					});
					if (!inComment) {
						elements[8] = elements[8] + 1;
					}
				} else {
					tekst += note;
				}
			} else if (elem.attribs['class'] == 'noteviolet') {
				note = this.__parseInline(elem.children, inComment, true,
						model, mad + "_" + i, idParent, lastSceneNumber,
						elements);
				if (!inNote) {
					prefix = "";
					if (!(/^\?/).test(note))
						prefix = "? ";
					tekst += "[[" + prefix + this.__formatNote(note) + "]]";
					model.push({
						type : "note",
						text : note,
						color : 1,
						inline : true,
						id : mad,
						comment : inComment,
						sceneNumber : lastSceneNumber
					});
					if (!inComment) {
						elements[9] = elements[9] + 1;
					}
				} else {
					tekst += note;
				}
			} else if (elem.attribs['class'] == 'notered') {
				note = this.__parseInline(elem.children, inComment, true,
						model, mad + "_" + i, idParent, lastSceneNumber,
						elements);
				if (!inNote) {
					prefix = "";
					if (!(/^!/).test(note))
						prefix = "! ";
					tekst += "[[" + prefix + this.__formatNote(note) + "]]";
					model.push({
						type : "note",
						text : note,
						color : 2,
						inline : true,
						id : mad,
						comment : inComment,
						sceneNumber : lastSceneNumber
					});
					if (!inComment) {
						elements[10] = elements[10] + 1;
					}
				} else {
					tekst += note;
				}
			} else if (elem.attribs['class'] == 'noteblue') {
				note = this.__parseInline(elem.children, inComment, true,
						model, mad + "_" + i, idParent, lastSceneNumber,
						elements);
				if (!inNote) {
					var ntime = this.__parseTime(note);
					prefix = "";
					if (!(/^Shot:/).test(note))
						prefix = "Shot: ";
					tekst += "[[" + prefix + this.__formatNote(note) + "]]";
					var shotNo = "";
					if (ntime.txt.indexOf('.') > -1)
						shotNo = ntime.txt.substring(0, ntime.txt.indexOf('.'));
					model.push({
						type : "note",
						text : ntime.txt,
						time : ntime.time,
						number : shotNo,
						timeW : null,
						timeR : null,
						color : 3,
						inline : true,
						id : mad,
						comment : inComment,
						sceneNumber : lastSceneNumber
					});
					if (!inComment && idParent !== undefined)
						this.__calculateTime("note", idParent, model);
					if (!inComment) {
						elements[11] = elements[11] + 1;
					}
				} else {
					tekst += note;
				}
			} else if (elem.attribs['class'] == 'notegreen') {
				note = this.__parseInline(elem.children, inComment, true,
						model, mad + "_" + i, idParent, lastSceneNumber,
						elements);
				if (!inNote) {
					prefix = "";
					if (!(/^Res:/).test(note))
						prefix = "Res: ";
					tekst += "[[" + prefix + this.__formatNote(note) + "]]";
					model.push({
						type : "note",
						text : note,
						color : 4,
						inline : true,
						id : mad,
						comment : inComment,
						sceneNumber : lastSceneNumber
					});
					if (!inComment) {
						elements[12] = elements[12] + 1;
					}
				} else {
					tekst += note;
				}
			} else if (elem.attribs['class'] != 'number') {
				tekst += this.__parseInline(elem.children, inComment, inNote,
						model, mad + "_" + i, idParent, lastSceneNumber,
						elements);
			}
		} else if (elem.type == 'tag' && elem.name == 'span') {
			tekst += this.__parseInline(elem.children, inComment, inNote,
					model, mad + "_" + i, idParent, lastSceneNumber, elements);
		} else if (elem.type == 'tag' && elem.name == 'br') {
			tekst += '\n';
		}
	}
	return tekst.replace(/\n\n/g, "\n");
};

FountainExt.prototype.__parseTime = function(txt) {
	var time = null;
	var s = txt.replace(/(.*?)(\s*)\(([0-9]+):([0-9]+)\)$/, function(a, b, c,
			d, e) {
		time = parseInt(d) * 60 + parseInt(e);
		return b;
	});
	return {
		txt : s,
		time : time
	};
};

FountainExt.prototype.__parseCharacter = function(txt) {
	var ext = null;
	var s = txt.replace(/(.*?)(\s*)(\(.*\)\s*)*$/, function(a, b, c, d, e) {
		ext = d;
		return b;
	});
	return {
		txt : s,
		ext : ext
	};
};

FountainExt.prototype.__secToMin = function(time) {
	if (time != null) {
		time = (Math.floor(parseInt(time) / 60))
				+ ":"
				+ ((parseInt(time) % 60) == 0 ? "00"
						: ((parseInt(time) % 60) <= 9 ? "0"
								+ (parseInt(time) % 60) : (parseInt(time) % 60)));
	}
	return time;
};

FountainExt.prototype.formatTime = function(duration) {
	var hours = Math.floor(duration / 3600);
	var minutes = Math.floor((duration - (hours * 3600)) / 60);
	var seconds = duration - (hours * 3600) - (minutes * 60);

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var time = hours + ':' + minutes + ':' + seconds;
	if (time.indexOf("00:") === 0) {
		time = time.substring(3);
	}
	if (time.indexOf("0") === 0) {
		time = time.substring(1);
	}
	return time;
};

FountainExt.prototype.formatTimeD = function(timeAssigned, timeComputed) {
	if (!timeAssigned) {
		return ((timeComputed > 0) ? (" (" + this.formatTime(timeComputed))
				+ ")" : "");
	}
	if (timeAssigned === timeComputed) {
		return " <span style='color:green;'>(" + this.formatTime(timeAssigned)
				+ ")</span>";
	} else {
		return " ("
				+ this.formatTime(timeAssigned)
				+ ")"
				+ ((timeComputed > 0) ? (" <span style='color:red;'>("
						+ this.formatTime(timeComputed) + ")</span>") : "");
	}
};

FountainExt.prototype.formatTimeDWithoutHtml = function(timeAssigned,
		timeComputed) {
	if (!timeAssigned) {
		return ((timeComputed > 0) ? (" (" + this.formatTime(timeComputed))
				+ ")" : "");
	}
	if (timeAssigned === timeComputed) {
		return "(" + this.formatTime(timeAssigned) + ")";
	} else {
		return " ("
				+ this.formatTime(timeAssigned)
				+ ")"
				+ ((timeComputed > 0) ? ("(" + this.formatTime(timeComputed) + ")")
						: "");
	}
};

FountainExt.prototype.formatTimeR = function(timeAssigned/* time */,
		timeComputed/* timeW */, timeStart/* timeR */) {
	if (timeComputed === null && timeStart === null) {
		return null; // PO 2016-09-23
	}
	// console.log("FountainExt.prototype.formatTimeR", timeAssigned,
	// timeComputed, timeStart);
	return (timeAssigned !== null ? " ("
			+ this.formatTime(timeStart)
			+ "\u00F7"
			+ this
					.formatTime(parseInt((timeAssigned != null ? timeAssigned
							: 0))
							+ parseInt((timeStart != null ? timeStart : 0)))
			+ ")" : (timeComputed != null ? " ("
			+ this.formatTime(timeStart)
			+ "\u00F7"
			+ this
					.formatTime(parseInt((timeComputed != null ? timeComputed
							: 0))
							+ parseInt((timeStart != null ? timeStart : 0)))
			+ ")" : ""));
};

FountainExt.prototype.__formatNote = function(txt) {
	return txt.replace(/\n(\n+)/g, '\n  \n');
};

FountainExt.prototype.__genDate = function() {
	var date = new Date();
	var zp = function(val) {
		return (val <= 9 ? '0' + val : '' + val);
	};
	var d = date.getDate();
	var m = date.getMonth() + 1;
	var y = date.getFullYear();
	return '' + y + '-' + zp(m) + '-' + zp(d);
};

FountainExt.prototype.__matchesSceneHeading = function(txt) {
	return (fountain.regex.scene_heading).test(txt);
};

FountainExt.prototype.__matchesTransition = function(txt) {
	return (fountain.regex.transition).test(txt);
};

FountainExt.prototype.__matchesLyrics = function(txt) {
	return (/^~/).test(txt);
};

FountainExt.prototype.__matchesSection = function(txt) {
	return (/^#/).test(txt);
};

FountainExt.prototype.__matchesSynopsis = function(txt) {
	return (/^=/).test(txt);
};

FountainExt.prototype.__matchesDialog = function(txt) {
	return (fountain.regex.dialogue).test(txt)
			|| (fountain.regex.dialogue2).test(txt);
};

FountainExt.prototype.__createCounter = function() {
	return {
		levelCounters : [ 0, 0, 0, 0 ],
		makeValue : function(level) {
			this.levelCounters[level - 1] = this.levelCounters[level - 1] + 1;
			for (var i = level, j = this.levelCounters.length; i < j; i++) {
				this.levelCounters[i] = 0;
			}
			return this.levelCounters.slice(0, level).join(".");
		}
	};
};

/**
 * Funkcja zwraca uproszczony model scenariusza zawierający elementy określone w
 * parametrach. Funkcja pomija elementy zakomentowane
 * 
 * @param {boolean}
 *            section - Czy mają być widoczne sekcje.
 * @param {boolean}
 *            sectionSynopsis - Czy mają być widoczne streszczenia sekcji.
 *            Parametr synopsis brany jest pod uwagę tylko wtedy kiedy parametr
 *            section ma przypisaną wartość "true" (poprzednio tylko parametr
 *            synopsis).
 * 
 * @Deleted - rozdzielony na sectionSynopsis i sceneSynopsis
 * @param {boolean}
 *            synopsis - Czy mają być widoczne streszczenia sekcji. Parametr
 *            synopsis brany jest pod uwagę tylko wtedy kiedy parametr section
 *            ma przypisaną wartość "true".
 * 
 * @param {boolean}
 *            scene - Czy mają być widoczne sceny.
 * @param {boolean}
 *            sceneSynopsis - Czy mają być widoczne streszczenia scen. Parametr
 *            synopsis brany jest pod uwagę tylko wtedy kiedy parametr scene ma
 *            przypisaną wartość "true" (poprzednio tylko parametr synopsis).
 * @param {boolean}
 *            action - Czy mają być widoczne akcje.
 * @param {boolean}
 *            character - Czy mają być widoczne postacie.
 * @param {boolean}
 *            talk - Czy mają być widoczne dialogi. Parametr talk brany jest pod
 *            uwagę tylko wtedy kiedy parametr character ma przypisaną wartość
 *            "true".
 * @param {boolean}
 *            parenthetical - Czy mają być widoczne nawiasy. Parametr
 *            parenthetical brany jest pod uwagę tylko wtedy kiedy parametr
 *            character ma przypisaną wartość "true".
 * @param {boolean}
 *            transition - Czy mają być widoczne przejścia.
 * @param {array}
 *            notesL - Tablica rodzajów notatek, które mają być widoczne.
 *            Rodzaje notatek są liczbami całkowitymi rozpoczynającymi się od 0.
 * @param {array}
 *            sceneNr - Tablica numerów scen, które mają być brane pod uwagę
 *            przy tworzeniu podmodelu.
 * @param {array}
 *            charactersL - Tablica postaci, których dialogi mają zostać
 *            wyświetlone.
 * @param {boolean}
 *            charAfterComma - Czy postacie występujące po sobie mają być
 *            umieszczone w jednym elemencie (true) (lub w oddzielnych
 *            elementach - false).
 * @param {array}
 *            sceneIndexes - Tablica indeksów scen, które mają być brane pod
 *            uwagę przy tworzeniu podmodelu.
 * @param {string}
 *            sectionNr - Zakres numerów sekcji, które mają być brane pod uwagę
 *            przy tworzeniu podmodelu. Zakres to ciąg znaków, w którym
 *            poszczególne numery scen powinny być oddzielone przecinkami (,) i
 *            zakresy sekcji powinny być oddzielone myślnikiem (-), np.
 *            "1-3.1,7.1". Dla danego numeru brane są również sekcje podrzędne.
 * 
 * @return {array} Uproszczony model scenariusza zawierający elementy określone
 *         w parametrach.
 * 
 * @author Monika Krawętek-Foryś
 * @author Piotr Ożdżyński (podział synopsis na sectionSynopsis i sceneSynopsis)
 *         2016-08
 */
FountainExt.prototype.getSubModel = function(section, sectionSynopsis, scene,
		sceneSynopsis, action, character, talk, parenthetical, transition,
		notesL, sceneNr, charactersL, charAfterComma, sceneIndexes, sectionNr,
		series) {
	var synopsis = sectionSynopsis || sceneSynopsis;
	// console.log(arguments); // FIXME: sprawdzić jak jest przekazywany filtr
	// sekcji i scen (tablica czy string)

	var charactersToPrint = [];
	var subModel = [];
	// var indexes = sceneNr;
	if (this.model != null) {
		// sprawdza, czy element modelu jest w wybranej sekcji, jeżeli wybrano
		// sekcje w filtrze (chyba, (PO))
		for (var i = 0; i < this.model.length; i++) {
			if (!this.model[i].comment
					&& ((sectionNr !== null && sectionNr.length > 0 && ((this.model[i].lastSectionNumber !== undefined
							&& this.model[i].lastSectionNumber !== null && this
							.checkSection(sectionNr,
									this.model[i].lastSectionNumber)) || (this.model[i].sectionNumber !== undefined
							&& this.model[i].sectionNumber !== null && this
							.checkSection(sectionNr,
									this.model[i].sectionNumber)))) || (sectionNr == null || sectionNr.length <= 0))) {
				if (section) {
					if (this.model[i].type == "section") {
						if (charactersToPrint.length > 0) {
							if (charAfterComma) {
								subModel.push({
									type : "characters",
									name : charactersToPrint.toString()
											.replace(/,/g, ", ")
								});
							}
							charactersToPrint = [];
						}
						// numer = numerator.makeValue(this.model[i].depth);
						subModel.push({
							type : this.model[i].type,
							text : this.model[i].text,
							time : this.model[i].time,
							timeW : this.model[i].timeW,
							timeR : this.model[i].timeR,
							depth : this.model[i].depth,
							number : this.model[i].sectionNumber,
							id : this.model[i].id,
							lastSceneIndex : this.model[i].lastSceneIndex,
							lastId : this.model[i].lastId,
						});

						continue;
					}
					if (sectionSynopsis && this.model[i].type == "synopsis"
							&& this.model[i].sceneNumber == null)//
					{
						if (charactersToPrint.length > 0) {
							if (charAfterComma) {
								subModel.push({
									type : "characters",
									name : charactersToPrint.toString()
											.replace(/,/g, ", ")
								});
							}
							charactersToPrint = [];
						}
						subModel.push({
							type : this.model[i].type,
							text : this.model[i].text,
							lastSceneIndex : this.model[i].lastSceneIndex,
							lastId : this.model[i].lastId,
						});

						continue;
					}
				} // end if section
				else if (series) {
					if (this.model[i].type == "section"
							&& this.model[i].depth == "1") {
						if (charactersToPrint.length > 0) {
							if (false && charAfterComma) { // tymczasowo
								// zablokowane, może
								// do usunięcia
								subModel.push({
									type : "characters",
									name : charactersToPrint.toString()
											.replace(/,/g, ", ")
								});
							}
							charactersToPrint = [];
						}
						subModel.push({
							type : this.model[i].type,
							text : this.model[i].text,
							time : this.model[i].time,
							timeW : this.model[i].timeW,
							timeR : this.model[i].timeR,
							depth : this.model[i].depth,
							number : this.model[i].sectionNumber,
							id : this.model[i].id,
							lastSceneIndex : this.model[i].lastSceneIndex,
							lastId : this.model[i].lastId,
						});

						continue;
					}
				}

				// sprawdza, czy element modelu jest w wybranej scenie, jeżeli
				// wybrano sceny w filtrze
				if (((sceneNr != null && sceneNr.length > 0 && ((this.model[i].number !== undefined
						&& this.model[i].number !== null && this.checkScene(
						sceneNr, this.model[i].number)) || (this.model[i].sceneNumber !== undefined
						&& this.model[i].sceneNumber !== null && this
						.checkScene(sceneNr, this.model[i].sceneNumber)))) || (sceneNr == null || sceneNr.length <= 0))
						&& !(sceneIndexes != null && sceneIndexes.length > 0 && ((this.model[i].lastSceneIndex !== undefined && sceneIndexes
								.indexOf(this.model[i].lastSceneIndex) < 0)))) {
					if (scene && this.model[i].type == "scene") {
						if (charactersToPrint.length > 0) {
							if (charAfterComma) {
								subModel.push({
									type : "characters",
									name : charactersToPrint.toString()
											.replace(/,/g, ", ")
								});
							}
							charactersToPrint = [];
						}
						subModel
								.push({
									type : this.model[i].type,
									text : this.model[i].text,
									time : this.model[i].time,
									timeW : this.model[i].timeW,
									timeR : this.model[i].timeR,
									number : this.model[i].number,
									id : this.model[i].id,
									lastSceneIndex : this.model[i].lastSceneIndex,
									lastId : this.model[i].lastId,
									lastSectionName : this.model[i].lastSectionName,
									lastSectionNumber : this.model[i].lastSectionNumber,
								});

						continue;
					}

					if (sceneSynopsis && this.model[i].type == "synopsis"
							&& this.model[i].sceneNumber != null) {
						if (charactersToPrint.length > 0) {
							if (charAfterComma) {
								subModel.push({
									type : "characters",
									name : charactersToPrint.toString()
											.replace(/,/g, ", ")
								});
							}
							charactersToPrint = [];
						}
						subModel.push({
							type : this.model[i].type,
							text : this.model[i].text,
							lastSceneIndex : this.model[i].lastSceneIndex,
							lastId : this.model[i].lastId,
						});
						continue;
					}

					if (action
							&& (this.model[i].type == "action"
									|| this.model[i].type == "centered" || this.model[i].type == "lyrics")) {
						if (charactersToPrint.length > 0) {
							if (charAfterComma) {
								subModel.push({
									type : "characters",
									name : charactersToPrint.toString()
											.replace(/,/g, ", ")
								});
							}
							charactersToPrint = [];
						}
						subModel.push({
							type : this.model[i].type,
							text : this.model[i].text,
							lastSceneIndex : this.model[i].lastSceneIndex,
							lastId : this.model[i].lastId,
						});
						continue;
					}

					if (character
							&& ((charactersL !== null && charactersL.length > 0 && (((charactersL
									.indexOf(this.model[i].character) >= 0) && this.model[i].type == "dialogue") || ((charactersL
									.indexOf(this.model[i].name) >= 0) && this.model[i].type == "character"))) || (charactersL === null || charactersL.length <= 0))) {
						if (this.model[i].type == "character") {
							if (charactersToPrint.length === 0
									|| (charactersToPrint.length > 0 && (charactersToPrint
											.indexOf(this.model[i].name) < 0 && charactersToPrint
											.indexOf(this.model[i].name + "*") < 0))) {
								charactersToPrint.push(this.model[i].name
										+ (this.model[i].first === "1" ? "*"
												: ""));
								if (!charAfterComma && !talk) {
									subModel.push({
										type : "characters",
										name : this.model[i].name
									});
								}
							}
							subModel.push({
								type : "character",
								name : this.model[i].name,
								ext : this.model[i].ext,
								dual : this.model[i].dual,
								id : this.model[i].id,
								lastSceneIndex : this.model[i].lastSceneIndex,
								lastId : this.model[i].lastId,
							});

							continue;
						}

						if (parenthetical
								&& this.model[i].type == "parenthetical") {
							subModel.push({
								type : this.model[i].type,
								text : this.model[i].text,
								lastSceneIndex : this.model[i].lastSceneIndex,
								lastId : this.model[i].lastId,
							});
							continue;
						}

						if (talk && this.model[i].type == "dialogue") {
							subModel.push({
								type : this.model[i].type,
								text : this.model[i].text,
								character : this.model[i].character,
								lastSceneIndex : this.model[i].lastSceneIndex,
								lastId : this.model[i].lastId,
							});
						}
					}

					if (transition && this.model[i].type == "transition") {
						if (charactersToPrint.length > 0) {
							if (charAfterComma) {
								subModel.push({
									type : "characters",
									name : charactersToPrint.toString()
											.replace(/,/g, ", ")
								});
							}
							charactersToPrint = [];
						}
						subModel.push({
							type : this.model[i].type,
							text : this.model[i].text,
							lastSceneIndex : this.model[i].lastSceneIndex,
							lastId : this.model[i].lastId,
						});
						continue;
					}

					if (this.model[i].type == "note" && !this.model[i].inline
							&& notesL != null) {
						if (notesL.indexOf(this.model[i].color) >= 0) {
							if (charactersToPrint.length > 0) {
								if (charAfterComma) {
									subModel.push({
										type : "characters",
										name : charactersToPrint.toString()
												.replace(/,/g, ", ")
									});
								}
								charactersToPrint = [];
							}
							if (this.model[i].color == 3) {
								subModel
										.push({
											type : this.model[i].type,
											text : this.model[i].text,
											time : this.model[i].time,
											timeW : this.model[i].timeW,
											timeR : this.model[i].timeR,
											color : this.model[i].color,
											id : this.model[i].id,
											lastSceneIndex : this.model[i].lastSceneIndex,
											lastId : this.model[i].lastId,
										});
							} else {
								subModel
										.push({
											type : this.model[i].type,
											text : this.model[i].text,
											color : this.model[i].color,
											id : this.model[i].id,
											lastSceneIndex : this.model[i].lastSceneIndex,
											lastId : this.model[i].lastId,
										});
							}
						}
					}
					if (this.model[i].type == "pagebreak") {
						if (charactersToPrint.length > 0) {
							if (charAfterComma) {
								subModel.push({
									type : "characters",
									name : charactersToPrint.toString()
											.replace(/,/g, ", ")
								});
							}
							charactersToPrint = [];
						}
						subModel.push({
							type : "pagebreak",
							lastSceneIndex : this.model[i].lastSceneIndex,
							lastId : this.model[i].lastId,
						});
					}
				} // end sceneNr selection
			}
		}// end for
		if (charAfterComma && charactersToPrint.length > 0) {
			subModel.push({
				type : "characters",
				name : charactersToPrint.toString().replace(/,/g, ", ")
			});
		}
	} // end if(this.model != null)
	// console.log("model", JSON.stringify(this.model));
	// console.log("subModel", JSON.stringify(subModel));
	return subModel;
};

/**
 * Funkcja zwraca tablicę numerów scen na podstawie podanego łańcucha znaków.
 * 
 * @param {string}
 *            sceneNr - Zakres numerów scen w postaci ciągu znaków, w którym
 *            poszczególne numery scen powinny być oddzielone przecinkami (,) i
 *            zakresy scen powinny być oddzielone myślnikiem (-), np. "1-3,7").
 * 
 * @return {array} Tablica numerów scen.
 * 
 * @author Monika Krawętek-Foryś
 */
FountainExt.prototype.getSceneNrArray = function(sceneNr) {
	var error = 0;
	var indexes = [];
	if (sceneNr != null && sceneNr.length > 0) {
		var sceneNrA = sceneNr.split(",");
		for (var s1 = 0; s1 < sceneNrA.length; s1++) {
			var sceneNrP = sceneNrA[s1].trim().split("-");
			if (sceneNrP.length == 2) {
				if (!isNaN(sceneNrP[0].trim())
						&& !isNaN(sceneNrP[1].trim())
						&& (parseInt(sceneNrP[1].trim()) > parseInt(sceneNrP[0]
								.trim()))) {
					for (var s2 = parseInt(sceneNrP[0].trim()); s2 <= parseInt(sceneNrP[1]
							.trim()); s2++) {
						if (indexes.indexOf(s2) < 0) {
							indexes.push(s2.toString());
						}
					}
				} else {
					error = 1;
				}
			} else if (sceneNrP.length == 1) {
				if (!isNaN(sceneNrA[s1].trim())) {
					if (indexes.indexOf(parseInt(sceneNrA[s1].trim())) < 0) {
						indexes.push(sceneNrA[s1].trim());
					}
				} else {
					error = 1;
				}
			} else {
				error = 1;
			}
		}
		if (error == 1) {
			console.log("Incorrect scene numbers format!");
		}
	}
	return indexes;

};

/**
 * Funkcja sprawdza czy podany numer sceny zawiera się w podanym zakresie
 * numerów scen.
 * 
 * @param {string}
 *            sceneNr - Zakres numerów scen w postaci ciągu znaków, w którym
 *            poszczególne numery scen powinny być oddzielone przecinkami (,) i
 *            zakresy scen powinny być oddzielone myślnikiem (-), np. "1-3,7".
 * @param {string}
 *            scene - Numer sceny przeznaczony do sprawdzenia.
 * 
 * @return {boolena} W zależności od tego czy podany numer scney znajduje się w
 *         podanym zakresie scen czy nie funkcja zwraca true bądź false.
 * 
 * @author Monika Krawętek-Foryś
 */
FountainExt.prototype.checkScene = function(sceneNr, scene) {
	var error = 0;
	var result = false;
	if (isNaN(scene.trim())) {
		var regex = /(\d+)/g;
		var arrayNum = scene.match(regex);
		if (arrayNum != null && arrayNum.length > 0) {
			scene = arrayNum[0];
		}
	}
	if (sceneNr != null && sceneNr.length > 0 && !isNaN(scene.trim())) {
		var sceneF = parseInt(scene.trim());
		var sceneNrA = sceneNr.split(",");
		for (var s1 = 0; s1 < sceneNrA.length; s1++) {
			var sceneNrP = sceneNrA[s1].trim().split("-");
			if (sceneNrP.length == 2) {
				if (!isNaN(sceneNrP[0].trim()) && !isNaN(sceneNrP[1].trim())) {
					var from = parseInt(sceneNrP[0].trim());
					var to = parseInt(sceneNrP[1].trim());
					result = result || ((sceneF >= from) && (sceneF <= to));
				} else {
					error = 1;
				}
			} else if (sceneNrP.length == 1) {
				if (!isNaN(sceneNrA[s1].trim())) {
					result = result
							|| (parseInt(sceneNrA[s1].trim()) === sceneF);
				} else {
					error = 1;
				}
			} else {
				error = 1;
			}
		}
		if (error == 1) {
			console.log("Incorrect scene numbers format!");
		}
	}
	return result;
};

/**
 * Funkcja zwraca opis numerów na podstawie podanej tablicy numerów.
 * 
 * @param {array}
 *            numberT - Tablica numerów.
 * 
 * @return {string} opis numerów.
 * 
 * @author Monika Krawętek-Foryś
 */
FountainExt.prototype.getNumberDescription = function(numberT) {
	var description = "";
	var pom = 0;
	if (numberT != null && numberT.length > 0) {
		var numberSort = numberT.sort(function(a, b) {
			return a - b;
		});
		description += numberSort[0];
		for (var i = 1; i < numberSort.length; i++) {
			if ((parseInt(numberSort[i - 1]) + 1) == numberSort[i]) {
				pom = numberSort[i];
			} else {
				if (pom > 0) {
					description += "-" + pom + "," + numberSort[i];
					pom = 0;
				} else {
					description += "," + numberSort[i];
				}
			}
		}
		if (pom > 0) {
			description += "-" + pom + ",";
		} else {
			description += ",";
		}
	}
	return description.substr(0, description.length - 1);

};

/**
 * Funkcja zwraca tablicę numerów sekcji, w której występują podane postacie.
 * 
 * @param {array}
 *            charactersL - Tablica postaci.
 * 
 * @return {array} Tablica numerów sekcji, w której występują podane postacie.
 * 
 * @author Monika Krawętek-Foryś
 */
FountainExt.prototype.getSectionsCharacters = function(charactersL) {
	var sections = [];
	this.model.filter(
			function(item) {
				return (item.type === "character" && charactersL
						.indexOf(item.name) >= 0);
			}).forEach(
			function(item) {
				if (item.lastSectionNumber !== null
						&& item.lastSectionNumber.length > 0
						&& sections.indexOf(item.lastSectionNumber) < 0) {
					sections.push(item.lastSectionNumber);
				}
			});
	return sections;
};


/**
 * @Deorecated - zmieniona wersja przeniesiona do SceneInPlacesPanel
 * Funkcja ma zwracać tablicę numerów scen, które są realizowane w podanych
 * miejscach. Teraz nie działa
 * 
 * @param {array}
 *            places - Tablica nazw miejsc.
 * 
 * @return {array} Tablica numerów scen, które są realizowane w podanych
 *         miejscach
 * 
 * @author Piotr Ożdżyński
 */


FountainExt.prototype.getScenesPlaces = function(places) {
	var scenes = [];
	places = places.map(function(place) {
		return place.replace(/\W/g, '');
	});
	this.model
			.filter(
					function(item) {
						return (item.type === "scene" && !!item.number && item.number.length > 0);
					}).forEach(function(item) {
				var sceneText = item.text.replace(/\W/g, '');
				var inSelection = places.some(function(place) {
					const
					p = sceneText.indexOf(place);
					return p >= 0 && p < 8;
				});
				if (inSelection) {
					scenes.push(item.number);
				}
			});
	return scenes;
};

/**
 * Funkcja zwraca tablicę numerów scen, w której występują podane postacie.
 * 
 * @param {array}
 *            charactersL - Tablica postaci.
 * 
 * @return {array} Tablica numerów scen, w której występują podane postacie.
 * 
 * @author Monika Krawętek-Foryś
 */
FountainExt.prototype.getScenesCharacters = function(charactersL) {
	var scenes = [];
	this.model.filter(
			function(item) {
				return (item.type === "character" && charactersL
						.indexOf(item.name) >= 0);
			}).forEach(
			function(item) {
				if (item.sceneNumber !== null && item.sceneNumber.length > 0
						&& scenes.indexOf(item.sceneNumber) < 0) {
					scenes.push(item.sceneNumber);
				}
			});
	return scenes;
};

/**
 * Funkcja zwraca tablicę indeksów scen, w której występują podane postacie.
 * 
 * @param {array}
 *            charactersL - Tablica postaci.
 * 
 * @return {array} Tablica indeksów scen, w której występują podane postacie.
 * 
 * @author Monika Krawętek-Foryś
 */
FountainExt.prototype.getScenesIndexCharacters = function(charactersL) {
	var scenes = [];
	this.model.filter(
			function(item) {
				return (item.type === "character" && charactersL
						.indexOf(item.name) >= 0);
			}).forEach(
			function(item) {
				if (item.lastSceneIndex !== null
						&& scenes.indexOf(item.lastSceneIndex) < 0) {
					scenes.push(item.lastSceneIndex);
				}
			});
	return scenes;
};

/**
 * Funkcja zwraca numer sekcji w formacie 000.000.000.
 * 
 * @param {string}
 *            number - Numer sekcji.
 * 
 * @return {string} Numer sekcji w formacie 000.000.000.
 * 
 * @author Monika Krawętek-Foryś
 */
FountainExt.prototype.getSectionNumberFormat = function(number) {
	var sectionN = [];
	(number + Array(3).join('.0')).split('.').slice(0, 3).forEach(
			function(item) {
				sectionN.push((Array(3).join("0") + item).slice(-3));
			});
	return sectionN.join(".");
};

/**
 * Funkcja sprawdza czy podany numer sekcji zawiera się w podanym zakresie
 * numerów sekcji.
 * 
 * @param {string}
 *            sectionNr - Zakres numerów sekcji w postaci ciągu znaków, w którym
 *            poszczególne numery sekcji powinny być oddzielone przecinkami (,)
 *            i zakresy sekcji powinny być oddzielone myślnikiem (-), np.
 *            "1-3.1,7.1". Dla danego numeru brane są również sekcje podrzędne.
 * @param {string}
 *            section - Numer sekcji przeznaczony do sprawdzenia.
 * 
 * @return {boolena} W zależności od tego czy podany numer sekcji znajduje się w
 *         podanym zakresie sekcji czy nie funkcja zwraca true bądź false.
 * 
 * @author Monika Krawętek-Foryś
 */
FountainExt.prototype.checkSection = function(sectionNr, section) {
	var result = false;
	if (sectionNr != null && sectionNr.length > 0) {
		var sectionNrA = sectionNr.split(",");
		for (var s1 = 0; s1 < sectionNrA.length; s1++) {
			var sectionNrP = sectionNrA[s1].trim().split("-");
			var sectionF = this.getSectionNumberFormat(section.trim());
			if (sectionNrP.length == 2) {
				var from = this.getSectionNumberFormat(sectionNrP[0].trim());
				var to = this.getSectionNumberFormat(sectionNrP[1].trim());
				result = result
						|| (((sectionF > from) || (sectionF == from)) && ((sectionF < to) || ((section + ".")
								.match(new RegExp("^" + sectionNrP[1].trim()
										+ '\\.')))));
			} else if (sectionNrP.length == 1) {
				var war10 = (section + ".").match(new RegExp('^'
						+ sectionNrA[s1].trim() + '\\.'));
				result = result || (war10 != null && war10.length > 0);
			}
		}
	}
	return result;
};

// Do skasowania
/**
 * Funkcja zwraca HTML na podstawie uproszczonego modelu scenariusza.
 * 
 * @param {array}
 *            model - Uproszczony model danych.
 * @param {boolean}
 *            character - Czy wyświetlać postać przy dialogach.
 * @param {boolean}
 *            time - Czy wyświetlać czas scen, sekcji, ujęć.
 * @param {boolean}
 *            timeR - Czy wyświetlać czas narastająco scen, sekcji, ujęć.
 * 
 * @return {string} HTML.
 * 
 * @author Monika Krawętek-Foryś
 */
FountainExt.prototype.getHtmlFromModel = function(model, character, time, timeR) {
	var token, html = [];
	var formatTime = "";
	var formatTimeR = "";
	if (model != null) {
		i = model.length;
		while (i--) {
			token = model[i];
			token.text = this.__inlineLexer(token.text, token.type, null);
			switch (token.type) {
			case 'scene':
				if (time) {
					formatTime = this.formatTimeD(token.time, token.timeW);
				}
				if (timeR) {
					formatTimeR = this.formatTimeR(token.time, token.timeW,
							token.timeR);
				}
				html
						.push('<h3> <span class=\"numberr\">'
								+ (token.number ? token.number : '&nbsp;')
								+ '</span>&nbsp;'
								+ token.text
								+ (formatTime != null && formatTime.length > 0 ? '<span class=\"time\">'
										+ formatTime + '</span>'
										: '')
								+ (formatTimeR != null
										&& formatTimeR.length > 0 ? '<span class=\"time\">'
										+ formatTimeR + '</span>'
										: '') + '</h3>');
				timeToSec = "";
				break;
			case 'characters':
				html.push('<h4 class=\"characters\">' + token.name + '</h4>');
				break;
			case 'dialogue':
				if (character) {
					html.push('<div class=\"talk\">' + token.text + '</div>');
					html.push('<h4 class=\"dialog\">' + token.character
							+ '</h4>');
				} else {
					html.push('<div class=\"talkr\">' + token.text + '</div>');
				}
				break;
			case 'parenthetical':
				html.push('<div class=\"parenthetical\">' + token.text
						+ '</div>');
				break;
			case 'transition':
				html.push('<h2>' + token.text + '</h2>');
				break;
			case 'section':
				if (time) {
					formatTime = this.formatTimeD(token.time, token.timeW);
				}
				if (timeR) {
					formatTimeR = this.formatTimeR(token.time, token.timeW,
							token.timeR);
				}
				html
						.push('<h1 data-depthr=\"'
								+ token.depth
								+ '\">'
								+ token.number
								+ ". "
								+ token.text
								+ (formatTime != null && formatTime.length > 0 ? '<span class=\"time\">'
										+ formatTime + '</span>'
										: '')
								+ (formatTimeR != null
										&& formatTimeR.length > 0 ? '<span class=\"time\">'
										+ formatTimeR + '</span>'
										: '') + '</h1>');
				timeToSec = "";
				break;
			case 'synopsis':
				html.push('<h5>' + token.text + '</h5>');
				break;
			case 'action':
				html.push('<p>' + token.text + '</p>');
				break;
			case 'note':
				switch (token.color) {
				case 0:
					html.push('<div class="note">' + token.text + '</div>');
					break;
				case 3:
					if (time) {
						formatTime = this.formatTimeD(token.time, token.timeW);
					}
					if (timeR) {
						formatTimeR = this.formatTimeR(token.time, token.timeW,
								token.timeR);
					}
					html
							.push('<div class="noteblue">'
									+ token.text
									+ (formatTime != null
											&& formatTime.length > 0 ? '<span class=\"time\">'
											+ formatTime + '</span>'
											: '')
									+ (formatTimeR != null
											&& formatTimeR.length > 0 ? '<span class=\"time\">'
											+ formatTimeR + '</span>'
											: '') + '</div>');
					timeToSec = "";
					break;
				case 4:
					html
							.push('<div class="notegreen">' + token.text
									+ '</div>');
					break;
				case 1:
					html.push('<div class="noteviolet">' + token.text
							+ '</div>');
					break;
				case 2:
					html.push('<div class="notered">' + token.text + '</div>');
					break;
				}
				break;
			}
		}
	}
	return html.reverse().join('');
};

/**
 * Funkcja zwraca HTML na podstawie uproszczonego modelu scenariusza.
 * 
 * @param {array}
 *            model - Uproszczony model danych.
 * @param {array}
 *            notesL - Tablica rodzajów notatek, które mają być widoczne.
 *            Rodzaje notatek są liczbami całkowitymi rozpoczynającymi się od 0.
 * @param {boolean}
 *            character - Czy wyświetlać postać przy dialogach.
 * @param {boolean}
 *            time - Czy wyświetlać czas scen, sekcji, ujęć.
 * @param {boolean}
 *            timeR - Czy wyświetlać czas narastająco scen, sekcji, ujęć.
 * 
 * @return {string} HTML.
 * 
 * @author Robert Jaros
 */
FountainExt.prototype.getViewHtmlFromModel = function(model, notesL, character,
		time, timeR) {
	var token, html = [];
	var formatTime = "";
	var formatTimeR = "";
	var isDialog = false;
	var isHeader = false;
	var isSectHeader = false;
	var i = 0;
	if (model != null) {
		while (i < model.length) {
			token = model[i];
			token.text = this.__inlineLexer(token.text, token.type, notesL);
			var ids = "";
			if (token.id !== undefined) {
				ids = ' id="' + token.id + '"';
			} else {
				ids = ' id="' + token.lastId + '"';
			}
			switch (token.type) {
			case 'scene':
				if (isDialog)
					html.push("</div>");
				if (isHeader)
					html.push("</div>");
				if (isSectHeader)
					html.push("</div>");
				isDialog = false;
				isHeader = false;
				isSectHeader = false;
				if (time) {
					formatTime = this.formatTimeD(token.time, token.timeW);
				}
				if (timeR) {
					formatTimeR = this.formatTimeR(token.time, token.timeW,
							token.timeR);
				}
				html.push('<div class=\"noPageBreak\">');
				html
						.push('<h3'
								+ ids

								+ (token.number !== "" ? " style='text-indent: -"
										+ (token.number.length + 2)
										+ "ch;'>"
										+ token.number + '.&nbsp;'
										: '>') // badawczo
								// wywalam
								// jeden &nbsp;
								+ token.text
								+ (formatTime != null && formatTime.length > 0 ? '<span class=\"time\">'
										+ formatTime + '</span>'
										: '')
								+ (formatTimeR != null
										&& formatTimeR.length > 0 ? '<span class=\"time\">'
										+ formatTimeR + '</span>'
										: '') + '</h3>');
				isHeader = true;
				timeToSec = "";
				break;
			case 'character':
				if (character) {
					if (isSectHeader)
						html.push("</div>");
					isSectHeader = false;
					if (isDialog)
						html.push("</div>");
					html.push('<div class=\"noPageBreak'
							+ (token.dual ? ' dialogright' : '') + '\">');
					if (token.dual) {
						for (var jj = html.length - 1; jj >= 0; jj--) {
							if (html[jj] == '<div class=\"noPageBreak\">') {
								html[jj] = '<div class=\"noPageBreak dialog\">';
								break;
							}
							if (html[jj] == '<div class=\"noPageBreak dialog\">') {
								break;
							}
						}
					}
					html.push('<h4' + ids + ' class=\"dialog\">' + token.name
							+ (token.ext !== undefined ? ' ' + token.ext : '')
							+ '</h4>');
					isDialog = true;
				}
				break;
			case 'characters':
				// wykluczenie podwójnego wyświetlania postaci w Podglądzie
				// Scenariusza
				if (!character) {
					html.push('<h4' + ids + ' class=\"characters\">'
							+ token.name + '</h4>');
				}
				break;
			case 'dialogue':
				if (isSectHeader)
					html.push("</div>");
				isSectHeader = false;
				if (character) {
					html.push('<div' + ids + ' class=\"talk\">' + token.text
							+ '</div>');
				} else {
					html.push('<div' + ids + ' class=\"talkr\">' + token.text
							+ '</div>');
				}
				if (isHeader)
					html.push("</div>");
				isHeader = false;
				break;
			case 'parenthetical':
				if (isSectHeader)
					html.push("</div>");
				isSectHeader = false;
				html.push('<div' + ids + ' class=\"parenthetical\">('
						+ token.text + ')</div>');
				break;
			case 'transition':
				if (isDialog)
					html.push("</div>");
				if (isHeader)
					html.push("</div>");
				if (isSectHeader)
					html.push("</div>");
				isDialog = false;
				isHeader = false;
				isSectHeader = false;
				html.push('<h2' + ids + '>' + token.text + '</h2>');
				break;
			case 'section':
				if (isDialog)
					html.push("</div>");
				if (isHeader)
					html.push("</div>");
				if (isSectHeader)
					html.push("</div>");
				isDialog = false;
				isHeader = false;
				isSectHeader = false;
				if (time) {
					formatTime = this.formatTimeD(token.time, token.timeW);
				}
				if (timeR) {
					formatTimeR = this.formatTimeR(token.time, token.timeW,
							token.timeR);
				}
				html.push('<div class=\"noPageBreak\">');
				html
						.push('<h1'
								+ ids
								+ ' data-depth=\"'
								+ token.depth
								+ '\">'
								+ token.number
								+ ". "
								+ token.text
								+ (formatTime != null && formatTime.length > 0 ? '<span class=\"time\">'
										+ formatTime + '</span>'
										: '')
								+ (formatTimeR != null
										&& formatTimeR.length > 0 ? '<span class=\"time\">'
										+ formatTimeR + '</span>'
										: '') + '</h1>');
				isSectHeader = true;
				timeToSec = "";
				break;
			case 'synopsis':
				if (isDialog)
					html.push("</div>");
				if (isHeader)
					html.push("</div>");
				isDialog = false;
				isHeader = false;
				html.push('<h5' + ids + '>' + token.text + '</h5>');
				if (isSectHeader) {
					html.push("</div>");
					isSectHeader = false;
				}
				break;
			case 'action':
				if (isDialog)
					html.push("</div>");
				if (isSectHeader)
					html.push("</div>");
				isDialog = false;
				isSectHeader = false;
				html.push('<p' + ids + ' class=\"noPageBreak\">' + token.text
						+ '</p>');
				if (isHeader) {
					html.push("</div>");
					isHeader = false;
				}
				break;
			case 'centered':
				if (isDialog)
					html.push("</div>");
				if (isSectHeader)
					html.push("</div>");
				isSectHeader = false;
				isDialog = false;
				html.push('<div' + ids + ' class=\"centered\">' + token.text
						+ '</div>');
				if (isHeader) {
					html.push("</div>");
					isHeader = false;
				}
				break;
			case 'lyrics':
				if (isDialog)
					html.push("</div>");
				if (isHeader)
					html.push("</div>");
				if (isSectHeader)
					html.push("</div>");
				isDialog = false;
				isHeader = false;
				isSectHeader = false;
				html.push('<div' + ids + ' class=\"lyrics\">' + token.text
						+ '</div>');
				break;
			case 'pagebreak':
				if (isDialog)
					html.push("</div>");
				if (isHeader)
					html.push("</div>");
				if (isSectHeader)
					html.push("</div>");
				isDialog = false;
				isHeader = false;
				isSectHeader = false;
				html.push('<hr' + ids + ' />');
				break;
			case 'note':
				if (isDialog)
					html.push("</div>");
				if (isHeader)
					html.push("</div>");
				if (isSectHeader)
					html.push("</div>");
				isDialog = false;
				isHeader = false;
				isSectHeader = false;
				switch (token.color) {
				case 0:
					html.push('<div' + ids + ' class="note">' + token.text
							+ '</div>');
					break;
				case 3:
					if (time) {
						formatTime = this.formatTimeD(token.time, token.timeW);
					}
					if (timeR) {
						formatTimeR = this.formatTimeR(token.time, token.timeW,
								token.timeR);
					}
					html
							.push('<div'
									+ ids
									+ ' class="noteblue">'
									+ token.text
									+ (formatTime != null
											&& formatTime.length > 0 ? '<span class=\"time\">'
											+ formatTime + '</span>'
											: '')
									+ (formatTimeR != null
											&& formatTimeR.length > 0 ? '<span class=\"time\">'
											+ formatTimeR + '</span>'
											: '') + '</div>');
					timeToSec = "";
					break;
				case 4:
					html.push('<div' + ids + ' class="notegreen">' + token.text
							+ '</div>');
					break;
				case 1:
					html.push('<div' + ids + ' class="noteviolet">'
							+ token.text + '</div>');
					break;
				case 2:
					html.push('<div' + ids + ' class="notered">' + token.text
							+ '</div>');
					break;
				}
				break;
			}
			i++;
		}
	}
	if (isDialog)
		html.push("</div>");
	if (isHeader)
		html.push("</div>");
	if (isSectHeader)
		html.push("</div>");
	return html.join('');
};

FountainExt.prototype.__inlineLexer = function(s, type, notesL) {
	if (!s) {
		return;
	}
	if (type == 'action' || type == 'scene' || type == 'section'
			|| type == 'dialogue')
		s = s.replace(/ ( +)/g, function(a, b) {
			return "&nbsp;" + b.replace(/ /g, '&nbsp;');
		});
	var styles = [ 'underline', 'italic', 'bold', 'bold_italic',
			'italic_underline', 'bold_underline', 'bold_italic_underline' ], i = styles.length, style, match;

	s = s.replace(fountain.regex.note_inline, function(a, b) {
		var type = "note";
		var ret = b.replace(/&nbsp;/, ' ');
		var rodzaj = 0;
		if ((/^Shot: /).test(ret)) {
			type = "noteblue", ret = ret.substring(6);
			rodzaj = 3;
		} else if ((/^Res: /).test(ret)) {
			type = "notegreen", ret = ret.substring(5);
			rodzaj = 4;
		} else if ((/^\? /).test(ret)) {
			type = "noteviolet", ret = ret.substring(2);
			rodzaj = 1;
		} else if ((/^! /).test(ret)) {
			type = "notered", ret = ret.substring(2);
			rodzaj = 2;
		}
		if (notesL !== null && notesL.indexOf(rodzaj) >= 0) {
			return '<span class="' + type + '">' + ret + '</span>';
		} else {
			return '';
		}
	});

	s = s.replace(/\\\*/g, '[star]').replace(/\\_/g, '[underline]').replace(
			/\n/g, fountain.inline.line_break);

	while (i--) {
		style = styles[i];
		match = fountain.regex[style];

		if (match.test(s)) {
			s = s.replace(match, fountain.inline[style]);
		}
	}

	return s.replace(/\[star\]/g, '*').replace(/\[underline\]/g, '_');
};

/**
 * Funkcja zwraca numer ostatniej sceny przed podanym numerem sekcji.
 * 
 * @param {string}
 *            section - Numer sekcji.
 * 
 * @return {string} Numer ostatniej sceny przed przed podanym numerem sekcji.
 * 
 * @author Monika Krawętek-Foryś
 */
FountainExt.prototype.getSceneNBeforeSection = function(section) {
	if (section !== null && section.length > 0) {
		var sectionO = null;
		sectionO = this.model.filter(function(item) {
			return (item.type === "section" && item.sectionNumber === section
					.trim());
		});
		if (sectionO !== null && section.length > 0) {
			var index = sectionO[0].lastSectionIndex;
			for (var i = (index - 1); i >= 0; i--) {
				if (this.model[i].type === "scene"
						&& this.model[i].number !== null
						&& this.model[i].number.length > 0
						&& !isNaN(this.model[i].number.trim())
						&& !this.model[i].comment) {
					return parseInt(this.model[i].number.trim(), 10);
				}
			}
		}
	}
	return 0;
};

/**
 * Funkcja zwraca informację na temat scen z całego scenariusza bądź z podanej
 * sekcji.
 * 
 * @param {string}
 *            section - Numer sekcji (parametr opcjonalny). W przypadku nie
 *            podania numeru sceny brany jest pod uwagę cały scenariusz.
 * 
 * @return {object} Zwracany obiekt zawiera następujące informacje:
 *         scenesStandard - tablicę numerów scen standardowych, scenesNotNumber -
 *         liczbę scen nie ponumerowanych, scenesNotStandard - tablicę numerów
 *         scen niestandardowych count - liczbę wszystkich scen scenesModel -
 *         uproszczony model scenariusza ograniczony do scen .
 * 
 * @author Monika Krawętek-Foryś
 */
FountainExt.prototype.scenesReport = function(section) {
	var ret = {};
	ret.scenesStandard = [];
	ret.scenesNotNumber = 0;
	ret.scenesNotStandard = [];
	ret.count = 0;
	var get = true;
	ret.scenesModel = null;
	if (this.model !== null && this.model.length > 0) {
		ret.scenesModel = this.model
				.filter(function(item) {
					if (section !== null && section.length > 0
							&& item.type === "scene") {
						var sectionMatches = (item.lastSectionNumber.trim() + ".")
								.match(new RegExp('^' + section.trim() + '\\.'));
						get = (sectionMatches !== null && sectionMatches.length > 0);
					}
					return (item.type === "scene" && get && !item.comment);
				});
		if (ret.scenesModel !== null && ret.scenesModel.length > 0) {
			ret.count = ret.scenesModel.length;
			ret.scenesModel.forEach(function(item) {
				if (item.number !== null && item.number.length > 0) {
					if (isNaN(item.number.trim())) {
						ret.scenesNotStandard.push(item.number);
					} else {
						ret.scenesStandard.push(item.number);
					}
				} else {
					ret.scenesNotNumber++;
				}
			});
		}
	}
	return ret;
};
