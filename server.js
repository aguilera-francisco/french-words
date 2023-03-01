require("dotenv").config();
const express = require("express");
const wr = require("wordreference-api");
const path = require("path");

const {
    refactorWord,
    wordHasAccent,
} = require("./src/controllers/info.helper");
const InfoRouter = require("./src/routes/info.router");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "public")));
app.get("/", (req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, "src", "public", "index.html"));
});
app.use("/info", InfoRouter);
app.get("/code/:code", async (req, res) => {
    console.log(req.params.code);
});
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
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto: ${PORT}`);
});
