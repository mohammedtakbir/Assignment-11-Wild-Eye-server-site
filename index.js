const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//* middleware 
app.use(cors());
app.use(express.json());

// const services = require('./Data/services.json');

app.get('/', (req, res) => {
    res.send('Wild Eye server is running!')
})

app.get('/services', (req, res) => {
    res.send(services)
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.drjbcpx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)
async function run() {
    const servicesCollection = client.db('wildEye').collection('services');
    try {
        
    }
    finally {

    }
}
run().catch(err => console.log(err));







app.listen(port, () => {
    console.log(`Wild Eye server is running on ${port} port`)
})