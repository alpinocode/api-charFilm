let mySql = require("mysql"); // import library mysql

// membuat koneksi database mysql
let connection = mySql.createConnection({
  host: "localhost",
  port: 3006,
  user: "root",
  password: "",
  database: "api-charFilm",
});

connection.connect(function (error) {
  // melakukan pengecekanan koneksi database
  if (error) {
    // jika koneksi gagal
    console.log(error);
  } else {
    // jika koneksi berhasil
    console.log("koneksi database berhasil");
  }
});

// export connection ke file index.js
module.exports = connection;
