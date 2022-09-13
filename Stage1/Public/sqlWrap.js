'use strict'

const sql = require('sqlite3');
const util = require('util');

const db = new sql.Database("videos.db");

let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='VideoTable' ";

db.get(cmd, function (err, val) {
  if (val == undefined) {
        console.log("No database file - creating one");
        createVideoTable();
  } else {
        console.log("Database file found");
  }
});

function createVideoTable() {
 
  const cmd = 'CREATE TABLE VideoTable (userid TEXT, url TEXT, nickname TEXT, flag INTEGER)';
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}

db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

db.deleteEverything = async function() {
  await db.run("delete from VideoTable");
  await db.run("vacuum");
}

module.exports = db;