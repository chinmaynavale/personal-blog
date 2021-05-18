const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home Page
app.get('/', (req, res) => {
  res.render('home');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is up and running on ${PORT}.`));
