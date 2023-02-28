const fs = require("fs");
const path = require("path");
const data = fs.readFileSync(
    path.join(__dirname, "..", "res", "abbrevations.json"),
    "utf-8"
);
const jsonData = JSON.parse(data);
const abbrevations = new Map(Object.entries(jsonData));

function translateType(obj) {
    obj.fromType = abbrevations.get(obj.fromType);
    for (meaning of obj.meanings) {
        meaning.type = abbrevations.get(meaning.type);
    }
    return obj;
}
module.exports = { translateType };
