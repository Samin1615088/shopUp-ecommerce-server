const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectID = require('mongodb').ObjectID;


const app = express();
app.use(cors());
app.use(bodyParser.json());
//constant>> 
const port = process.env.PORT || 5050;
//constant<< 

app.get('/', (req, res) => {
    res.send('Hello World!')
});


//mongodb code>> >>
//environmental variable>
const dbUser = process.env.DB_USER;
const dbName = process.env.DB_NAME;
const dbPass = process.env.DB_PASS;
//environmental variable<
const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.bcrd2.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db(dbName).collection("products");
    const ordersCollection = client.db(dbName).collection("orders");
    console.log('mongodb connection established');

    //get allProducts from mongo and serve client>>
    app.get('/allproducts', (req, res) => {
        console.log('request client->server* for ALLPRODUCTS');

        //mongodb>
        productsCollection.find({})
            .toArray()
            .then(documents => {
                console.log('all Products', documents);
                res.send(documents);
            })
            .catch(error => console.log('error', error))
        //mongodb<
    })
    //get allProducts from mongo and serve client<<

    //get allOrders from mongo and serve client using user email>>
    app.get('/orders/:email', (req, res) => {
        console.log('request client->server* for ALLORDERS');
        const email = req.params.email;
        //mongodb>
        ordersCollection.find({email})
        .toArray()
        .then(documents => {
            console.log('all Orders', documents);
            res.send(documents);
        })
        .catch(error => console.log('error', error))
        //mongodb<
    })
    //get allOrders from mongo and serve client using user email<<

    //get singleProduct using _id from mongo and serve client>>
    app.get('/product/:id', (req, res) => {
        console.log('request client->server* for SINGLEPRODUCT');
        const id = ObjectID(req.params.id)
        console.log(id);
        //mongodb>
        productsCollection.find({ _id: id })
            .toArray()
            .then(documents => {
                console.log('single Product', documents[0]);
                res.send(documents[0]);
            })
            .catch(error => console.log('error', error))
        //mongodb<
    })
    //get allProducts from mongo and serve client<<

    //addProduct from client->server*->mongo >>
    app.post('/addProduct', (req, res) => {
        console.log('request client->server* for ADD-PRODUCT');
        console.log("req.body ", req.body);
        const product = req.body;


        //mongodb>
        productsCollection
            .insertOne(product)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0);
            })
        //mongodb<
    })
    //addProduct from client->server*->mongo <<

    //addProduct in Order from client->server*->mongo >>
    app.post('/placeorder', (req, res) => {
        console.log('request client->server* for ADD-PRODUCT in Order');
        console.log("req.body ", req.body);
        const orderedProduct = req.body;

        //mongodb>
        ordersCollection
            .insertOne(orderedProduct)
            .then(result => {
                console.log(result);
                res.redirect('/');
                // res.send(result.insertedCount > 0);
            })
        //mongodb<
    })
    //addProduct in Order from client->server*->mongo <<

    //deleteProduct from client->server*->mongo >>
    app.delete('/deleteProduct/:id', (req, res) => {
        console.log('request client->server* for DELETE-ONE-PRODUCT');
        console.log("product id to delete", req.params.id);
        const id = { _id: ObjectID(req.params.id) };

        //mongodb>
        productsCollection.deleteOne(id)
            .then(result => {
                console.log(result);
                res.send(result.deletedCount > 0);
            });

        //mongodb<
    })
    //get allProducts from mongo and serve client<<

});
//mongodb code<< <<


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});