const getUserByEmail = function(email, database) {
  for (const id in database) {
    if (database[id].email === email) {
      return database[id];
    }
  }
  return false;
}

function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
}

function idLookUp(emailIn, users) {
  for (const id in users) {
    if (users[id].email === emailIn) {
      return id;
    }
  }
  return;
}

function urlsForUser(id, database) {
  let shortUrls = [];
  for (const urls in database) {
    if(database[urls].userID === id) {
      shortUrls.push(urls);
    }
  }
  return shortUrls;
}

function mapUrls(arrShortUrls, database) {
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
}