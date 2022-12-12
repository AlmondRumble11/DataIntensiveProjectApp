const express = require('express');
const router = express.Router();
const authenticateToken = require('../config/passport').authenticateToken
const sqlQuery = require("../database").sqlQuery;
const sqlInsert = require("../database").sqlInsert;


const countryNameAndCode = [
    {
        countryCode: 'FI',
        countryName: 'Finland'
    },
    {
        countryCode: 'SWE',
        countryName: 'Sweden'
    },
    {
        countryCode: 'NOR',
        countryName: 'Norway'
    }
]

function selectCountryName(req) {
    for (let i = 0; i < countryNameAndCode.length; i++) {
        if(countryNameAndCode[i].countryCode == req.headers.countrycode){
            return countryNameAndCode[i].countryName
        }   
    }
}

function calculateTotal(req) {

    let totalSum = 0;

    for (let i = 0; i < req.body.shoppingBasket.length; i++) {
        totalSum += req.body.shoppingBasket[i].Price;
    }

    return totalSum;
}

async function getCountryId(req, res){
    const countryName = selectCountryName(req);
    
    const queryCountryId = `
        SELECT 
        C.Id, C.Name
        FROM Country as C
        WHERE C.Name = '${countryName}'
    `;

    const dataCountry = await sqlQuery(queryCountryId, req.headers.countrycode);
    if (dataCountry === null) {
        return res.status(500).json({ message: "Internal error" });
    }else{
        return dataCountry[0].Id
    }
    
}

async function createOrder(req, countryId, res){
   
    const totalSum = calculateTotal(req);

    const queryCreateOrder = `
        INSERT INTO [Order] (
            CustomerId, 
            Total, 
            OrderDate, 
            CountryId) 
            VALUES ( 
                ${req.user.id}, 
                ${totalSum}, 
                GETDATE(), 
                ${countryId}) SELECT SCOPE_IDENTITY() AS Id`;
    
    const createdOrder = await sqlInsert(queryCreateOrder, req.headers.countrycode)
    if (createdOrder === null) {
        return res.status(500).json({ message: "Internal error" });
    }else{
        return createdOrder;
    }
}

async function createOrderItem(req, orderId, bookId, countryId){
    const queryOrderItem = `
        INSERT INTO OrderItem ( 
            CustomerId, 
            OrderId, 
            BookId, 
            CountryId) 
            VALUES ( 
                ${req.user.id}, 
                ${orderId}, 
                ${bookId}, 
                ${countryId})
    `;

    const createdOrderItem = await sqlInsert(queryOrderItem, req.headers.countrycode);
    if (createdOrderItem === null) {
        return res.status(500).json({ message: "Internal error" });
    }else{
        return createdOrderItem;
    }
    
}

router.post('/checkout', authenticateToken, async(req, res, next) => {

    const countryId = await getCountryId(req, res)
    const createdOrder = await createOrder(req, countryId, res)
    const orderId = createdOrder.recordset[0].Id

    for (let i = 0; i < req.body.shoppingBasket.length; i++) {
        let bookId = req.body.shoppingBasket[i].Id
        let createdOrderItem = createOrderItem(req, orderId, bookId, countryId)
    }

    return res.status(201).send({message: 'Purchase was successful'});
}); 

module.exports = router;