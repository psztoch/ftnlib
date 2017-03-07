## Synopsis

Version  @@@version@@@

The library allows the analysis of scenarios in a ***.fountain** format. The scenario is represented as a list of JSON objects. 
Available functions presents the following information:
- ```getScenes``` - list of all scenes with numbers, extensions, times and synopses. 
- ```getSections``` - list of all sections with numbers, synopses, characters appearing in it and durations.
- ```getCharacters``` - list of all characters with numbers of appearances.
- ```getPlaces``` - list of all places where scenes are shot.
- ```getTitlePage``` - list of all key-value pairs from the title page such as title, authors, date and others.

## Installation

This library is distributed as a node package '''ftnlib'''. It can be installed from directory location:
```
npm install <path_to_directory>\ftnlib
```
There is no other dependencies.
After installing it can be used as a node module or as a pure javascript in browser applications.
This code presents how to load this library in a browser or in nodejs project.
```JavaScript
<script type="text/javascript">
	if (typeof require === "function") {
		var ftneditor = require("ftnlib");
	} else {
		var scripts = [ "/node_modules/ftnlib/lib/htmlparser2ify.js", "/node_modules/ftnlib/lib/fountain.js",
				"/node_modules/ftnlib/lib/fountain-ext.js", "/node_modules/ftnlib/lib/ftnmodel.js" ];
		scripts.forEach(function(src) {
			jQuery.getScript(src, function() {
				console.log("loaded:", src);
			});
		});

	}
</script>
```
In both cases the ```ftneditor``` object is available in the global scope.

## Usage

To use this library one should create an '''ftnModel''' object and initialize this object with fountain text.

```
var fountainText = "*<A scenario loaded from a file or an url>*";
var ftnModel = new ftneditor.FtnModel();
    ftnModel.buildModel(fountainText);
```
When the model is built functions listed above can be used.
```
var listOfAllScenes = ftnModel.getScenes();
```

## Helper methods

Beside the described methods some helper functions are avaliable.

Headers functions - methods which return an array of headers which can be used to format a html table. Headers are written using underscore notation.
- ```getSceneHeaders```  
- ```getSectionHeaders```
- ```getCharacterHeaders```
- ```getPlaceHeaders```
- ```getTitlePageHeaders```

Returned lists contain only those fields that can be simpy visualised in table. There can be some more fields in objects which represent raw data.

To visualise data in readeble format a method ```getAsHtmlTable``` is availiable. 


Sample code:
```
var sections = ftnModel.getSections();
            var headers = ftneditor.FtnModel.getSectionHeaders();
            $("#tableWrapper").html(ftneditor.FtnModel.getAsHtmlTable(headers, sections));
```

Other helper functions:
- ```ftneditor.FtnModel.toCamelCase``` - this method converts names from an underscore notation to a camelCase notation. It is internally used inside ```getAsHtmlTable``` to convert headers to field names.
- ```ftneditor.FtnModel.formatTime(duration)``` - converts time in seconds to 'HH:mm:ss' format.
- ```ftneditor.FtnModel.formatTimeR(timeAssigned, timeComputed, timeStart)``` - converts time parameters to duration format '(m:ss÷m:ss)'.
 

## License

This package internally uses fountain Fountain.js from 
[https://github.com/mattdaly/Fountain.js](https://github.com/mattdaly/Fountain.js)
and browserified htmlparser2 node package.

Author: CinemaVision, FINN Sp. z o.o.
Licence: All rights reserved.
