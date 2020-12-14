if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}



const express = require('express')
const app = express(); 
const mongoose = require('mongoose')
const Note = require('./models/note')
const methodOverride = require('method-override'); 

const ejs = require('ejs')
const path = require('path'); 

const noteRouter = require('./routes/notes')


const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/markDown";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});


  

app.set('view engine', 'ejs')
app.set('views' , path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))


app.get('/', async (req, res) => { 

  const notes = await Note.find().sort({
    createdAt: 'desc'
  })
    res.render('notes/index', { notes: notes})
})


app.use("/notes", noteRouter);

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
