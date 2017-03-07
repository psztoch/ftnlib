var fs = require("fs");
const
vm = require('vm');
var fNames = [ 'htmlparser2ify.js', 'fountain.js', 'fountain-ext.js', 'ftnmodel.js' ];
var context = vm.createContext({});
for (var i = 0; i < fNames.length; i++) {
	fName = fNames[i];
	var filedata = "" + fs.readFileSync('./node_modules/ftnlib/lib/' + fName, 'utf8');
	vm.runInContext(filedata, context, {});
	console.log(fName);
};


module.exports = context.ftneditor;
