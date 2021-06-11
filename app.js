require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const date = require(__dirname + "/data.js");
const port = 3000;
const urlCluster = process.env.HOST;
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(urlCluster, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  itemList: [itemsSchema]
});

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({ name: "Bem-vindo ao to-do-list" });
const item2 = new Item({ name: "Add um novo item" });
const defaultItems = [item1, item2];

function insert() {
  Item.insertMany(defaultItems, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Cadastro realizado com sucesso");
    }
  });
}

app.get("/", (req, res) => {
  Item.find({}, async function (err, foundItems) {
    if (foundItems.length === 0) {
      await insert();
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: date.getDate(),
        newListItem: foundItems,
      });
    }
  });
});

app.post("/", (req, res) => {
  let itemName = req.body.newItem;

  const item = new Item({ name: itemName });
  item.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  Item.findByIdAndRemove(req.body.checkbox, function (err) {
    if (!err) {
      console.log("Item deletado com sucesso");
      res.redirect("/");
    } else {
      console.log(err);
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
