var ftneditor;
(function (ftneditor) {
    var SceneModel = (function () {
        function SceneModel(text) {
            this.scenePrefix = "";
            this.extensions = [];
            this.place = "";
            this.subplace = "";
            this.placeParts = [];
            this.timeShift = "";
            this.raw = "";
            if (!text) {
                return;
            }
            this.raw = text;
            text = text.trim();
            var firstWord = text.split(/\s+/, 1)[0];
            var SP = FtnModel.SCENE_PREFIXES;
            if (SP.en.some(function (sp) { return sp === firstWord; }) || SP.pl.some(function (sp) { return sp === firstWord; })) {
                this.scenePrefix = firstWord;
                text = text.substring(firstWord.length).trim();
            }
            var withTimeShift = text.match(/(.*)(\([^)]+\))$/);
            if (withTimeShift) {
                this.timeShift = withTimeShift[2];
                text = withTimeShift[1].trim();
            }
            var parts = text.split(/\s*-\s*/g);
            if (parts.length > 0) {
                var SESA = FtnModel.SCENE_EXTENSIONS_SEARCH_ARRAY;
                var lastPart = parts.pop();
                var findNext = true;
                while (findNext) {
                    findNext = false;
                    for (var _i = 0, SESA_1 = SESA; _i < SESA_1.length; _i++) {
                        var se = SESA_1[_i];
                        var index = lastPart.lastIndexOf(se);
                        if (index >= 0 && (lastPart.length - se.length) === index) {
                            this.extensions.unshift(se);
                            lastPart = lastPart.substring(0, index).trim();
                            findNext = true;
                            break;
                        }
                    }
                }
                if (!!lastPart) {
                    parts.push(lastPart);
                }
            }
            this.placeParts = parts.slice(0);
            if (parts.length > 0) {
                this.place = parts.shift();
                this.subplace = parts.join(" - ");
            }
        }
        return SceneModel;
    }());
    ftneditor.SceneModel = SceneModel;
    var FtnModel = (function () {
        function FtnModel() {
            this.ftnExt = new FountainExt();
        }
        FtnModel.prototype.buildModel = function (screenplay) {
            this.ftnExt.parse(screenplay);
        };
        FtnModel.prototype.getDescription = function () {
            return "Zestaw metod do filtracji treści z plików *.fountain.";
        };
        FtnModel.prototype.getModel = function () {
            return this.ftnExt.getModel();
        };
        FtnModel.prototype.getScenes = function () {
            var resultArray = [];
            var model = this.getModel();
            for (var _i = 0, model_1 = model; _i < model_1.length; _i++) {
                var item = model_1[_i];
                if (item.type === "synopsis" && item.sceneNumber != null) {
                    if (resultArray.length > 0) {
                        var last = resultArray[resultArray.length - 1];
                        if (last.sceneSynopsis.trim().length === 0) {
                            last.sceneSynopsis = item.text.trim();
                        }
                        else {
                            last.sceneSynopsis += " " + item.text.trim();
                        }
                    }
                }
                else if (item.type === 'scene') {
                    var scene = new SceneModel(item.text);
                    var result = {
                        sceneNo: item.number,
                        intExt: scene.scenePrefix,
                        placeName: scene.place,
                        placeExt: scene.subplace,
                        dayNight: scene.extensions.concat(scene.timeShift).join(" "),
                        time: item.time,
                        timeText: FtnModel.formatTime(item.time),
                        sceneSynopsis: ""
                    };
                    resultArray.push(result);
                }
            }
            return resultArray;
        };
        FtnModel.prototype.getSections = function () {
            var submodel = this.ftnExt.getSubModel(true, true, false, false, false, true, false, false, false, null, null, null, true, null, null);
            var resultArray = [];
            for (var _i = 0, submodel_1 = submodel; _i < submodel_1.length; _i++) {
                var item = submodel_1[_i];
                if (item.type === "section") {
                    var timeSec = item.time ? item.time : item.timeW;
                    resultArray.push({
                        sectionNo: item.number + ".",
                        sectionName: item.text,
                        sectionSynopses: [],
                        characters: "",
                        characterArray: [],
                        time: timeSec,
                        timeText: FtnModel.formatTime(timeSec),
                        cumulativeTimeText: FtnModel.formatTimeR(item.time, item.timeW, item.timeR),
                        startTime: item.timeR
                    });
                }
                else if (item.type === "synopsis" && resultArray.length > 0) {
                    resultArray[resultArray.length - 1].sectionSynopses.push(item.text);
                }
                else if (item.type === "characters" && resultArray.length > 0) {
                    resultArray[resultArray.length - 1].characters = item.name;
                }
                else if (item.type === "character" && resultArray.length > 0) {
                    var chs = resultArray[resultArray.length - 1].characterArray;
                    if (chs.indexOf(item.name) < 0) {
                        chs.push(item.name);
                    }
                }
            }
            return resultArray.map(function (item) {
                item.sectionSynopses = item.sectionSynopses.join(" ");
                return item;
            });
        };
        FtnModel.prototype.getCharacters = function () {
            var characters = {};
            var model = this.getModel();
            var orderedNames = [];
            model.forEach(function (item) {
                if (item.type === "character") {
                    if (characters[item.name]) {
                        characters[item.name] = characters[item.name] + 1;
                    }
                    else {
                        characters[item.name] = 1;
                        orderedNames.push(item.name);
                    }
                }
            });
            return orderedNames.map(function (name) {
                return { characterName: name, numberOfAppearances: characters[name] };
            });
        };
        FtnModel.prototype.getPlaces = function () {
            var model = this.getModel();
            var scenes = model.filter(function (item) { return item.type === 'scene'; }).map(function (item) { return new SceneModel(item.text); });
            var places = [];
            var subplaceLists = {};
            scenes.forEach(function (scene) {
                var placeKey = scene.place;
                places.push(placeKey);
                var subplaceKey = scene.subplace;
                if (subplaceKey) {
                    if (subplaceLists[placeKey]) {
                        subplaceLists[placeKey].push(subplaceKey);
                    }
                    else {
                        subplaceLists[placeKey] = [subplaceKey];
                    }
                }
            });
            var result = [];
            FtnModel.countArray(places).forEach(function (place) {
                result.push({ placeName: place.key, numberOfAppearances: place.value });
                FtnModel.countArray(subplaceLists[place.key]).forEach(function (subplace) { return result.push({ placeName: place.key + " - " + subplace.key, numberOfAppearances: subplace.value }); });
            });
            return result;
        };
        FtnModel.prototype.getTitlePage = function () {
            var titleMap = this.ftnExt.getTitlePageMap();
            return Object.keys(titleMap).map(function (key) {
                return { keyName: key, value: titleMap[key] };
            });
        };
        FtnModel.formatTimeR = function (timeAssigned, timeComputed, timeStart) {
            return FountainExt.prototype.formatTimeR(timeAssigned, timeComputed, timeStart);
        };
        FtnModel.formatTime = function (duration) {
            if (isNaN(parseInt(duration))) {
                return "";
            }
            return FountainExt.prototype.formatTime(duration);
        };
        FtnModel.getPlaceHeaders = function () {
            return ["PLACE_NAME", "NUMBER_OF_APPEARANCES"];
        };
        FtnModel.getCharacterHeaders = function () {
            return ["CHARACTER_NAME", "NUMBER_OF_APPEARANCES"];
        };
        FtnModel.getSceneHeaders = function () {
            return ["SCENE_NO", "INT_EXT", "PLACE_NAME", "PLACE_EXT", "DAY_NIGHT", "TIME_TEXT", "SCENE_SYNOPSIS"];
        };
        FtnModel.getSectionHeaders = function () {
            return ["SECTION_NO", "SECTION_NAME", "SECTION_SYNOPSES", "CHARACTERS", "TIME_TEXT", "CUMULATIVE_TIME_TEXT"];
        };
        FtnModel.getTitlePageHeaders = function () {
            return ["KEY_NAME", "VALUE"];
        };
        FtnModel.toCamelCase = function (s) {
            return s.toLowerCase().replace(/[-_]([a-z])/g, function (g) { return g[1].toUpperCase(); });
        };
        FtnModel.getAsHtmlTable = function (headers, data) {
            var tableHtml = "<table class='table table-bordered'>";
            var pNames = headers.map(function (h) { return FtnModel.toCamelCase(h); });
            tableHtml += "<tr>";
            headers.forEach(function (header) { return tableHtml += "<th>" + header + "</th>"; });
            tableHtml += "</tr >";
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var rowData = data_1[_i];
                tableHtml += "<tr>";
                pNames.forEach(function (pName) {
                    var cellData = rowData[pName];
                    var cellText;
                    if (Array.isArray(cellData)) {
                        cellText = JSON.stringify(cellData);
                    }
                    else {
                        cellText = cellData;
                    }
                    tableHtml += "<td>" + cellText + "</td>";
                });
                tableHtml += "</tr>";
            }
            tableHtml += "<tr><td colspan='" + pNames.length + "'><pre style='white-space: pre-wrap;'>" + JSON.stringify(data) + "</pre></td></tr>";
            tableHtml += "</table>";
            return tableHtml;
        };
        FtnModel.countArray = function (arr) {
            if (!arr) {
                return [];
            }
            var keys = [];
            var values = [];
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var key = arr_1[_i];
                var keyIndex = keys.indexOf(key);
                if (keyIndex < 0) {
                    keys.push(key);
                    values.push(1);
                }
                else {
                    values[keyIndex] = values[keyIndex] + 1;
                }
            }
            var result = [];
            for (var i = 0; i < keys.length; i++) {
                result.push({ key: keys[i], value: values[i] });
            }
            return result;
        };
        FtnModel.SCENE_PREFIXES = {
            en: ["EXT.", "INT.", "INT./EXT.", "EXT./INT."],
            pl: ["PL.", "WN.", "WN./PL.", "PL./WN."]
        };
        FtnModel.SCENE_EXTENSIONS = {
            en: ["DAY", "NIGHT", "MORNING", "NOON", "AFTERNOON", "EVENING", "LATER", "MOMENTS LATER", "CONTINUOUS"],
            pl: ["DZIEŃ", "NOC", "RANO", "POŁUDNIE", "POPOŁUDNIE", "WIECZÓR", "PÓŹNIEJ", "CHWILĘ PÓŹNIEJ", "KONTYNUACJA"]
        };
        FtnModel.SCENE_EXTENSIONS_SEARCH_ARRAY = FtnModel.SCENE_EXTENSIONS.pl.concat(FtnModel.SCENE_EXTENSIONS.en).sort(function (a, b) { return b.length - a.length; });
        return FtnModel;
    }());
    ftneditor.FtnModel = FtnModel;
})(ftneditor || (ftneditor = {}));
