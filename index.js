const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require("jsonwebtoken");
const SSLCommerzPayment = require('sslcommerz-lts')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: "unauthorize access" });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.CAR_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorize access" });
    }
    req.decoded = decoded;
  });
  next();
};

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

const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASS
const is_live = false //true for live, false for sandbox


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const newArrivalCollection = client.db('asetta-db').collection('new-arrivals');
    const bestDealersCollection = client.db('asetta-db').collection('best-dealers');
    const blogsCollection = client.db('asetta-db').collection('our-blogs');
    const clientReviewCollection = client.db('asetta-db').collection('clientReview');
    const cardsCollections = client.db('asetta-db').collection('cardsCollections');
    const blogCommentsCollection = client.db('asetta-db').collection('blogCommentsCollection');
    const usersCollection = client.db('asetta-db').collection('users');
    const OurTeamCollection = client.db('asetta-db').collection('OurTeam');
    const stufCollection = client.db('asetta-db').collection('stufCollection');
    const servicesCollection = client.db('asetta-db').collection('services');
    const usedCollection = client.db('asetta-db').collection('addUsedCar');
    const WhatWeOfferCollection = client.db('asetta-db').collection('WhatWeOffer');
    const OrderCollection = client.db('asetta-db').collection('order');
    const carbodyTypeCollection = client.db('asetta-db').collection('carbodyType');



    /* ------------------------------ Code here --------------------------------------------- */


    // jwt

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.CAR_TOKEN_SECRET, {
        expiresIn: '30d'
      });
      res.send({ token });
    });


    // users collections data here


    // carbodyType collections data here
    app.get('/carbodyType', async (req, res) => {
      const result = await carbodyTypeCollection.find().toArray();
      res.send(result)
    })

    app.get('/carbodyType/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await carbodyTypeCollection.findOne(query);
      res.send(result)
    })




    //  WhatWeOffer collection data here
    app.get('/WhatWeOffer', async (req, res) => {
      const result = await WhatWeOfferCollection.find().toArray();
      res.send(result)
    })


    app.get('/WhatWeOffer/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await WhatWeOfferCollection.findOne(query);
      res.send(result)
    })




    // for about route data
    app.get('/ourteam', async (req, res) => {
      const result = await OurTeamCollection.find().toArray();
      res.send(result)
    })

    app.get('/ourteam/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await OurTeamCollection.findOne(query);
      res.send(result)
    })


    // service related data here
    app.get('/services', async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result)
    })

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await servicesCollection.findOne(query);
      res.send(result)
    })


    // new arrials get all data
    app.get('/new-arrivals', async (req, res) => {
      const result = await newArrivalCollection.find().toArray();
      res.send(result)
    })
    // new arrials get single data find
    app.get('/new-arrivals/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await newArrivalCollection.findOne(query);
      res.send(result)
    })

    // best dealers data get

    app.get('/best-dealers', async (req, res) => {
      const result = await bestDealersCollection.find().toArray();
      res.send(result)
    })

    // best dealers get single data find
    app.get('/best-dealers/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bestDealersCollection.findOne(query);
      res.send(result)
    })

    // stuf  data load
    app.get('/ourStuf', async (req, res) => {
      const result = await stufCollection.find().toArray();
      res.send(result)
    })

    // client review data get

    app.get('/client-review', async (req, res) => {
      const result = await clientReviewCollection.find().toArray();
      res.send(result)
    })

    // review post

    app.post("/client-review", async (req, res) => {
      const review = req.body;
      const result = await clientReviewCollection.insertOne(review);
      res.send(result);
    });


    // cards data get

    app.get('/cards', verifyJWT, async (req, res) => {
      const email = req.query.email
      if(!email) {
        return res.send([])
      }

      const decodedEmail = req.decoded?.email
       if(decodedEmail !== email){
        return res.status(403).send({message : 'not found'})
       }

      const filter = {email : email}
      const result = await cardsCollections.find(filter).toArray();
      if (result.length === 0) {
        return res.status(404).send({ message: 'not found' });
      }
      res.send(result)
    })


    // add to card

    app.post("/addToCard", async (req, res) => {
      const card = req.body;
      const result = await cardsCollections.insertOne(card);
      res.send(result);
    });
    // delete cards form my cards

    app.delete("/deleteCard/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cardsCollections.deleteOne(query);
      res.send(result);
    });

    // Our Blogs data get

    app.get('/our-blogs', async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result)
    })
    // Blogs post

    app.post("/blogPost", async (req, res) => {
      const blog = req.body;
      const result = await blogsCollection.insertOne(blog);
      res.send(result);
    });


    // blog like
    app.patch(`/blogLike/:id`, async (req, res) => {
      const id = req.params.id;
      const likeEmail = req.body.email
      const filter = { _id: new ObjectId(id) }
      const findBlog = await blogsCollection.findOne(filter)
      findBlog.loveEmails.push(likeEmail)
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          loveEmails: findBlog.loveEmails
        },
      };
      const result = await blogsCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })


    // blog dis like
    app.patch(`/blogDisLike/:id`, async (req, res) => {
      const id = req.params.id;
      const likeEmail = req.body.email
      const filter = { _id: new ObjectId(id) }
      const findBlog = await blogsCollection.findOne(filter)


      let newEmails = findBlog?.loveEmails.filter(em => em !== likeEmail);

      const options = { upsert: true };
      const updateDoc = {
        $set: {
          loveEmails: newEmails
        },
      };
      const result = await blogsCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })

    // Blogs comment data get

    app.get('/blogComments/:id', async (req, res) => {
      const id = req.params.id;
      const query = { postId: id }
      const result = await blogCommentsCollection.find(query).toArray();
      res.send(result)
    })
    // Blogs comments post

    app.post("/blogComments", async (req, res) => {
      const blog = req.body;
      const result = await blogCommentsCollection.insertOne(blog);
      res.send(result);
    });

    // best dealers get single data find
    app.get('/our-blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await blogsCollection.findOne(query);
      res.send(result)
    })
    /* ------------------------------ Code here --------------------------------------------- */



    /* search feild here (atiq) */
    app.get("/findName/:text", async (req, res) => {
      const text = req.params.text;
      const result = await newArrivalCollection.find({
        $or: [
          { make: { $regex: text, $options: "i" } },

        ],
      })
        .toArray();
      res.send(result);
    });

    /* CAR CATEGORY (atiq)*/

    app.get('/new-arrivals/:make', async (req, res) => {
      const id = req.params.make;
      const toys = await newArrivalCollection.find({ make: id }).toArray()
      res.send(toys)
    })



    // users data get
    app.get('/users', async (req, res) => {
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
    app.patch(`/makeDealer`, async (req, res) => {
      // const email = req?.body?.email
      const filter = { email: req?.body?.email }
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          dealer_request: 'pending',
        },
      };

      const result = await usersCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })
    // make dealer confirm
    app.patch(`/makeDealerConfirm/:id`, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      // const filter = {email : req?.body?.email}
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          dealer_request: 'success',
          role: 'dealer'
        },
      };

      const result = await usersCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })
    //  dealer reject
    app.patch(`/dealerReject/:id`, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      // const filter = {email : req?.body?.email}
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          dealer_request: 'rejected',
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




    app.post('/add-car-user', async (req, res) => {
      const adding = req.body;
      const result = await usedCollection.insertOne(adding)
      res.send(result)
    })


    app.get('/myInfo', async (req, res) => {
      // const email = req.params.email;
      // const filter = {userEmail : email}
      // const result = await usedCollection.find(filter).toArray();
      const result = await usedCollection.find().toArray();
      res.send(result);
    })

const tran_id = new ObjectId().toString()
  app.post("/getmoney", async(req, res) =>{
   const product = await cardsCollections.findOne({
    _id: new ObjectId(req.body.orderId)
   });
   const order = req.body;
    const data = {
      total_amount: product?.price,
      currency: order.currency,
      tran_id: tran_id, // use unique tran_id for each api call
      success_url: `https://asetta-autos-production.up.railway.app/payment/success/${tran_id}`,
      fail_url: 'http://localhost:3030/fail',
      cancel_url: 'http://localhost:3030/cancel',
      ipn_url: 'http://localhost:3030/ipn',
      shipping_method: 'Courier',
      product_name: 'Computer.',
      product_category: 'Electronic',
      product_profile: 'general',
      cus_name: order.name,
      cus_email: 'customer@example.com',
      cus_add1: order.address,
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'USA',
      cus_phone: '01711111111',
      cus_fax: '01711111111',
      ship_name: 'Customer Name',
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'USA',
  };

      // console.log(data);

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
  sslcz.init(data).then(apiResponse => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL
      res.send({url: GatewayPageURL});

      const finalOrder = {
        product,
        paidStatus: false,
        tranjectionId: tran_id,
      };
      const result = OrderCollection.insertOne(finalOrder);

      console.log('Redirecting to: ', GatewayPageURL)
  });

app.post("/payment/success/:tranId", async(req, res)=>{
console.log(req.params.tranId);
const result= await OrderCollection.updateOne({
 tranjectionId: req.params.tranId},
 {
  $set:{
    paidStatus:true,
  },
});

if(result.modifiedCount > 0){
  res.redirect(`https://asetta-autos-645ad.web.app/payment/success/${req.params.tranId}`)
};

})



  })

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