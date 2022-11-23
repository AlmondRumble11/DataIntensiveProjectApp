const express = require('express');
const router = express.Router();
const sqlQuery = require("../database").sqlQuery;
const sqlInsert = require("../database").sqlInsert;
const passwordValidator = require('password-validator');
const schema = new passwordValidator();
const IsEmail = require('isemail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../config/passport').authenticateToken;

function checkResultLogin(req, res, data) {

  if (data === null) {
    return res.status(500).send("Internal error.");
  }

  if (!data || data.length <= 0) {
    return res.status(404).send("User not found.");
  }

  if (req.body.password == null || data[0].Password == null){
    return res.status(500).send("Internal error.");
  }

  
  if (bcrypt.compareSync(req.body.password, data[0].Password)) {
    const token = signJwt(data);
    delete data[0]['Password'];
    data[0]['token'] = token;
    return res.status(200).json(data);
  } else {
    return res.status(401).send("Invalid credentials.");
  }
  
}

function signJwt(data){
  const jwtPayload = {
    id: data[0].Id,
    email: data[0].Email
  }
  
  const token = jwt.sign(jwtPayload, process.env.ACCESS_SECRET, {expiresIn: "1h"});

  return token;
}


function checkCustomerBody(req, res){

  schema
    .is().min(10)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()

  if(req.body.firstName == null || req.body.firstName === ''){
    return res.status(422).send('No first name.');
  }else if (req.body.lastName == null || req.body.lastName === ''){
    return res.status(422).send('No last name.');
  }else if (req.body.address == null || req.body.address === ''){
    return res.status(422).send('No address.');
  }else if (typeof req.body.email !== 'string' || !IsEmail.validate(req.body.email)){
    return res.status(401).send('Invalid email.');
  }else if (req.body.password == null || !schema.validate(req.body.password)){ //!TODO voi lisää !schema.validate(req.body.passowrd, {list: true}) ni listaa errorit
    return res.status(401).send('Invalid password.');
  }
  return 1;
}

router.get('/login', async  (req, res) =>  {

  const query = `
  select
  C.Id, C.Firstname, C.Lastname, C.Email, C.Password, C.Address
  from Customer as C
  where C.Email = '${req.body.email}'`;

  const result = await sqlQuery(query);

  return checkResultLogin(req, res, result);  
});

router.post('/register', async (req, res) => {

  const query = `
  select 1
  from Customer
  where Customer.Email = '${req.body.email}'`;

  if (checkCustomerBody(req, res) == 1){
    const resultQuery = await sqlQuery(query);
    if( resultQuery.length < 1){

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const insertQuery = `
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
        '${hash}', 
        GETDATE(), 
        '${req.body.address}')`

      const resultInsert = await sqlInsert(insertQuery);

      if (resultInsert === null) {
        return res.status(500).send("Internal error.");
      }else {
        return res.status(201).json(resultInsert);
      }
    }else {
      return res.status(409).send("Email is already in use.");
    }
  }  
});

router.get('/test', authenticateToken , async (req, res) => {
  return res.status(201).send("ok");
});


module.exports = router;
