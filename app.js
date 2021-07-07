const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoListDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name:"Welcom to todo list"
});

const item2 = new Item({
    name:"Hit the + button to add a new item"
});

const item3 = new Item({
    name:"hit this to delete an item"
});

const defaultItems = [item1, item2, item3];


app.set("view engine", "ejs");

app.get("/", function(_req, res){
 
Item.find({}, function(_err, foundItems){

    if(foundItems.length === 0){
        Item.insertMany(defaultItems, function(err){
    if (err) {
        console.log(err);
    }
    else {
        console.log("Successfully Saved defaultItems to Database.")
    }
});
res.redirect("/");
    }
    else {
        res.render("list",{kindOfDay: "Today", newListItems: foundItems});
    }
  });
});

app.post("/", function(req, res){
    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    item.save();
    res.redirect("/");
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId, function(err){
        if (!err){
            console.log("Successfully deleted checked item.")
            res.redirect("/");
        }
    });
});

app.get("/about", function(_req, res){
    res.render("about");
});
app.listen(3000, function(){
    console.log("Server started on port 3000");
});