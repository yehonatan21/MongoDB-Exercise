const { MongoClient } = require('mongodb')

let dbConnection

function connectToDB(dbName, cb) {
  MongoClient.connect(`mongodb://localhost:27017/${dbName}`)
    .then((client) => {
      dbConnection = client.db();
      return cb();
    })
    .catch((err) => {
      console.log(err);
      return cb(err);
    });
}

function getDB() {
  return dbConnection;
}

function creatrIndex(db, collectionName) {
  db.collection(collectionName).createIndex({ pages: 250 })
}

function createAuthor(db, collectionName, firstName, lastName, birthYear) {
  const author = {
    firstName: firstName,
    lastName: lastName,
    birthYear: birthYear
  }
  addDocToCollection(db, collectionName, author)
  return author
}

function createBook(db, collectionName, name, discreption, published, author, pages) {
  const book = {
    name: name,
    discreption: discreption,
    published: published,
    author: author,
    pages: pages
  }
  addDocToCollection(db, collectionName, book)
}

async function getBooksByPages(db, collectionName) {
  return await db.collection(collectionName).find({ pages: { $gte: 250 } }).sort({ pages: 1 }).toArray()
}

async function addDocToCollection(db, collectionName, doc) {
  await db.collection(collectionName).insertOne(doc);
}

// async function returnCollection(db, collectionName) {
//   return await db.collection(collectionName).find({}).toArray()
// }

connectToDB('books', async (err) => {
  if (!err) {
    db = getDB();
    const author = createAuthor(db, 'authors', 'Yehonatan', 'Shabtai', 1999)
    createBook(db, 'books', 'the ring', ' good book', '1.1.2022', author, 600);
    createBook(db, 'books', 'the teacher', 'very good book', '1.1.2022', author, 500);
    createBook(db, 'books', 'the wind', 'very bad book', '1.1.2022', author, 250);
    createBook(db, 'books', 'the loyer', 'very good book', '1.1.2022', author, 400);
    createBook(db, 'books', 'water fall', 'very good book', '1.1.2022', author, 150);
    createBook(db, 'books', 'Gold', 'very good book', '1.1.2022', author, 50);
    creatrIndex(db, 'books')
    // getBooksByPages(db, 'books')
    console.log(await getBooksByPages(db, 'books')); // #BUG: can't sort in the first init when creating the db
  }
});