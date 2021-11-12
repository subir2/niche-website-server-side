const express=require("express");
const { MongoClient ,ObjectId} = require('mongodb');
const cors=require("cors");
require('dotenv').config();




const app=express();
const port=process.env.PORT||5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nw8x5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Running Own Server");
     //console.log("Running Own Server");
   });
   
   client.connect((err) => {
    const servicesCollection = client.db("BabyCare").collection("services");
     const usersCollection = client.db("BabyCare").collection("users");
    const ordersCollection = client.db("BabyCare").collection("orders");
     const reviewCollection = client.db("BabyCare").collection("review");
  
    //add servicesCollection
    app.post("/addServices", async (req, res) => {
     
      const result = await servicesCollection.insertOne(req.body);
      res.send(result);
    });
  
    //get all services

    app.get("/allServices", async (req, res) => {
      const result = await servicesCollection.find({}).toArray();
      res.send(result);
    });
  
    // single service


    app.get("/singleService/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await servicesCollection
        .find({ _id: ObjectId(req.params.id) })
        .toArray();
      res.send(result[0]);
      // console.log(result);
    });
  

    // insert order and
  
    app.post("/addOrders", async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
     
      res.send(result);
    });
  
    //  my order
  
    app.get("/myOrder/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
  
    // review
    app.post("/addSReview", async (req, res) => {
      const result = await reviewCollection.insertOne(req.body);
      res.send(result);
    });
  

    //User Create

    app.post("/addUserInfo", async (req, res) => {
      console.log("req.body");
      const result = await usersCollection.insertOne(req.body);
      res.send(result);
      // console.log(result);
    });


    //  make admin
  
    app.put("/makeAdmin", async (req, res) => {
      const filter = { email: req.body.email };
      const result = await usersCollection.find(filter).toArray();
      if (result) {
        const documents = await usersCollection.updateOne(filter, {
          $set: { role: "admin" },
        });
      
      }
     
    });
  
    // check admin or not
    app.get("/checkAdmin/:email", async (req, res) => {
      const result = await usersCollection
        .find({ email: req.params.email })
        .toArray();
     
      res.send(result);
    });
   
  
    /// all order
    app.get("/allOrders", async (req, res) => {
      // console.log("hello");
      const result = await ordersCollection.find({status:"pending"}).toArray();
      res.send(result);
    });
  
    // status update
    app.put("/statusUpdate/:id", async (req, res) => {
      const filter = { _id:ObjectId(req.params.id) };
      console.log(req.body.status);
      const result = await ordersCollection.updateOne(filter, {
        $set: {
          status: "approved",
        },
      });
      res.send(result);
      // console.log(result);
    });
    //delete from MyBooking
    
    app.delete("/deleteorder/:id",async(req,res)=>{
      console.log(req.params.id);
      const result= await ordersCollection.deleteOne({
        _id:ObjectId(req.params.id),
      });
      res.send(result);

    })
    app.delete("/deleteorderManager/:id",async(req,res)=>{
      console.log(req.params.id);
      const result= await ordersCollection.deleteOne({
        _id:ObjectId(req.params.id),
      });
      
      res.send(result);

    })

    app.delete("/deleteproductManager/:id",async(req,res)=>{
      console.log(req.params.id);
      const result= await servicesCollection.deleteOne({
        _id:(req.params.id),
      });
      
      console.log(result);
      res.send(result);

    })

  });

  
  

   
app.listen(port,()=>{
    console.log("Running server on port",port);
    });