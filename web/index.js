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
 * Ingests the .bin files in the json-logs folder
 */
const ingest = (db) => {
	return new Promise((resolve, reject) => {
		const jsonLogPath = '/app/json-logs/';

		const files = [];
		fs.readdirSync(jsonLogPath).forEach(function(file){
		  if (!file.endsWith('.json')){
		  	return;
		  } else {
		  	console.log(`Found ${file}`);
		  	files.push(file);
		  }
		});

		const ingestFns = files.map((file) => (
			() => (ingestFile(db, file, jsonLogPath))
		)); 

		ingestFns.reduce((prev, curr) => {
			return prev.then(curr);
		}, Promise.resolve(1) /*< TODO: */)
		.then(function (result) {
			console.log('Ingestion complete.');
		  resolve();
		}).catch((err) => {reject(err)});
	});
};

/**
 * Ingests a single json log file
 */
const ingestFile = (db, file, jsonLogPath) => {
	return new Promise((resolve, reject) => {
		const insertFile = () => {
			return new Promise((resolve, reject) => {
				// TODO: only allow inserting a given filename once.
				db.collection('rawfiles').insertOne({name: file}, (err, inserted) => {
					resolve(inserted.insertedId);
				});
			});
		};

		/**
		 * Reads an entire json log file
		 */
		const readFile = (rawFileId) => {
			return new Promise((resolve, reject) => {
				// TODO: Move to a streaming JSON file reader
				const options = { encoding: 'utf8'};
				let content = fs.readFileSync(`${jsonLogPath}/${file}`, options);
				content = JSON.parse(content);
				console.log(`-- Found ${content.entries.length} entries`);

				resolve({rawFileId, fileContent: content});
			});
		};

		/**
		 * Writes a json log file's header to the db
		 */
		const insertHeader = ({rawFileId, fileContent}) => {
			return new Promise((resolve, reject) => {
				const toInsert = Object.assign(
					{}, fileContent.header, {rawFileId: rawFileId}
				);
				db.collection('rawheaders').insertOne(toInsert, (err, inserted) => {
					if (err) {
						reject(err);
					}
					resolve({rawFileId, fileContent});
				});
			});
		};

		/**
		 * Writes a json log file's "model" to the db
		 */
		const insertModel = ({rawFileId, fileContent}) => {
			return new Promise((resolve, reject) => {
				const toInsert = Object.assign(
					{}, fileContent.model, {rawFileId: rawFileId}
				);
				db.collection('rawmodels').insertOne(toInsert, (err, inserted) => {
					if (err) {
						reject(err);
					}
					resolve({rawFileId, fileContent});
				});
			});
		};

		/**
		 * Writes each "entry" from a json log file to the db
		 */
		const insertEntries = ({rawFileId, fileContent}) => {
			return new Promise((resolve, reject) => {
				fileContent.entries.forEach((entry) => {
					entry.rawFileId = rawFileId;
				});
				db.collection('rawentries').insertMany(
					fileContent.entries, {}, (err, result) => {
						if (err) {
							reject(err);
						}
						resolve({rawFileId, fileContent});
				});
			});
		};

		insertFile().then(
			readFile
		).then(
			insertHeader
		).then(
			insertModel
		).then(
			insertEntries
		).then((result) => {resolve(result)}
		).catch((err) => {
				reject(err);
		});
	});
};

main();