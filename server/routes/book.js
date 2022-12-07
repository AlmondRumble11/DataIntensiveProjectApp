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
    const result = await sqlQuery(`select 
    B.Id, B.Title, B.Description, B.Price,
    A.FirstName, A.LastName
    from Book as B
    inner join Author as A on B.authorId = A.Id
    `, req.headers.countrycode);
    return getResult(res, result);
});

router.get("/featured", async function(req, res) {
    const result = await sqlQuery(`select 
  B.Id, B.Title, B.Description, B.Price,
  A.FirstName, A.LastName
  from Book as B
  inner join Author as A on B.authorId = A.Id
  order by addedDate desc
  `, req.headers.countrycode);
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
  where B.Id = ${bookId}`, req.headers.countrycode);

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
  where B.Title = '${bookName}'`, req.headers.countrycode);

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


    const result = await sqlQuery(query, req.headers.countrycode);

    return getResultSearch(res, result);
});

router.get("/dowload/:id", async function(req, res) {
    const bookId = req.params.id;
    const result = await sqlQuery(`
    SELECT
    Filename, Path, ContentType
    FROM BookDetail
    WHERE Id = ${bookId}`, req.headers.countrycode);

    const filePath = `${result[0]["Path"]}${result[0]["Filename"]}`;
    const fileName = result[0]["Filename"];
    return res.download(filePath, fileName);

});

async function getBook(title, countrycode) {
    return await sqlQuery(`
    SELECT
    Id
    FROM Book
    WHERE Title = '${title}'`, countrycode);
}

async function getAuthor(firstname, lastname, countrycode) {
    return await sqlQuery(`
    SELECT
    Id
    FROM Author
    WHERE Firstname = '${firstname}'
    AND Lastname = '${lastname}'`, countrycode);
}

async function getPublisher(name, countrycode) {
    return await sqlQuery(`
    SELECT
    Id
    FROM Publisher
    WHERE [Name] = '${name}'`, countrycode);
}

async function getLanguage(name, countrycode) {
    return await sqlQuery(`
    SELECT
    Id
    FROM Language
    WHERE [Name] = '${name}'`, countrycode);
}

async function getGenre(name, countrycode) {
    return await sqlQuery(`
    SELECT
    Id
    FROM Genre
    WHERE [Name] = '${name}'`, countrycode);
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
    const result = await getBook(formValues["title"], req.headers.countrycode);
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
    const authtor = await getAuthor(formValues["authorFirstname"], formValues["authorLastname"], req.headers.countrycode);
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
        const insertedAuthor = await sqlInsert(authorQuery, req.headers.countrycode);
        authtorId = insertedAuthor.recordset[0].Id;
    } else {
        authtorId = authtor[0].Id;
    }

    //Publisher query insert if it does not exist
    const publisher = await getPublisher(formValues["publisher"], req.headers.countrycode);
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
        const insertedPublisher = await sqlInsert(publisherQuery, req.headers.countrycode);
        publisherId = insertedPublisher.recordset[0].Id;
    } else {
        publisherId = publisher[0].Id;
    }



    //Language query insert if it does not exist
    const language = await getLanguage(formValues["language"], req.headers.countrycode);
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
        const insertedLanguage = await sqlInsert(languageQuery, req.headers.countrycode);
        languageId = insertedLanguage.recordset[0].Id;
    } else {
        languageId = language[0].Id;
    }

    //Genre query insert if it does not exist
    const genre = await getGenre(formValues["genre"], req.headers.countrycode);
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
        const insertedGenre = await sqlInsert(genreQuery, req.headers.countrycode);

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
        const insertedBookDetail = await sqlInsert(bookDetailQuery, req.headers.countrycode);
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

        await sqlInsert(bookQuery, req.headers.countrycode);
        file.mv('book_pdf/' + file.name, function(err, result) {
            if (err) throw err;
        });
    } catch (e) {
        return res.status(500).json({ msg: "A problem occured.", status: true });
    }
    return res.status(200).json({ msg: "Book was added.", status: true });

});



module.exports = router;