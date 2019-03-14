const fs = require("fs"); 
const { extname } = require("path");

module.exports = class DataNugget {
    /**
     * DataNugget class constructor
     * @property {regex} regexObj Regex for gathering titles of DataNugget properties
     * @property {regex} regexName Regex for gathering DataNugget property names
     * @property {regex} regexString Regex for gathering DataNugget strings
     * @property {regex} regexBool Regex for gathering DataNugget booleans
     * @property {regex} regexInt Regex for gathering DataNugget integers
     * @property {regex} regexComment Regex for gathering DataNugget comments
     */
    constructor () {
        this.regexObj = /[^?]*/;
        this.regexName = /(?<=\?)(\w+)/g;
        this.regexString = /(?<=\<)(.+)(?=\>)/g;
        this.regexBool = /(?<=\!)(.+)(?=\!)/g;
        this.regexInt = /(?<=\#)(.+)(?=\#)/g;
        this.regexComment = /&&.*?([\r\n|\n].*?)+&&|&.*/gm;
    }

    /**
     * Parses a single line of DataNugget code
     * @param {string} line Line to parse
     * @returns {Object} object containing the results
     * @example 
     * //returns {
     *      "parseSinglelines": true
     * }
     * parseSingleLine("test?parseSingleLines !true!")
     */
    parseSingleLine (line) {
        const output = {};
        line = this.clean(line);
        const name = line.match(this.regexName)[0];
        let value;

        if (!!line.match(this.regexString)) value = line.match(this.regexString)[0];
        else if (!!line.match(this.regexBool)) value = (/true/i).test(line.match(this.regexBool)[0]);
        else if (!!line.match(this.regexInt)) value = Number(line.match(this.regexInt)[0]);

        output[name] = value;

        return output;
    }
    
    /**
     * Parse the given .nugget file
     * @param {string} path Path to the file
     * @param {parseFile~resultsCallback} cb Callback
     * @callback parseFile~resultsCallback The callback will contain an object of results
     * @example 
     * //returns {
     *      "nugget-file-test": "success"
     * }
     * parseFile(path.join(__dirname, "example.nugget"), data => {
     *      console.log(data)
     * })
     * @returns Callback containg object
     */
    parseFile (path, cb) {
        const output = {};
        if(extname(path) != ".nugget") throw new Error("File must be a .nugget file!");
        fs.readFile(path, {encoding: "utf8"}, (err, data) => {
            if(err) throw err;
            data = this.clean(data);

            let name;
            const lines = data.split(/\n|\;/);

            for(const line of lines) {
                if (line.match(/^\s*$/)) continue;

                name = line.match(this.regexName);
                output[name] = name;

                if (!!line.match(this.regexString)) output[name] = line.match(this.regexString)[0];
                else if (!!line.match(this.regexBool)) output[name] = (/true/i).test(line.match(this.regexBool)[0]);
                else if (!!line.match(this.regexInt)) output[name] = Number(line.match(this.regexInt)[0]);
            };
            
            cb(output);
        })
    }

    /**
     * Parse the given chunk of code
     * @param {string} data Chunk of DataNugget code
     * @param {parseChunk~resultsCallback} cb Callback
     * @callback parseChunk~resultsCallback The callback will contain an object of results
     * @example 
     * //returns {
     *      "chunk": "tested",
     *      "success-int": 1
     * }
     * parseChunk(`chunk?chunk <tested>;chunk?success-int #1#`, data => {
     *      console.log(data)
     * })
     * @returns Callback containg object
     */
    parseChunk (data, cb) {
        const output = {};
        data = this.clean(data);
        
        let name;
        const lines = data.split(/\n|\;/);

        for(const line of lines) {
            if (line.match(/^\s*$/)) continue;

            name = line.match(this.regexName);
            output[name] = name;

            if (!!line.match(this.regexString)) output[name] = line.match(this.regexString)[0];
            else if (!!line.match(this.regexBool)) output[name] = (/true/i).test(line.match(this.regexBool)[0]);
            else if (!!line.match(this.regexInt)) output[name] = Number(line.match(this.regexInt)[0]);
        }
        cb(output);
    }

    clean (data) {
        data.trim()
        return data.replace(this.regexComment, " ");
    }
}