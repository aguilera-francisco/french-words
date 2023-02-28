const fs = require("fs");
const path = require("path");
const data = fs.readFileSync(
    path.join(__dirname, "..", "res", "accents.json"),
    "utf-8"
);
const jsonData = JSON.parse(data);
const accents = new Map(Object.entries(jsonData));

function wordHasAccent(word) {
    const wordSplited = word.split("");
    for (char of wordSplited) {
        if (accents.has(char)) {
            return true;
        }
    }
    return false;
}
function wordStartsWithAccent(word) {
    const start = word[0];
    return accents.has(start);
}
function refactorWord(word) {
    const refactoredWord = [];
    const wordSplited = word.split("");
    for (char of wordSplited) {
        accents.has(char)
            ? refactoredWord.push(accents.get(char))
            : refactoredWord.push(char);
    }
    return refactoredWord.join("");
}

module.exports = {
    accents,
    wordHasAccent,
    refactorWord,
    wordStartsWithAccent,
};
