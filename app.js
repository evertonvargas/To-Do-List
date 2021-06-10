const express = require("express");
const mongoose = require("mongoose");
const date = require(__dirname + "/data.js");
const port = 3000;
let items = [];
let workItems = [];

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

function insert() {
  const item1 = new Item({ name: "Bem-vindo ao to-do-list" });
  const item2 = new Item({ name: "Add um novo item" });
  const defaultItems = [item1, item2];

  Item.insertMany(defaultItems, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Cadastro realizado com sucesso");
    }
  });
}

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      insert();
      res.redirect("/")
    } else {
      res.render("list", {
        listTitle: date.getDate(),
        newListItem: foundItems,
      });
    }
  });
});

app.post("/", (req, res) => {
  let item = req.body.newItem;
  if (req.body.list === "Work list") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work list", newListItem: workItems });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
