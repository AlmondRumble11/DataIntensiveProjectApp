var express = require("express");
var router = express.Router();
var { sqlQuery } = require("../database");
const path = require('node:path');
const mime = require('mime');



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


router.post("/addbook", async function(req, res) {
    console.log(JSON.parse(req.body.formValues));
    const file = req.files.file;
    file.mv('book_pdf/' + file.name, function(err, result) {
            if (err) throw err;
            res.status(200).json({ msg: "success" });
        })
        // if (!validateBook(req.body.file)) {
        //     return res.status(500).send("Only supports .pdf files");
        // }

    // //Check if book exist
    // if (getBook(req.body.title)) {
    //     res.status(500).send("Book exists.")
    // }

    // //Author query insert if author does not exist
    // let authtorId = getAuthor(req.body.authorFirstname, req.body.authorLastname)
    // if (!gauthtorId) {
    //     const authorQuery = `
    //     INSERT INTO Author ( 
    //         [Firstname], 
    //         [Lastname], 
    //         [CountryId],
    //     ) 
    //     VALUES ( 
    //         '${req.body.authorFirstname}',
    //         '${req.body.authorLastname}'
    //     )`;
    //     authtorId = await sqlQuery(authorQuery);
    // }

    // //Publisher query insert if it does not exist
    // let publiserId = getPublisher(req.body.publisher);
    // if (!publiserId) {
    //     const publisherQuery = `
    //     INSERT INTO Pusblisher ( 
    //         [Name], 
    //         [CountryId],
    //     ) 
    //     VALUES ( 
    //         '${req.body.publisher}',
    //         '1'
    //     )`;
    //     publiserId = await sqlQuery(publisherQuery);
    // }

    // //Language query insert if it does not exist
    // let langugageId = getLanguage(req.body.language);
    // if (!langugageId) {
    //     const languageQuery = `
    //     INSERT INTO Pusblisher ( 
    //         [Name], 
    //         [CountryId],
    //     ) 
    //     VALUES ( 
    //         '${req.body.language}',
    //         '1'
    //     )`;
    //     langugageId = await sqlQuery(languageQuery);
    // }

    // //Genre query insert if it does not exist
    // let genreId = getGenre(req.body.genre);
    // if (!genreId) {
    //     const genreQuery = `
    //     INSERT INTO Pusblisher ( 
    //         [Name], 
    //         [CountryId],
    //     ) 
    //     VALUES ( 
    //         '${req.body.genre}',
    //         '1'
    //     )`;
    //     genreId = await sqlQuery(genreQuery);
    // }

    // // BookDetail query insert
    // const filename = path.basename(req.body.file);
    // const filepath = path.dirname(req.body.file);
    // const contentType = mime.getType(req.body.file);
    // const bookDetailQuery = `
    //     INSERT INTO BookDetail ( 
    //         [Path], 
    //         [Filename], 
    //         [DateAdded],
    //         [ContentType] 
    //     ) 
    //     VALUES ( 
    //         '${filename}',
    //         '${filepath}', 
    //         GETDATE(), 
    //         '${contentType}'
    //     )`;
    // await sqlQuery(bookDetailQuery);

    // const bookQuery = `
    // INSERT INTO BookDetail (
    //     PublisherId, 
    //     AuthorId, 
    //     GenreId, 
    //     LanguageId, 
    //     CountryId, 
    //     Title, 
    //     PublishDate, 
    //     Price, 
    //     AddedDate, 
    //     [Description], 
    //     BookDetailId, 
    //     CountrySpecificInfo
    // ) 
    // VALUES ( 
    //     '${publiserId}',
    //     '${authtorId}',
    //     '${genreId}',
    //     '${langugageId}',
    //     '1',
    //     '${req.body.title}',
    //     '${req.body.date}',
    //     '${req.body.price}',
    //     'GETDATE()',
    //     '${req.body.description}',
    //     '${bookDetailId}',
    //     'insert vat',
    // )`
    // await sqlQuery(bookQuery);

    return res.status(200).json({ msg: "success" });

});



module.exports = router;