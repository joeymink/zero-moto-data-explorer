const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://mongo:27017";

/**
 * Main function. Currently just triggers ingestion.
 */
const main = () => {
	// TODO: improve this err handling!
	const errFn = (err) => {
		console.log(err);
		process.exit(1);
	};

	connectToDatabase().then(
		initDatabase
	).then(
		ingest
	).then(
		() => {
			console.log("Done.");
			process.exit(0);
		}
	).catch(errFn);
};

/**
 * Returns a mongo database instance.
 */
const connectToDatabase = () => {
	return new Promise((resolve, reject) => {
		const client = new MongoClient(uri, { useNewUrlParser: true });

		client.connect(err => {
			if (err) {
				return reject(err);
			}
			resolve(client.db("zero-moto"));
		});
	});
};

/**
 * Initializes the MongoDB database with collections
 * we need for ingesting raw JSON log data.
 */
const initDatabase = (db) => {
	return new Promise((resolve, reject) => {
		const collections = db.collections();
/*
		['filenames', 'headers', 'models', 'entries'].forEach((name) => {
			if (!collections.map(c => c.s.name).includes(name)) {
		    db.createCollection(name); // TODO: make async
			}
		});
*/
		resolve(db);
	});
};

/**
 * Ingests the .bin files in the json-logs folder
 */
const ingest = (db) => {
	return new Promise((resolve, reject) => {
		const jsonLogPath = '/app/json-logs/';

		fs.readdirSync(jsonLogPath).forEach(function(file){
		  if (!file.endsWith('.json')){
		  	return;
		  } else {
		  	console.log(`Ingesting ${file} ...`);

		  	// TODO: Move to a streaming JSON file reader
		  	const options = { encoding: 'utf8'};
		  	let content = fs.readFileSync(`${jsonLogPath}/${file}`, options);
		  	content = JSON.parse(content);
		  	console.log(`Found ${content.entries.length} entries in ${file}!`);
		  }
		});

		resolve();
	});
};

main();