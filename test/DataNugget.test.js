const dn = require("../src/DataNugget.js");
const DataNugget = new dn();
const { join } = require("path");

const chunk = `chunk?chunky !true!
chunk?magic #42069#
&pause`;


test("parses single line string of data", () => {
    expect(DataNugget.parseSingleLine("single?tested !true!")).toEqual({"tested": true,});
});

test("parses .nugget data files", done => {
    function callback (fileData) {
        expect(fileData).toEqual({"working": true, "goingWell": "yes sirey!", "yay": 1});
        done();
    }
    DataNugget.parseFile(join(__dirname, "test.nugget"), callback);
});

test("parses string chunk of data", done => {
    function chunkBack (chunkData) {
        expect(chunkData).toEqual({ "chunky": true, "magic": 42069});
        done();
    }
    DataNugget.parseChunk(chunk, chunkBack);
});