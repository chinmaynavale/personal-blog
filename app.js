if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const _ = require('lodash/string');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const startingContent =
  'Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.';
const aboutContent =
  'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const contactContent =
  'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.';

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model('Post', postSchema);

// Home Page
app.get('/', async (req, res) => {
  try {
    await Post.find({}, (err, posts) => {
      res.render('home', {
        startingContent,
        posts: posts,
      });
    });
  } catch (err) {
    console.log('While fetching data at home route', err);
  }
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.newPostTitle,
    body: req.body.newPostBody,
  });

  try {
    await post.save(err => {
      if (!err) {
        res.redirect('/');
      }
    });
  } catch (err) {
    console.log('While Creating Post', err);
  }
});

app.get('/posts/:postId', async (req, res) => {
  const requestedPostId = req.params.postId;

  try {
    await Post.findOne({ _id: requestedPostId }, (err, post) => {
      if (!err) {
        res.render('post', {
          id: post._id,
          title: post.title,
          body: post.body,
        });
      }
    });
  } catch (err) {
    console.log('While fetching Post', err);
  }
});

app.get('/about', (req, res) => {
  res.render('about', { aboutContent });
});

app.get('/contact', (req, res) => {
  res.render('contact', { contactContent });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is up and running on ${PORT}.`));
