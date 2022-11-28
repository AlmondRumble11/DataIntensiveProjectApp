var express = require("express");
var router = express.Router();
var sqlQuery = require("../database").sqlQuery;

router.get("/", async function(req, res, next) {
    const result = await sqlQuery("select Id, Title, Description from Book");
    res.send(result);
});

module.exports = router;