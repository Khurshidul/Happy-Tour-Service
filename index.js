const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v3x1s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    async function run () {
        try{
            await client.connect();
            const database = client.db('ghurbo');
            const serviceCollection = database.collection('services');
            

            app.get('/services', async (req, res) => {
                const cursor = serviceCollection.find({});
                const services = await cursor.toArray();
                res.send(services);
            });




            app.get('/services/:id', async(req, res)=>{
                const id  = req.params.id;
                console.log("gitting one service",id);
                const query = {_id:objectId(id)};
                const service = await serviceCollection.findOne(query);
                res.json(service);
            });


          app.post('/services', async (req, res) => {
              const service = req.body;
              const result = await serviceCollection.insertOne(service);
              console.log(result);
              res.json(result);
          });






          // Delete operation
        app.delete('/services/:id', async(req, res) => {
            const id  = req.params.id;
            const query ={_id:objectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })

        }
        finally{
            // await client.close();
        }
    }
    run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("server is  running");
});
app.listen(port, ()=>{
    console.log("server is listening");
});