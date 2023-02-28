const express = require("express");
const wr = require("wordreference-api");
const path = require("path");
const cors = require("cors");
const {
    refactorWord,
    wordHasAccent,
} = require("./src/controllers/info.helper");
const InfoRouter = require("./src/routes/info.router");
const app = express();
// app.use(
//     cors({
//         origin: "Access-Control-Allow-Origin",
//     })
// );
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "public")));
app.get("/", (req, res) => {
    //wr("carro").then((result) => res.send(result));
    //wr("the", "es", "fr").then((result) => res.send(result));

    // api.getTranslation("en", "es", "cat")
    //     .then((result) => {
    //         console.log(result);
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //     });
    res.sendFile(path.join(__dirname, "src", "public", "index.html"));
});
app.use("/info", InfoRouter);
app.get("/word/:word", async (req, res) => {
    //explorar los diferentes significados
    let word = req.params.word;
    if (wordHasAccent(word)) {
        word = refactorWord(word);
    }
    try {
        const data = await wr(word, "fr");
        word = req.params.word;
        word = word.toLowerCase();
        res.send({
            word,
            data,
        });
    } catch (err) {
        res.send(err);
    }
});

app.listen(8000, () => {
    console.log("Servidor funcionando");
});
