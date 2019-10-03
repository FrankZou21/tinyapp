const getUserByEmail = function(email, database) {
  for (const iD in database) {
    if (database[iD].email === email) {
      return database[iD].id;
    }
  }
  return undefined;
}

const generateRandomString = function() {
  return Math.random().toString(36).substr(2, 6);
}

const idLookUp = function(emailIn, users) {
  for (const id in users) {
    if (users[id].email === emailIn) {
      return id;
    }
  }
  return;
}

const urlsForUser = function(id, database) {
  let shortUrls = [];
  for (const urls in database) {
    if(database[urls].userID === id) {
      shortUrls.push(urls);
    }
  }
  return shortUrls;
}

const mapUrls = function(arrShortUrls, database) {
  let mapUrlsDatabase = new Object();
  for (const shortUrl of arrShortUrls) {
    mapUrlsDatabase[shortUrl] = database[shortUrl].longURL;
  }
  return mapUrlsDatabase;
}

module.exports = {
  getUserByEmail,
  generateRandomString,
  idLookUp,
  urlsForUser,
  mapUrls
};