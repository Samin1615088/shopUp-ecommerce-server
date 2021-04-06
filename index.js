const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


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
    console.log('mongodb connection established');
});
//mongodb code<< <<


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});