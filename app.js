const express = require("express");
const path = require("path");
const app = express();
const userModel = require("./models/user");
const user = require("./models/user");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/read", async (req, res) => {
  let allUsers = await userModel.find();
  res.render("read", { users: allUsers });
});

app.get("/delete/:id", async (req, res) => {
  let allUsers = await userModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  try {
    let user = await userModel.findById(req.params.id);  // Fetch the user by ID
    if (user) {
      res.render("edit", { user });  // Render edit page with user data
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user");
  }
});

app.post("/update/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    await userModel.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
});

app.post("/create", async (req, res) => {
  let { name, email, image } = req.body;
  let createdUser = await userModel.create({
    name,
    email: email, //only email will work too if both side are equal
    image,
  });

  res.redirect('/read');
});

app.listen(5555);
