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
          data: result, // mengembalikan data posts
        });
      }
    }
  );
});

module.exports = router;
