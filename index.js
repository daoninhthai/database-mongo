const express =require("express");
const app =express();
const bodyparser =require("body-parser");
app.set("view engine","ejs");

let db ;
const MongoClient = require("mongodb").MongoClient;
app.listen(process.env.PORT || 5000)
app.use(express.static(__dirname));
 MongoClient.connect("mongodb+srv://daoninhthai:fy3kD102HF63LTt6@cluster0-mgy1e.azure.mongodb.net/mongodb?retryWrites=true&w=majority", (err, client) => {
     if (err) {
        return console.log(err)
    }
    db = client.db("travel");
    console.log("Đã kết nối tới database travel");
})
app.use(bodyparser.urlencoded({extended:true}));

app.get("/travel",function(req ,res){
    //res.send("hú from server");
    let title = [
    {

        class:"grid-item",
        name:"Thành phố Amsterdam, Hà Lan",
        anh: "image/1.jpg" },
    {   
        class:"grid-item",
        name:"Thủ đô Ljubljana, Slovenia",
        anh:"image/2.jpg"
    },
    {   
        class:"grid-item",
        name:"Thác Victoria, Cộng hoà Zimbabwe",
        anh:"image/3.jpg"
    },
    {   
        class:"grid-item",
        name:"Bán đảo Lofoten, Na Uy",
        anh:"image/4.jpg"
    },
    {   
        class:"grid-item",
        name: "Thung lũng Cappadocia, Thổ Nhĩ Kỳ",
        anh:"image/5.jpg"
    },
    {   
        class:"grid-item",
        name:"Quần đảo Azores, Bồ Đào Nha",
        anh:"image/6.jpg"
    }
    ]
    res.render("index.ejs" ,{results:title});
    
 })
 app.get("/travel2" ,function(req,res){
     db.collection("products").find().toArray().then(results => {
         console.log(results)
         res.render("index.ejs",{todoList:results})
     }).catch(error =>{
         console.error(error)
     })

 })
 app.get("/travel2/:todoId",function(req,res){
     let id = req.params["todoId"];
     let objectId =require("mongodb").ObjectID
     
     console.log(id);
     db.collection("products").findOne({_id : new objectId(id) }).then(results => {
        console.log(results)
        
        res.render("todo.ejs",{todo:results})
    }).catch(error =>{
        console.error(error)
    })
 });
 app.post("/travel2",function(req,res){
     console.log("da nhan request")
     db.collection("products").insertOne(req.body).then(results => {
         console.log(results)
         db.collection("products").find().toArray().then(results => {
            console.log(results)
            res.render("index.ejs",{todoList:results})
        })
     }).catch(error => {
         console.log(error)
     })
 })
 app.post("/update",function(req,res){
    console.log("da nhan request" ,req.body)
    let objectId =require("mongodb").ObjectID;
    db.collection("products").findOneAndUpdate(
        {_id :new objectId(req.body.id) },
        { $set: { name: req.body.name}  },
        { $set: { anh: req.body.anh} }).then(results => {
      console.log(results)
      db.collection("products").find().toArray().then(results => {
        console.log(results)
        res.render("index.ejs",{todoList:results})
    })
    }).catch(error => {
        console.error(error);
        res.send("index.ejs")
    })
})
 
app.post("/delete",function(req,res){
    console.log("da nhan request" ,req.body)
    let objectId =require("mongodb").ObjectID
    db.collection("products").deleteOne({_id :new objectId(req.body.id) }).then(results => {
      console.log(results)
      db.collection("products").find().toArray().then(results => {
        console.log(results)
        res.render("index.ejs",{todoList:results})
    })
    }).catch(error => {
        console.error(error)
        
    })
})
