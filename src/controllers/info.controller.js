const { wordHasAccent, refactorWord } = require("./info.helper");
const wr = require("wordreference-api");
const { translateType } = require("../services/info.services");

function findGender(word, translations) {
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
        console.log("alike transformado", transWord);
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
            if (transWord === word) {
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
function getAllAlikeMeanings(word, translations) {
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
        //pasar a otra función
        for (translation of data.translations) {
            if (translation.title !== "Principales traductions") {
                continue;
            }
            //buscar el género
            const gender = findGender(word, translation.translations);
            if (!gender) {
                continue;
            } else {
                result = gender;
                break;
            }
        }
        if (result.word) {
            //sacar todos los resultados
            meanings = getAllMeanings(word, data.translations);
            meanings = deleteDuplicated(meanings);
            //añadir al result
            //crear función para construir los result
            result.meanings = meanings;
            result.ok = true;
            result.alternative = false;
            result.alike = false;
            result = translateType(result);
            return res.send({
                result,
            });
        }
        //aquí no encontó la palabra exactamente,
        //procede a buscar si hay algún resultado que contenga la palabra
        for (translation of data.translations) {
            if (translation.title !== "Principales traductions") {
                continue;
            }
            //buscar el género
            const alternative = findAlternativeResult(
                word,
                translation.translations
            );
            if (!alternative) {
                continue;
            } else {
                result = alternative;
                break;
            }
        }
        if (result.word) {
            //sacar todos los resultados
            meanings = getAllAlternativeMeanings(word, data.translations);
            meanings = deleteDuplicated(meanings);
            //añadir al result
            result.meanings = meanings;
            result.ok = true;
            result.alternative = true;
            result.alike = false;
            result = translateType(result);
            return res.send({
                result,
            });
        }
        //si no encuentra de plano nada, recorrer los resultados quitándole los acentos
        for (translation of data.translations) {
            if (translation.title !== "Principales traductions") {
                continue;
            }
            //buscar el género
            const alike = findAlikeResult(word, translation.translations);
            if (!alike) {
                continue;
            } else {
                result = alike;
                break;
            }
        }
        if (result.word) {
            //sacar todos los resultados
            meanings = getAllAlternativeMeanings(
                result.word,
                data.translations
            );
            meanings = deleteDuplicated(meanings);
            //añadir al result
            result.meanings = meanings;
            result.ok = true;
            result.alternative = false;
            result.alike = true;
            result = translateType(result);
            return res.send({
                result,
            });
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
