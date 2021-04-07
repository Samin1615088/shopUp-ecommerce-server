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
    //get allProducts from mongo and serve client<<

    //deleteProduct from client->server*->mongo >>
    app.delete('/deleteProduct/:id', (req, res) => {
        console.log('request client->server* for DELETE-ONE-PRODUCT');
        console.log("product id to delete", req.params.id);
        const id = {_id: ObjectID(req.params.id)};

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