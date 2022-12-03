var express = require("express");
var router = express.Router();
var { sqlQuery } = require("../database");

function getResult(res, data) {
    if (data === null) {
        return res.status(500).send("Internal error.");
    }

    if (!data || data.length <= 0) {
        return res.status(404).send("Not found.");
    }

    return res.status(200).json(data);
}

function getResultSearch(res, data) {
    if (data === null) {
      return res.status(500).send("Internal error.");
    }
  
    if (!data) {
      return res.status(404).send("Not found.");
    }
  
    return res.status(200).json(data);
  }

router.get("/all", async function(req, res) {
    const result = await sqlQuery("select * from Book");
    return getResult(res, result);
});

router.get("/featured", async function(req, res) {
    const result = await sqlQuery(`select 
  B.Id, B.Title, B.Description, B.Price,
  A.FirstName, A.LastName
  from Book as B
  inner join Author as A on B.authorId = A.Id
  order by addedDate desc
  `);
    return getResult(res, result);
});

router.get("/id/:id", async function(req, res) {
    const bookId = req.params.id;

    const result = await sqlQuery(`
  select
  B.Id, B.Title, B.Description, B.Price, B.PublishDate,
  A.FirstName, A.LastName,
  G.Name as Genre,
  L.Name as Language
  from Book as B
  inner join Author as A on B.authorId = A.Id
  inner join Language as L on B.languageId = L.Id
  inner join Genre as G on B.genreId = G.Id
  where B.Id = ${bookId}`);

    return getResult(res, result);
});

router.get("/name/:name", async function(req, res) {
    const bookName = req.params.name;

    const result = await sqlQuery(`
  select
  B.Id, B.Title, B.Description, B.Price, B.PublishDate,
  A.FirstName, A.LastName,
  G.Name as Genre,
  L.Name as Language
  from Book as B
  inner join Author as A on B.authorId = A.Id
  inner join Language as L on B.languageId = L.Id
  inner join Genre as G on B.genreId = G.Id
  where B.Title = '${bookName}'`);

    return getResult(res, result);
});

router.get("/search/:searchTerm", async function(req, res) {

    const query = `
    select
    B.Id, B.Title, B.Description, B.Price, B.PublishDate,
    A.FirstName, A.LastName,
    G.Name as Genre,
    L.Name as Language
    from Book as B
    inner join Author as A on B.authorId = A.Id
    inner join Language as L on B.languageId = L.Id
    inner join Genre as G on B.genreId = G.Id
    where B.Title like '%${req.params.searchTerm}%' 
    or 
    A.FirstName like '%${req.params.searchTerm}%'
    or
    A.LastName like '%${req.params.searchTerm}%'
    or
    G.Name like '%${req.params.searchTerm}%'
    or
    L.Name like '%${req.params.searchTerm}%'`;


    const result = await sqlQuery(query);

    return getResultSearch(res, result);
});

router.get("/dowload/:id", async function(req, res) {
    const bookId = req.params.id;
    const result = await sqlQuery(`
    SELECT
    Filename, Path, ContentType
    FROM BookDetail
    WHERE Id = ${bookId}`);

    const filePath = `${result[0]["Path"]}${result[0]["Filename"]}`;
    const fileName = result[0]["Filename"];
    return res.download(filePath, fileName);

});



module.exports = router;