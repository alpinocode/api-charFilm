const express = require("express");
const connection = require("../config/database");

// Inisialisasi router
const router = express.Router();

// Route GET - Menampilkan Semua Data Posts
router.get("/", function (req, res) {
  // Query untuk mengambil semua posts dari database
  connection.query(
    "SELECT * FROM posts ORDER BY id desc",
    function (error, result) {
      if (error) {
        return res.status(500).json({
          status: false,
          message: error.message, // Pastikan 'error' bukan 'err'
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Menampilkan data posts",
          data: result, //  mengembalikan data posts
        });
      }
    }
  );
});

router.get("/data/:id", function (req, res) {
  const { id } = req.params; // mengambil id dari permintaan user yang dari params id
  // jika tidak ada id nya maka kembalikan error
  if (!id) {
    return res.status(403).json({
      message: "Id Tidak Ada",
    });
  }
  // jika id ada maka jalankan query
  connection.query(
    "SELECT * FROM posts WHERE id = ?",
    [id],
    function (error, results) {
      if (error) {
        return res.status(500).json({
          status: false,
          message: error.message,
        });
      } else {
        if (results.length === 0) {
          return res.status(404).json({
            status: false,
            message: "Post tidak ditemukan",
          });
        } else {
          return res.status(200).json({
            data: results[0], // Menampilkan hasil pertama
          });
        }
      }
    }
  );
});

module.exports = router;
