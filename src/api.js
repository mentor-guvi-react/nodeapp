const express = require("express");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const fs = require("fs");

const handlers = require("./handlers");
// const signup = require("./db/signup.json");

const app = express();
const router = express.Router();

app.use(`/.netlify/functions/api`, router);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/public", express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

app.use(bodyParser.text());

router.get("/", (req, res) => {
  res.send("server running success");
});

router.get("/form", handlers.handleGetMethod);
router.get("/users/:username", handlers.handleUser);

router.get("/product/:productId", handlers.handleProduct);

router.get("/products/categories", handlers.handleCategories);

router.get("/updatecolor", handlers.updatecolor);

router.post("/createProduct", handlers.createProduct);

router.get("/getAllProducts", handlers.getAllProducts);

router.get("/getProductById/:pId", handlers.getProductById);

router.get("/download", function (req, res) {
  const file = `${__dirname}/videos/sample.mp4`;
  res.download(file);
  res.statusCode = 200;
  res.end("file download success");
});

router.get("/myfile", (req, res) => {
  fs.readFile("./db/productInfo.json", "utf8", function (err, data) {
    if (err) throw err;
    res.send(data);
  });
});

router.post("/signup", (req, res) => {
  var existingUser = [];
  fs.readFile("./db/signup.json", "utf8", function (err, data) {
    if (err) throw err;
    existingUser = [...JSON.parse(data), req.body];
    var writer = fs.createWriteStream("./db/signup.json");
    writer.write(JSON.stringify(existingUser));
    res.send(existingUser);
  });
});

router.get("/login", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  fs.readFile("./db/signup.json", "utf8", function (err, data) {
    if (err) return err;
    const myDB = JSON.parse(data);
    let isValid = false;

    myDB.forEach((element) => {
      if (element.username === username && element.password === password) {
        isValid = true;
        res.send("login success");
        res.end();
      }
    });

    if (!isValid) {
      res.send("login fail");
      res.end();
    }
  });
});

// app.listen(3001, () => {
//   console.log("Server Started Sucess");
// });

module.exports = app;
module.exports.handler = serverless(app);
