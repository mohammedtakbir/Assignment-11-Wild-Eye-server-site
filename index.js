const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//* middleware 
app.use(cors());
app.use(express.json());

const services = require('./Data/services.json')

app.get('/', (req, res) => {
    res.send('Wild Eye server is running!')
})









app.listen(port, () => {
    console.log(`Wild Eye server is running on ${port} port`)
})