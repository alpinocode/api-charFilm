let mySql = require("mysql"); // import library mysql

// membuat koneksi database mysql
let koneksi = mySql.createConnection({
  host: process.env.DB_HOST, // server mysql
  port: process.env.DB_PORT, // port server mysql
  user: process.env.DB_USER, // username mysql default nya root
  password: "", // password mysql default nya kosong
  database: process.env.DB_DATABASE, // nama database yang di gunakan
});

koneksi.connect(function (error) {
  // melakukan pengecekanan koneksi database
  if (error) {
    // jika koneksi gagal
    console.log(error);
  } else {
    // jika koneksi berhasil
    console.log("koneksi database berhasil");
  }
});

// export koneksi ke file index.js
module.exports = koneksi;
