const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');

//* middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Wild Eye server is running!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.drjbcpx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }
    const token = authHeaders.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden Access' })
        }
        req.decoded = decoded
    })
    next();
}

async function run() {
    const servicesCollection = client.db('wildEye').collection('services');
    const reviewsCollection = client.db('wildEye').collection('reviews');
    try {

        //* JWt
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.json({ token });
        })

        //* services APIs
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/home', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })

        app.get('/service-details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        })

        //* reviews APIs
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertMany(review);
            res.send(result);
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: id };
            const cursor = reviewsCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })

        app.get('/reviews', verifyJWT, async (req, res) => {
            const decoded = req.decoded
            if (decoded.email !== req.query.email) {
                return res.status(403).send({ message: 'Unauthorized Access' })
            }
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const userReview = req.body;
            const query = { _id: ObjectId(id) };
            const updatedReview = {
                $set: {
                    review: userReview.review
                }
            };
            const result = await reviewsCollection.updateOne(query, updatedReview);
            res.send(result);
            console.log(updatedReview);
        })
    }
    finally {

    }
}
run().catch(err => console.log(err));







app.listen(port, () => {
    console.log(`Wild Eye server is running on ${port} port`)
})