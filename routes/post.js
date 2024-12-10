const express = require("express");
const connection = require("../config/database");
// Import body-parser validator
const { body, validationResult } = require("express-validator");
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

router.get("/:id", function (req, res) {
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

// Route POST - Menambahkan Data Post Baru
router.post(
  "/store",
  [
    // Validasi inputan
    body("nama_pemeran").notEmpty(),
    body("umur_pemeran").notEmpty(),
    body("umur_tokoh").notEmpty(),
    body("gender").notEmpty(),
    body("kepribadian").notEmpty(),
    body("peran_tokoh").notEmpty(),
    body("sifat_tokoh").notEmpty(),
    body("ciri_fisik").notEmpty(),
    body("latar_belakang").notEmpty(),
  ],
  function (req, res) {
    // Menangani validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "Validasi gagal",
        errors: errors.array(),
      });
    }

    const {
      nama_pemeran,
      umur_pemeran,
      latar_belakang,
      ciri_fisik,
      sifat_tokoh,
      peran_tokoh,
      kepribadian,
      gender,
      umur_tokoh,
    } = req.body;

    // Menyimpan data baru ke tabel posts
    connection.query(
      "INSERT INTO posts (nama_pemeran, umur_pemeran, umur_tokoh, gender, kepribadian, peran_tokoh, sifat_tokoh, ciri_fisik, latar_belakang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nama_pemeran,
        umur_pemeran,
        umur_tokoh,
        gender,
        kepribadian,
        peran_tokoh,
        sifat_tokoh,
        ciri_fisik,
        latar_belakang,
      ],
      function (error, results) {
        if (error) {
          return res.status(500).json({
            status: false,
            message: error.message,
          });
        } else {
          return res.status(201).json({
            status: true,
            message: "Post baru berhasil ditambahkan",
            data: {
              id: results.insertId,
              nama_pemeran,
              umur_pemeran,
              umur_tokoh,
              gender,
              kepribadian,
              peran_tokoh,
              sifat_tokoh,
              ciri_fisik,
              latar_belakang,
            },
          });
        }
      }
    );
  }
);

module.exports = router;
