const { wordHasAccent, refactorWord } = require("./info.helper");
const wr = require("wordreference-api");
const { translateType } = require("../services/info.services");

function findWord(word, translations) {
    for (trans of translations) {
        const transWord = trans.from.toLowerCase();
        if (transWord !== word) {
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
function findAlternativeResult(word, translations) {
    for (trans of translations) {
        if (!trans.from.includes(word)) {
            continue;
        }
        //construcción de objeto
        //hacer una función
        const obj = {
            word: trans.from,
            fromType: trans.fromType,
        };

        return obj;
    }
    return false;
}
function findAlikeResult(word, translations) {
    for (trans of translations) {
        const transWord = refactorWord(trans.from);
        if (!(transWord.includes(word) || transWord === word)) {
            continue;
        }
        //construcción de objeto
        //hacer una función
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
            const transWord = trans.from.toLowerCase();
            if (transWord === word.toLowerCase()) {
                meaningsArray.push({
                    meaning: trans.to,
                    type: trans.toType,
                });
            }
        }
    }
    return meaningsArray;
}
function getAllAlternativeMeanings(word, translations) {
    const meaningsArray = [];
    for (translation of translations) {
        if (translation.title !== "Principales traductions") {
            continue;
        }
        for (trans of translation.translations) {
            if (trans.from.includes(word)) {
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
function buildResponse(word, result, data, flags, fillMeanings) {
    let meanings = [];
    meanings = fillMeanings(word, data.translations);
    meanings = deleteDuplicated(meanings);
    result.meanings = meanings;
    result.ok = flags[0];
    result.alternative = flags[1];
    result.alike = flags[2];
    result = translateType(result);
    return result;
}
function getResult(word, data, flags, findResult, getMeanings) {
    let result = {};
    for (translation of data.translations) {
        if (translation.title !== "Principales traductions") {
            continue;
        }
        //buscar el género
        const exact = findResult(word, translation.translations);
        if (!exact) {
            continue;
        } else {
            result = exact;
            break;
        }
    }

    if (result.word) {
        result = buildResponse(result.word, result, data, flags, getMeanings);
        return result;
    }
    result.ok = false;
    return result;
}
//función para borrar => de los verbos
async function httpGetWord(req, res) {
    let word = req.params.word;
    if (wordHasAccent(word)) {
        word = refactorWord(word);
    }
    try {
        //hacer la petición a la api
        const data = await wr(word, "fr", "es");
        word = req.params.word;
        if (!data.translations) {
            throw {
                error: "no hay traducciones",
            };
        }
        /*=============================================
        INTENTA BUSCAR LA PALABRA EXACTA
        =============================================*/
        let result = getResult(
            word,
            data,
            [true, false, false],
            findWord,
            getAllMeanings
        );
        if (result.ok) {
            return res.send({ result });
        }
        /*=============================================
        BUSCA UN RESULTADO QUE CONTENGA LA PALABRA
        =============================================*/
        result = getResult(
            word,
            data,
            [true, true, false],
            findAlternativeResult,
            getAllAlternativeMeanings
        );
        if (result.ok) {
            return res.send({ result });
        }
        /*=============================================
        BUSCA UN RESULTADO QUE SE PAREZCA
        =============================================*/
        result = getResult(
            word,
            data,
            [true, false, true],
            findAlikeResult,
            getAllAlternativeMeanings
        );
        if (result.ok) {
            return res.send({ result });
        }
        /*=============================================
        NO ENCONTRÓ NADA
        =============================================*/
        throw error;
    } catch (error) {
        res.send({
            error,
            ok: false,
            //data,
        });
    }
}

module.exports = {
    httpGetWord,
};
