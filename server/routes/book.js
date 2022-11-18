
var express = require("express");
var router = express.Router();
var sqlQuery = require("../database");

router.get("/", async function (req, res, next) {
  var result = await sqlQuery("select * from Book");
  res.send(result);
});

module.exports = router;
