var express = require("express");
var router = express.Router();
var { sqlQuery, sqlInsert } = require("../database");
const path = require('node:path');
const mime = require('mime');
const parse = require('date-fns');


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

async function getBook(title) {
    return await sqlQuery(`
    SELECT
    Id
    FROM Book
    WHERE Title = '${title}'`);
}

async function getAuthor(firstname, lastname) {
    return await sqlQuery(`
    SELECT
    Id
    FROM Author
    WHERE Firstname = '${firstname}'
    AND Lastname = '${lastname}'`);
}

async function getPublisher(name) {
    return await sqlQuery(`
    SELECT
    Id
    FROM Publisher
    WHERE [Name] = '${name}'`);
}

async function getLanguage(name) {
    return await sqlQuery(`
    SELECT
    Id
    FROM Language
    WHERE [Name] = '${name}'`);
}

async function getGenre(name) {
    return await sqlQuery(`
    SELECT
    Id
    FROM Genre
    WHERE [Name] = '${name}'`);
}

async function getBookDetail(name) {
    return await sqlQuery(`
    SELECT
    Id
    FROM BookDetail
    WHERE [Name] = '${name}'`);
}

router.post("/addbook", async function(req, res) {
    const formValues = JSON.parse(req.body.formValues);
    const file = req.files.file;
    let authtorId;
    let publisherId;
    let languageId;
    let genreId;


    if (req.files.file.mimetype != "application/pdf") {
        return res.status(501).json({ msg: "Only supports .pdf files", status: false });
    }

    //Check if book exist
    const result = await getBook(formValues["title"]);
    if (result.length != 0) {
        return res.status(502).json("Book exists.")
    }
    if (Number(isNaN(formValues["price"]))) {
        return res.status(503).send({
            msg: `Given price ${formValues["price"]} is not a number.`,
            status: false
        })
    }


    //Author query insert if author does not exist
    const authtor = await getAuthor(formValues["authorFirstname"], formValues["authorLastname"]);
    if (authtor.length == 0) {
        const authorQuery = `
        INSERT INTO Author ( 
            [Firstname], 
            [Lastname], 
            [CountryId]
        ) 
        VALUES ( 
            '${formValues["authorFirstname"]}',
            '${formValues["authorLastname"]}',
            '1'
        ) SELECT SCOPE_IDENTITY() AS Id`;
        const insertedAuthor = await sqlInsert(authorQuery);
        authtorId = insertedAuthor.recordset[0].Id;
    } else {
        authtorId = authtor[0].Id;
    }

    //Publisher query insert if it does not exist
    const publisher = await getPublisher(formValues["publisher"]);
    if (publisher.length == 0) {
        const publisherQuery = `
            INSERT INTO Publisher ( 
                [Name], 
                [CountryId]
            ) 
            VALUES ( 
                '${formValues["publisher"]}',
                '1'
            ) SELECT SCOPE_IDENTITY() AS Id`;
        const insertedPublisher = await sqlInsert(publisherQuery);
        publisherId = insertedPublisher.recordset[0].Id;
    } else {
        publisherId = publisher[0].Id;
    }



    //Language query insert if it does not exist
    const language = await getLanguage(formValues["language"]);
    if (language.length == 0) {
        const languageQuery = `
            INSERT INTO Language ( 
                [Name], 
                [CountryId]
            ) 
            VALUES ( 
                '${formValues["language"]}',
                '1'
            ) SELECT SCOPE_IDENTITY() AS Id`;
        const insertedLanguage = await sqlInsert(languageQuery);
        languageId = insertedLanguage.recordset[0].Id;
    } else {
        languageId = language[0].Id;
    }

    //Genre query insert if it does not exist
    const genre = await getGenre(formValues["genre"]);
    if (genre.length == 0) {
        const genreQuery = `
            INSERT INTO Genre ( 
                [Name], 
                [CountryId]
            ) 
            VALUES ( 
                '${formValues["genre"]}',
                '1'
            ) SELECT SCOPE_IDENTITY() AS Id`;
        const insertedGenre = await sqlInsert(genreQuery);

        genreId = insertedGenre.recordset[0].Id;
    } else {
        genreId = genre[0].Id;
    }

    try {
        // BookDetail query insert
        const filename = file.name;
        const filepath = 'book_pdf/';
        const contentType = req.files.file.mimetype;
        const bookDetailQuery = `
            INSERT INTO BookDetail ( 
                [Path], 
                [Filename], 
                [DateAdded],
                [ContentType] 
            ) 
            VALUES ( 
                '${filepath}',
                '${filename}', 
                GETDATE(), 
                '${contentType}'
            ) SELECT SCOPE_IDENTITY() AS Id`;
        const insertedBookDetail = await sqlInsert(bookDetailQuery);
        const bookDetailId = insertedBookDetail.recordset[0].Id;
        const bookQuery = `
        INSERT INTO Book (
            PublisherId, 
            AuthorId, 
            GenreId, 
            LanguageId, 
            CountryId, 
            Title, 
            PublishDate, 
            Price, 
            AddedDate, 
            [Description], 
            BookDetailId, 
            CountrySpecificInfo
        ) 
        VALUES ( 
            '${publisherId}',
            '${authtorId}',
            '${genreId}',
            '${languageId}',
            '1',
            '${formValues["title"]}',
            CONVERT(DATETIME,${formValues["date"]},103),
            '${formValues["price"]}',
            GETDATE(),
            '${formValues["description"]}',
            '${bookDetailId}',
            'insert vat'
        )`;

        await sqlInsert(bookQuery);
        file.mv('book_pdf/' + file.name, function(err, result) {
            if (err) throw err;
        });
    } catch (e) {
        return res.status(500).json({ msg: "A problem occured.", status: true });
    }
    return res.status(200).json({ msg: "Book was added.", status: true });

});



module.exports = router;