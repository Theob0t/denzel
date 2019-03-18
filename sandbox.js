/* eslint-disable no-console, no-process-exit */
const imdb = require('./src/imdb');
const assert = require('assert');
const DENZEL_IMDB_ID = 'nm0000243';
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://main:esilv2015@denzeldb-luw1i.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "DenzelDB";
const client = new MongoClient(CONNECTION_URL, { useNewUrlParser: true });


var database, collection;


async function main()
{
    const movies = await imdb(DENZEL_IMDB_ID);
    const dbName = 'movies';

    client.connect(function(err, client) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

        const db = client.db(dbName);

        db.collection("films").insertMany(movies, null, function (error, results) {
            if (error) throw error;

            console.log("Le document a bien été inséré"); 

            client.close();

        });
    });

}


main();


