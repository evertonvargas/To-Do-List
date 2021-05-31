const express = require("express");
const port = 3000;
let items = [];

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static("public"))
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  let today = new Date();

  let options = {
      weekday: "long",
      day: "numeric",
      month: "long"
  }

  let day = today.toLocaleDateString("pt-BR", options)

  res.render("list", { kindofday: day, newListItem: items});
});

app.post("/", (req, res) => {
    let item = req.body.newItem;
    items.push(item)
    res.redirect("/")
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});