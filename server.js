const fs = require('fs');
const express = require('express');
const { send } = require('process');
const app = express();

const PRODUCT_URL = './db/catalog.json';
const MENU_URL = './db/menu.json'
const CART_URL = './db/cart.json';


app.listen(3000, () => {
    console.log('Server Start');
});


app.use(express.json());

//путь к каталогу с фронтенд частью
app.use('/', express.static('../home_work/lesson3/dist/'));


app.get('/api/getProduct', (req, res) => {
    fs.readFile(PRODUCT_URL, 'utf8', (err, data) => {
        if(err){
            res.send({
                result: 0,
                err,
            })
        } else {
            res.send(data);
        }
    })
});

app.get('/api/getMenulist', (req, res) => {
    fs.readFile(MENU_URL, 'utf8', (err, data) => {
        if(err){
            res.send({
                result: 0,
                err,
            })
        } else {
            res.send(data);
        }
    })
})

app.get('/api/getBasketList', (req, res) => {
    fs.readFile(CART_URL, 'utf8', (err, data) => {
        if(err){
            res.send({
                result: 0,
                err,
            })
        } else {
            res.send(data);
        }
    })
})

app.delete('/api/delBasket/:id', (req, res) => {
    fs.readFile(CART_URL, 'utf8', (err, data) => {
        if(err) {
            res.send({
                result: 0,
                err,
            });
        } else {
            let basket = JSON.parse(data);
            const newContents = [];

            basket.forEach(item => {
                if(item.id === +req.params.id){
                    if(item.count !== 1) {
                        item.count -= 1;
                        newContents.push(item);
                    }
                } else {
                    newContents.push(item);
                }
            });
            basket = newContents;

            fs.writeFile(CART_URL, JSON.stringify(basket), 'utf8', (err, data) => {
                 if(err){
                     res.send({
                         result: 0,
                         err,
                     });
                 } else {
                     res.send({
                         result: 1,
                         userbasket: basket
                     })
                 }
            })
        }
    })
})

app.post('/api/addToBasket', (req,res) => {
    fs.readFile(CART_URL, 'utf8', (err, data) => {
        if(err){
            res.send({
                result: 0,
                err,
            })
        } else {
            const basket = JSON.parse(data);
            console.log(req.body);
            basket.push(req.body);
            fs.writeFile(CART_URL, JSON.stringify(basket), {encoding: "utf8"}, (err) =>{
                if(err){
                    res.send({
                        result: 0,
                        err,
                    })
                } else {
                    res.send({
                        result: 1,
                        userbasket:basket
                    });
                }
            });
        }
    })
})

app.put('/api/addToBasket/:id', (req, res) => {
    fs.readFile(CART_URL, 'utf8', (err, data) =>{
        if(err){
            res.send({
                result: 0,
                err,
            })
        } else {

            const basket = JSON.parse(data);
            const change = basket.find( item => {
                return item.id === +req.params.id;
            });
            change.count += req.body.count;

            fs.writeFile(CART_URL, JSON.stringify(basket), 'utf8', (err, data) => {
                if(err){
                    res.send({
                        result: 0,
                        err,
                    })
                } else {
                    res.send({
                        result: 1,
                        userbasket:basket
                    })
                }

            })
        }
    })
})