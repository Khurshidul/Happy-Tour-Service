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
            const adminCollection = database.collection('admin');
            const myOrderCollection = database.collection('myOrder');
            

            app.get('/services', async (req, res) => {
                const cursor = serviceCollection.find({});
                const services = await cursor.toArray();
                res.send(services);
            });




            app.get('/services/:id', async(req, res)=>{
                const id  = req.params.id;
                const query = {_id:objectId(id)};
                const singleService = await serviceCollection.findOne(query);
                res.json(singleService);
            });

            //Order collection
            app.get('/myOrder', async (req, res) => {
                const cursor = myOrderCollection.find({});
                const orders = await cursor.toArray();
                res.send(orders);
            });

            //Admin collection
            app.get('/admin', async (req, res)=>{
                const cursor = adminCollection.find({});
                const admin = await cursor.toArray();
                res.json(admin);

            })


          app.post('/services', async (req, res) => {
              const service = req.body;
              const result = await serviceCollection.insertOne(service);
              console.log(result);
              res.json(result);
          });
          //insert order 
          app.post('/myOrder', async (req, res) => {
              const order = req.body;
              const result = await myOrderCollection.insertOne(order);
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
        //Order delete
        app.delete('/myOrder/:id', async(req, res) => {
            const id  = req.params.id;
            const query ={_id:objectId(id)};
            const result = await myOrderCollection.deleteOne(query);
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