const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Tutorial = require('./tutorial');

app.use(express.json());
app.use(logger);
require('dotenv/config');

function logger (req, res, next) {
    console.log('request fires:  URL:' + req.url + '  Method: ' + req.method);
    next();
}

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true}, () => console.log('DB connected!'));


// Get Methods
app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/tutorials', async (req, res) => {
  try {
    if (req.query.title) {
      let title = req.query.title
      console.log(title)
      const tutorials = await Tutorial.find({ title: title })
      res.json(tutorials)
    }
    else {
      const tutorials = await Tutorial.find();
      res.json(tutorials);
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/tutorials/published', async (req, res) => {
  try {
    const tutorial = await Tutorial.find({isPublished: true});
    res.json(tutorial);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/tutorials/notPublished', async (req, res) => {
  try {
    const tutorial = await Tutorial.find({isPublished: false});
    res.json(tutorial);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/tutorials/:id', async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    res.json(tutorial);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


// Post Method
app.post('/tutorials', (req, res) => {
  const tutorial = new Tutorial({
    title: req.body.title,
    content: req.body.content,
    isPublished: req.body.isPublished,
    date: new Date()
  });
  tutorial.save().then(doc => {
    res.send(doc);
  }).catch(err => {
    res.status(400).send(err.message);
  });
});

// Patch Method
app.patch('/tutorials/:id', async (req, res) => {
  try {
    const result = await Tutorial.update({_id: req.params.id}, {$set: req.body})
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
})


// Delete Methods
app.delete('/tutorials/:id', async (req, res) => {
  try {
    const result = await Tutorial.deleteOne({_id: req.params.id})
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

app.delete('/tutorials', async (req, res) => {
  try {
    const result = await Tutorial.deleteMany()
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

app.listen(process.env.PORT);