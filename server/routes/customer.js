const express = require('express');
const router = express.Router();
const sqlQuery = require("../database").sqlQuery;
const sqlInsert = require("../database").sqlInsert;

function checkResultPassword(req, res, data) {

  if (data === null) {
    return res.status(500).send("Internal error.");
  }

  if (!data || data.length <= 0) {
    return res.status(404).send("Not found.");
  }

  if (req.body.password == data[0].Password) {
    return res.status(200).json(data);
  } else {
    return res.status(401).send("Invalid credentials.");
  }
  
}

router.get('/', async  (req, res) =>  {

  const result = await sqlQuery(`
  select
  C.Id, C.Firstname, C.Lastname, C.Email, C.Password, C.Address
  from Customer as C
  where C.Email = '${req.body.email}'`);

  return checkResultPassword(req, res, result);  
});

router.post('/', async (req, res) => {

  const result = await sqlInsert(`
  INSERT INTO Customer ( 
    Firstname, 
    Lastname, 
    Email, 
    [Password], 
    CreatedDate, 
    address) 
  VALUES ( 
    '${req.body.firstName}',
    '${req.body.lastName}', 
    '${req.body.email}',
    '${req.body.password}', 
    GETDATE(), 
    '${req.body.address}')`);

  if (result === null) {
    return res.status(500).send("Internal error.");
  }else {
    return res.status(201).json(result);
  }
});


module.exports = router;
