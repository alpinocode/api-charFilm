let mySql = require("mysql"); // import library mysql

// membuat koneksi database mysql
let connection = mySql.createConnection({
  host: "localhost", // server mysql
  port: 3306, // port server mysql
  user: "root", // username mysql default nya root
  password: "", // password mysql default nya kosong
  database: "api-charFilm", // nama database yang di gunakan
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
