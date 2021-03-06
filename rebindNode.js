const fs = require("fs");
function Rebind() {
    this.oldvals = [];
    this.newvals = [];
    this.cmdnames = [];
    this.callbacks = [];
    this.rebind = function(oldval, newval) {
        this.oldvals[this.oldvals.length + 1] = oldval;
        this.newvals[this.newvals.length + 1] = newval;
    }

    this.runBinds = function(text) {
        var code = "";
        for (var i = 0; i < this.oldvals.length; i++) {
            var regex = new RegExp(this.oldvals[i], "g");
            code = text.replace(regex, this.newvals[i]);
        }
        return code;
    }
    
    this.bindCommand = function(cmdname, callback) {
        this.cmdnames[this.cmdnames.length + 1] = cmdname;
        this.callbacks[this.callbacks.length + 1] = callback;
    }
    
    this.runCommand = function(codeline) {
        for (var i = 0; i < this.cmdnames.length; i++) {
            var regex = new RegExp(this.cmdnames[i] + " ", "")
            if (regex.test(codeline)) {
                var arg = codeline.replace(this.cmdnames[i] + '', '');
				var cmd = this.callbacks[i] + "('" + arg + "')";
                eval(cmd);
            }
        }
    }
    
    this.runCommandWithArgs = function(codeline, splitter) {
        var input = codeline.split(splitter);
        for (var i = 0; i < this.cmdnames.length; i++) {
            if (input == this.cmdnames[i]) {
                var callback = this.callbacks[i]
                window[callback](input);
            }
        }
    }
    
}
exports.rbind = new Rebind();
var rb = {};
rb.rbind = new Rebind();
rb.rbind.bindCommand("p", "console.log");
rb.rbind.bindCommand("sA", "setVarA");
rb.rbind.bindCommand("sB", "setVarB");
rb.rbind.bindCommand("sC", "setVarC");
rb.rbind.bindCommand("sD", "setVarD");
rb.rbind.bindCommand("sO", "setVarO");
rb.rbind.bindCommand("sI", "setVarI");
rb.rbind.bindCommand("arg1", "setVarArg1");
rb.rbind.bindCommand("arg2", "setVarArg2");
rb.rbind.bindCommand("pVar", "printVar");
rb.rbind.bindCommand("cVar", "catVar");
rb.rbind.bindCommand("rVar", "replaceVar");
rb.rbind.bindCommand("clr", "clearVars");
rb.rbind.bindCommand("pipe", "pipeVars");
rb.rbind.bindCommand("fsr", "FileRead");
var A = "";
function setVarA(contents) {
  A = contents;
}
var B = "";
function setVarB(contents) {
  B = contents;
}
var C = "";
function setVarC(contents) {
  C = contents;
}
var D = "";
function setVarD(contents) {
  D = contents;
}
var O = "";
var I = "";
var arg1 = "";
var arg2 = "";
function setVarI(contents) {
  I = contents;
}
function setVarArg1(contents) {
  arg1 = contents;
}
function setVarArg2(contents) {
  arg2 = contents;
}
function printVar(vname) {
  console.log(eval(vname));
}
function catVar(vname) {
  O = eval(vname + " + I");
}
function replaceVar(vname) {
  O = eval(vname + ".replace(/" + arg1 + "/g, '" + arg2 + "')")
}
function clearVars() {
  A = "";
  B = "";
  C = "";
  D = "";
  I = "";
  O = "";
  arg1 = "";
  arg2 = "";
}
function pipeVars(vname) {
	eval(vname + " = O");
}
function FileRead(filename) {
	filename = filename.substr(1);
	var data = fs.readFileSync(filename).toString();
	O = data;
	
}
function runProgram(codetext) {
	var codelines = codetext.split("\n");
	for (var i = 0; i < codelines.length; i++) {
		rb.rbind.runCommand(codelines[i]);
	}
}

var code = fs.readFileSync(process.argv[2]);
runProgram(code.toString());
