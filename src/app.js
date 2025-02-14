const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const path = require('path');
const booksRoutes = require('./routes/booksRoutes');

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// EJS Layouts middleware
app.use(expressLayouts);
app.set('layout', 'layout'); // This line sets the default layout

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/books', booksRoutes);

app.get('/', (req, res) => {
  res.render('index'); // No need to specify layout here, it's already set globally
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 

module.exports = app;