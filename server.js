var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 8080;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
  axios.get("http://weeklyworldnews.com/").then(function (response) {
    var $ = cheerio.load(response.data);

    $("article h1").each(function (i, element) {
      // An empty array to save data
      var result = [];
      // save text in "title"
      // var title = $(element).text();
      result.title = $(this).text();
      //save "href" attributes in "link"
      // var link = $(element).children("a").attr("href");
      result.link = $(this).children("a").attr("href");

      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
      //     //if (title && link) {
      //     //};

      // Save results in empty array
      // results.push({
      //   title: title,
      //   link: link
    });
    res.send("Scrape Complete");
  });
});
// axios.get("http://weeklyworldnews.com/").then(function (response) {
//   var $ = cheerio.load(response.data);

//   $("article h1").each(function (i, element) {

//     var result = {};

//     result.title = $(this).text();
//     result.link = $(this).children("a").attr("href");
//     db.Article.create(result)
//       .then(function (dbArticle) {
//         console.log(dbArticle);
//       })
//       .catch(function (err) {
//         console.log(err);
//       });
//   });




// Log the results once you've looped through each of the elements found with cheerio
// // console.log(results);
// res.send("Scrape Complete");


app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});



