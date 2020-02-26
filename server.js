'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

let { stock, customers } = require('./data/promo.js');  // I changed this to a let instead of a const declaration so I could add information to it

const PORT = process.env.PORT || 8000;

let list = [];  // Scoping variables so they survive outside functions
let number = 0;
let i = 0;

// I tend to start working before I read instructions... consequentially, I did exercise 1 in a similar fashion to the friendFace
// where we used .get instead of .post to pass information off to the server
// so, for fun, I left that in on one page, and used post on the second.  The result is that it looks like there is a huge duplication of code lol.
// Otherwise, I would have merged homelist.ejs and failedToAdd.ejs into one file and had a conditional sentence that would appear if a failed to add state were true.
// I'm sure I'm missing the inner workings of what is going on, but I don't see a big difference between using post and get to send data to the server.


const handleAdd = (req, res) => {           //e1
    let newItem = req.query.item;
    if (newItem == false) {
        res.redirect('/tryAgain');
        return;
    }
    else {
        let blank = true;
        let length = newItem.length;
        for(i=0; i<length; i++) {
            if (newItem[0] == ' ') {
                newItem= newItem.substring(1);
            }
            else blank = false;
        }
        if (blank === true) res.redirect('/tryAgain');
        else {
            list.push(newItem);
            number ++;
            res.redirect('/');
        }
    }
}

const handleAdd2 = (req, res) => {          //e1
    let newItem = req.body.item;
    if (newItem == false) {
        res.redirect('/tryAgain');
        return;
    }
    else {
        let blank = true;
        let length = newItem.length;
        for(i=0; i<length; i++) {
            if (newItem[0] == ' ') {
                newItem= newItem.substring(1);
            }
            else blank = false;
        }
        if (blank === true) res.redirect('/tryAgain');
        else {
            list.push(newItem);
            number ++;
            res.redirect('/');
        }
    }
}

const handleFailedToAdd = (req, res) => {   //e1
    res.render('../e1/failedToAdd', {
        list: list,
        number: number
    });
}

const handleRemove = (req, res) => {        //e1
    let item = req.params.item;
    list.splice(list.indexOf(item), 1);
    number --;
    res.redirect('/');
}

const handleHome = (req, res) => {          //e1
    res.render('../e1/homelist', {
        list: list,
        number: number
    });
}

const handleSubmit2 = (req, res) => {        //e2
    // test if any fields are blank
    if (req.body.order === 'undefined' || (req.body.order === 'shirt' && req.body.size === 'undefined') || req.body.givenName === '' ||
    req.body.surname === '' || req.body.email === {} || req.body.address === '' || req.body.city === '' ||
    req.body.province === '' || req.body.postcode === '' || req.body.country === '') {
        res.send({
            'status': 'error',
            'error': '000'
        });
        return;
    }
    let userAlreadyOrdered = false;
    // test if user's first and last name match or if their house number and street match
    customers.forEach((client)=>{
        if ( (client.givenName === req.body.givenName) && (client.surname === req.body.surname) ) {
            userAlreadyOrdered = true;
        }
        if (client.address === req.body.address && req.body.address != '') {
            userAlreadyOrdered = true;
        }
    })
    console.log(userAlreadyOrdered);
    if (userAlreadyOrdered) {
        res.send({
            'status': 'error',
            'error': '550'
        });
        return;
    }
    // test if they are in Canada
    if (req.body.country.toUpperCase() != 'CANADA') {
        res.send({
            'status': 'error',
            'error': '650'
        });
        return;
    }
    // test if item is in stock
    let itemInStock = false;
    if (req.body.order === 'bottle' && stock.bottles > 0) {
        itemInStock = true;
    }
    else if (req.body.order === 'socks' && stock.socks > 0) {
        itemInStock = true;
    }
    // I would have merged the above two except the data comes in as bottle and socks but the stock keys are bottles and socks... not the same </3 's'
    else if (req.body.order === 'shirt' && stock.shirt[req.body.size] >0) {
        itemInStock = true;
    }
    if (!itemInStock) {
        res.send({
            'status': 'error',
            'error': '450'
        });
        return;
    }
    customers.unshift(req.body);
    // console.log(customers);
    res.send({
        'status': 'success',
    });



    // res.redirect('/order-confirmation', {
    //     'status': 'success',
    //     info: req.body
    // });
}

const handleOrderSuccess = (req, res) => {
    console.log(customers[0]);
    res.render('../e2/orderSuccess', {
        order: customers[0]
    });
}

express()
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
	.use(morgan('tiny'))
	.use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({extended: false}))
    .set('view engine', 'ejs')

    // endpoints

    .post('/order', handleSubmit2)
    .post('/removeItem/:item', handleRemove)
    .post('/addItem2', handleAdd2)


    .get('/order-confirmed', handleOrderSuccess)
    .get('/addItem', handleAdd)
    .get('/tryAgain', handleFailedToAdd)
    .get('/', handleHome)
    .get('*', (req, res) => res.send('Dang. 404.'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));