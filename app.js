//back end code for a RESTful API (wikipedia style) with articles and subjects.

//setting up const for npm modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

//setting the app to use express.js
const app = express();

//setting ejs as engine
app.set('view engine', 'ejs');

//using body-parser to parse request
app.use(bodyParser.urlencoded({
  extended: true
}));

//using public directory to store static files
app.use(express.static("public"));

//connection mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

//creating DB schema
const articleSchema = {
  title: String,
  content: String
};

//creating mongodb model
const Article = mongoose.model("Article", articleSchema);

//creating express.js route targeting **ALL** articles

app.route("/articles")
  //fetching all the articles with a get route
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  //creating a new article to add to the db and check for errors.
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  //creating a delete request for ALL the articles in the collection
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  })

//creating express.js route targeting **A SPECIFIC** article

app.route("/articles/:articleTitle")
  //fetching a specific article with a get route
  .get(function(req, res) {

    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching found.");
      }
    });
  })
  //updating a specific article with put route
  .put(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      },

      function(err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  //patching a specific document article within the collection
  .patch(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated the article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  //deleting a specific article from the db
  .delete(function(req, res) {
    Article.deleteOne({
        title: req.params.articleTitle
      },
      function(err) {
        if (!err) {
          res.send("Successfully deleted the corresponding article");
        } else {
          res.send(err);
        }
      }
    );
  });


//logging console to see if server is running correctly
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
