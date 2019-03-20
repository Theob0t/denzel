const imdb = require('./src/imdb');
const DENZEL_IMDB_ID = 'nm0000243';
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://main:esilv2015@denzeldb-luw1i.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "DenzelDB";

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

app.listen(process.env.PORT, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("movies");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

//OK
app.get("/movies/populate", async(request, response) => {
	const movies = await imdb(DENZEL_IMDB_ID);
	collection.insertMany(movies, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
	});
	console.log("The database has been populated.")
});

//OK
app.get("/movies", (request, response) => {
	collection.aggregate([{ $match: { "metascore": {$gt:70}}}, { $sample: { size: 1 }}]).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
    console.log("Query done.");
});

//OK
app.get("/movies/search", (request, response) => {
	//if limit in query === undefined then limit default value = 5 else parseInt
    var limit = (request.query.limit === undefined ? 5 : parseInt(request.query.limit));
    var metascore = (request.query.metascore === undefined ? 0 : parseInt(request.query.metascore));

    collection.find({"metascore": {$gte: metascore}}).limit(limit).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});


//OK
app.get("/movies/:id", (request, response) => {
    collection.findOne({ "id": request.params.id }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

