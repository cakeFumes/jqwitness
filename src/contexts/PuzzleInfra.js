import { useState, useEffect } from 'react';
import jqModule from './jqWasm/jq.js';

var wasmModule;
//MAIN JQ LOGIC
var STDOUT = [],
    STDERR = [],
    FILE_DATA = '/tmp/data.json',
    CONFIG_EDITOR = {
        mode: "ace/mode/json",
        selectionStyle: "text",
        tabSize: 2
    };

const Module={
    stdout: function(stdout){STDOUT.push(stdout)},
    stderr: function(stderr){STDERR.push(stderr)},
    noInitialRun: true
}

jqModule(Module)
    .then(
        (m) => {
            wasmModule=m;
            console.log('JQ Module instantiated');
        }
    );

function jq(jsonStr, query, options) {//TODO: Escape special chars
    // Custom jq options.
    // Default = -M = disable colors
    if(!jsonStr || !query) return '';
    var mainOptions = ["-M"];
    if (options != null && options.length > 0)
        mainOptions = mainOptions.concat(options);
    var FS = wasmModule.FS;
    // Create file from object
    FS.writeFile(FILE_DATA, JSON.stringify(jsonStr));

    // Clear previous stdout/stderr before launching jq
    STDOUT = [];
    STDERR = [];
    
    // Launch jq's main() function
    mainOptions = mainOptions.concat([query, FILE_DATA]);
    wasmModule.callMain(mainOptions);

    // Re-open stdout/stderr after jq closes them
    FS.streams[1] = FS.open("/dev/stdout", "w");
    FS.streams[2] = FS.open("/dev/stderr", "w");
    //May output with trailing newlines;
    return {
        stdout: String.fromCharCode(...STDOUT),
        stderr: String.fromCharCode(...STDERR)
    }
}

export default function runJQ(input, jqInput) {
    if(!input || !jqInput){
        return "";
    }
    if(jqInput.includes("'")){
        return "Bad input: Never use single quotes in JSON!";
    }

    var out = jq(input, jqInput);
    // Parse jq errors
    //elError.innerHTML = "";
    if (out.stdout != ""){
        return out.stdout;
    }
    else {
        console.log(out.stderr);
        return out.stderr.replace(FILE_DATA,'INPUT');
    }
}
