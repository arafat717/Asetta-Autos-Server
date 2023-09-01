const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

/* --------------------------------------------- MongoDB Code Start ------------------------*/


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b0ddt3v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
}
});

async function run() {
    try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const newArrivalCollection = client.db('asetta-db').collection('new-arrivals');
    const bestDealersCollection = client.db('asetta-db').collection('best-dealers');
    const blogsCollection = client.db('asetta-db').collection('our-blogs');
    const usersCollection = client.db('asetta-db').collection('users');
    const OurTeamCollection = client.db('asetta-db').collection('OurTeam');
    const servicesCollection = client.db('asetta-db').collection('services');


    /* ------------------------------ Code here --------------------------------------------- */


    // users collections data here

   




    // for about route data
    app.get('/ourteam', async(req, res)=>{
        const result = await OurTeamCollection.find().toArray();
        res.send(result)
    })

    app.get('/ourteam/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await OurTeamCollection.findOne(query);
        res.send(result)
    })


    // service related data here
    app.get('/services', async(req, res)=>{
        const result = await servicesCollection.find().toArray();
        res.send(result)
    })

    app.get('/services/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await servicesCollection.findOne(query);
        res.send(result)
    })

    
    // new arrials get all data
    app.get('/new-arrivals', async(req, res)=>{
        const result = await newArrivalCollection.find().toArray();
        res.send(result)
    })
    // new arrials get single data find
    app.get('/new-arrivals/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await newArrivalCollection.findOne(query);
        res.send(result)
    })

    // best dealers data get

    app.get('/best-dealers', async(req, res)=>{
        const result = await bestDealersCollection.find().toArray();
        res.send(result)
    })

// best dealers get single data find
    app.get('/best-dealers/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await bestDealersCollection.findOne(query);
        res.send(result)
    })

    // Our Blogs data get

    app.get('/our-blogs', async(req, res)=>{
        const result = await blogsCollection.find().toArray();
        res.send(result)
    })

// best dealers get single data find
    app.get('/our-blogs/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await blogsCollection.findOne(query);
        res.send(result)
    })

     // users data get
    app.get('/users', async(req, res)=>{
        const result = await usersCollection.find().toArray();
        res.send(result)
    })

    // create user
    app.post("/users", async (req, res) => {
        const user = req.body;
        const query = { email: user.email };
        const existing = await usersCollection.findOne(query);
        if (existing) {
          return res.send({ message: "already insert" });
        }
        const result = await usersCollection.insertOne(user);
        res.send(result);
      });

// update user role
// make dealer
    app.patch(`/makeDealer`, async(req, res)=>{
        // const email = req?.body?.email
        const filter = {email : req?.body?.email}
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            dealer_request : 'pending',
          },
        };
  
        const result = await usersCollection.updateOne(filter, updateDoc, options)
        res.send(result)
      })



      // add dealer cars
    app.post("/addACar", async (req, res) => {
        const data = req.body;
        if (!data) {
          return res.send({ message: "data not found" });
        }
        const result = await newArrivalCollection.insertOne(data);
        res.send(result);
      });

    /* ------------------------------ Code here --------------------------------------------- */


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
}
}
run().catch(console.dir);


/* --------------------------------------------- MongoDB Code End ------------------------*/


app.get('/', (req, res) => {
    res.send('Asetta autos server is running');
})
app.listen(port, () => {
    console.log(`Asetta autos server is running on port : ${port}`);
})