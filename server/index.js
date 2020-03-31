const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const {PORT} = require('./constants');
const imdb = require('./imdb');

const DENZEL_IMDB_ID = 'nm0000243';
const MW = 70;

var MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://mongo_denzel:denzel_mongo@denzel-iucxk.mongodb.net/test?retryWrites=true&w=majority";

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/movies/populate/:id', async(request, response) => {

  const actor = request.params.id
	const movies = await imdb(actor);

	await MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, db) {
    	if (err) throw err;
    
      const collection = db.db("mydb").collection(actor);

    	collection.drop();
    	await collection.insertMany(movies, async function(err, res) {
      		if (err) throw err;
      		console.log("Number of documents inserted: " + res.insertedCount);
          data = await collection.estimatedDocumentCount()
          response.send({ "total": data });
      
          db.close();
    	});
  	});
})

app.get('/movies', async(request, response) => {

  await MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, db) {
      if (err) throw err;
    
      const collection = db.db("mydb").collection(DENZEL_IMDB_ID);
      collection.aggregate([{ $match: { "metascore": {"$gte": MW}}}, {$sample: {size: 1}}]).toArray(function(err, docs) {
      response.send(docs[0]);
      db.close();
    });
  });
})

app.get('/movies/search', async(request, response) => {
  
  var limit = 5
  var metascore = 0

  if (request.query.limit) { limit = parseInt(request.query.limit) }
  if (request.query.metascore) { metascore = parseInt(request.query.metascore) }

  await MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, db) {
      if (err) throw err;
    
      const collection = db.db("mydb").collection(DENZEL_IMDB_ID);
      result = await collection.find(
        {"metascore": {"$gte": metascore}}
      ).sort( {"metascore": -1} ).limit(limit).toArray()

      smooth_result = {
        "limit": limit,
        "total": result.length,
        "results": result }
      response.send(smooth_result);
      db.close();
  });
})

app.get('/movies/:id', async(request, response) => {

  const movie_id = request.params.id

  await MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, db) {
      if (err) throw err;
    
      const collection = db.db("mydb").collection(DENZEL_IMDB_ID);
      result = await collection.find({"id": movie_id}).toArray()
      response.send(result[0]);
      db.close();
  });
})

app.post('/movies/:id', async(request, response) => {

  const movie_id = request.params.id
  const date = request.body.date
  const review = request.body.review

  await MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, db) {
      if (err) throw err;
    
      const collection = db.db("mydb").collection(DENZEL_IMDB_ID);
      const result = await collection.update({"id": movie_id}, {$set: {"date": date, "review": review}})
      response.send(result[0]);
      db.close();
  });
})


app.listen(PORT);
console.log(`Running on port ${PORT}`);
