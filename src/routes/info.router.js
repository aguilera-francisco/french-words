const express = require("express");
const { httpGetWord } = require("../controllers/info.controller");
const InfoRouter = express.Router();

InfoRouter.get("/:word", httpGetWord);

module.exports = InfoRouter;
