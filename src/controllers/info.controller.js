const { wordHasAccent, refactorWord } = require("./info.helper");
const wr = require("wordreference-api");
const { translateType } = require("../services/info.services");

function findGender(word, translations) {
    for (trans of translations) {
        if (trans.from !== word) {
            continue;
        }
        //convertir
        //fromType = convertType(trans.fromType);
        const obj = {
            word: trans.from,
            fromType: trans.fromType,
        };

        return obj;
    }
    return false;
}
function getAllMeanings(word, translations) {
    const meaningsArray = [];
    for (translation of translations) {
        if (translation.title !== "Principales traductions") {
            continue;
        }
        for (trans of translation.translations) {
            if (trans.from === word) {
                meaningsArray.push({
                    meaning: trans.to,
                    type: trans.toType,
                });
            }
        }
    }
    return meaningsArray;
}
function deleteDuplicated(array) {
    const filteredArray = array.filter((obj, index, self) => {
        return (
            index ===
            self.findIndex(
                (t) => t.meaning === obj.meaning && t.type === obj.type
            )
        );
    });
    return filteredArray;
}

async function httpGetWord(req, res) {
    let word = req.params.word;
    if (wordHasAccent(word)) {
        word = refactorWord(word);
    }
    try {
        const data = await wr(word, "fr", "es");
        word = req.params.word;
        if (!data.translations) {
            throw {
                error: "no hay traducciones",
            };
        }
        let result = {};
        let meanings = [];
        //console.log(data.translations);
        for (translation of data.translations) {
            if (translation.title !== "Principales traductions") {
                continue;
            }
            //buscar el género
            const gender = findGender(word, translation.translations);
            if (!gender) {
                ("entró al if");
                continue;
            } else {
                result = gender;
                break;
            }
        }
        if (!result.word) {
            throw error;
        }
        //sacar todos los resultados
        meanings = getAllMeanings(word, data.translations);
        meanings = deleteDuplicated(meanings);
        //añadir al result
        result.meanings = meanings;
        result.ok = true;
        result = translateType(result);
        res.send({
            result,
        });
    } catch (error) {
        res.send({
            error,
            ok: false,
            //data,
        });
    }
}
async function getWord(_word) {
    let word = _word;
    if (wordHasAccent(word)) {
        word = refactorWord(word);
    }
    try {
        const data = await wr(word, "fr", "es");
        word = _word;
        if (!data.translations) {
            throw {
                error: "no hay traducciones",
            };
        }
        let result = {};
        let meanings = [];
        //console.log(data.translations);
        for (translation of data.translations) {
            if (translation.title !== "Principales traductions") {
                continue;
            }
            //buscar el género
            const gender = findGender(word, translation.translations);
            if (!gender) {
                ("entró al if");
                continue;
            } else {
                result = gender;
                break;
            }
        }
        if (!result.word) {
            throw error;
        }
        //sacar todos los resultados
        meanings = getAllMeanings(word, data.translations);
        meanings = deleteDuplicated(meanings);
        //añadir al result
        result.meanings = meanings;
        result.ok = true;
        result = translateType(result);
        return {
            result,
        };
    } catch (error) {
        return {
            error,
            ok: false,
            //data,
        };
    }
}
module.exports = {
    httpGetWord,
    getWord,
};
