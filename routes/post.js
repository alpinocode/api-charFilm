const express = require("express");
const fs = require("fs"); // Import file system gunanya untuk membuat folder
const path = require("path"); // Import path gunanya untuk menentukan lokasi file atau direktori dalam sistem file
const multer = require("multer"); // Import multer
const koneksi = require("../config/database");
// Import body-parser validator
const { body, validationResult } = require("express-validator");
// Inisialisasi router
const router = express.Router();
const { randomUUID } = require("crypto");

// Route GET - Menampilkan Semua Data Posts
router.get("/", function (req, res) {
  // Query untuk mengambil semua posts dari database
  koneksi.query(
    "SELECT * FROM posts ORDER BY id desc",
    function (error, result) {
      if (error) {
        return res.status(500).json({
          status: false,
          message: error.message, // Menampilkan pesan error
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

  // jika id ada maka jalankan query
  koneksi.query(
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
            message: "ID tidak dapat ditemukan",
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

// Folder untuk menyimpan file
const uploadDirectory = "assets";

// Membuat folder upload jika belum ada
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Menyimpan file menggunakan disk storage
const storage = multer.diskStorage({
  // destination: lokasi untuk menyimpan file dari request user
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Menyimpan file ke folder upload
  },
  // filename: nama file dari request user
  filename: function (req, file, cb) {
    cb(null, randomUUID() + path.extname(file.originalname)); // Nama file unik berdasarkan randomuuid dari crypto nodejs
  },
});

// Konfigurasi upload
const upload = multer({ storage: storage });

// Route POST - Menambahkan Data Post Baru
router.post(
  "/store",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "imagePemeran", maxCount: 1 },
  ]),
  (req, res) => {
    // Ambil data dari body
    const {
      nama_pemeran,
      nama_tokoh,
      umur_pemeran,
      umur_tokoh,
      gender,
      kepribadian,
      peran_tokoh,
      sifat_tokoh,
      ciri_fisik,
      latar_belakang,
    } = req.body;

    // Cek apakah ada file yang diupload
    const image = req.files["image"] ? req.files["image"][0].path : null;
    const imagePemeran = req.files["imagePemeran"]
      ? req.files["imagePemeran"][0].path
      : null;

    // Query untuk memasukkan data ke dalam database
    koneksi.query(
      "INSERT INTO posts (nama_pemeran, nama_tokoh, umur_pemeran, umur_tokoh, gender, kepribadian, peran_tokoh, sifat_tokoh, ciri_fisik, latar_belakang, image, imagePemeran) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nama_pemeran,
        nama_tokoh,
        umur_pemeran,
        umur_tokoh,
        gender,
        kepribadian,
        peran_tokoh,
        sifat_tokoh,
        ciri_fisik,
        latar_belakang,
        image,
        imagePemeran,
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
              nama_tokoh,
              umur_pemeran,
              umur_tokoh,
              gender,
              kepribadian,
              peran_tokoh,
              sifat_tokoh,
              ciri_fisik,
              latar_belakang,
              image, // Sertakan path gambar tokoh
              imagePemeran, // Sertakan path gambar pemeran
            },
          });
        }
      }
    );
  }
);

// Route PATCH - Mengupdate Data Post Berdasarkan ID
router.patch(
  "/update/:id",
  [
    // Validasi inputan
    body("nama_pemeran").notEmpty(),
    body("nama_tokoh").notEmpty(),
    body("umur_pemeran").notEmpty(),
    body("umur_tokoh").notEmpty(),
    body("gender").notEmpty(),
    body("kepribadian").notEmpty(),
    body("peran_tokoh").notEmpty(),
    body("sifat_tokoh").notEmpty(),
    body("ciri_fisik").notEmpty(),
    body("latar_belakang").notEmpty(),
  ],
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "imagePemeran", maxCount: 1 },
  ]),
  function (req, res) {
    const postId = req.params.id;
    const {
      nama_pemeran,
      nama_tokoh,
      umur_pemeran,
      umur_tokoh,
      gender,
      kepribadian,
      peran_tokoh,
      sifat_tokoh,
      ciri_fisik,
      latar_belakang,
    } = req.body;
    const image = req.files["image"] ? req.files["image"][0].path : null;
    const imagePemeran = req.files["imagePemeran"]
      ? req.files["imagePemeran"][0].path
      : null;

    // Buat query SQL dinamis berdasarkan apakah ada file gambar
    let query =
      "UPDATE posts SET nama_pemeran = ?, nama_tokoh = ?, umur_pemeran = ?, umur_tokoh = ?, gender = ?, kepribadian = ?, peran_tokoh = ?, sifat_tokoh = ?, ciri_fisik = ?, latar_belakang = ?";
    const params = [
      nama_pemeran,
      nama_tokoh,
      umur_pemeran,
      umur_tokoh,
      gender,
      kepribadian,
      peran_tokoh,
      sifat_tokoh,
      ciri_fisik,
      latar_belakang,
    ];

    // pengecekan apakah ada file gambar
    if (image || imagePemeran) {
      query += ", image = ?" + ", imagePemeran = ?";

      params.push(image, imagePemeran);
    }

    query += " WHERE id = ?";
    params.push(postId);

    // Eksekusi query
    koneksi.query(query, params, function (error, results) {
      if (error) {
        return res.status(500).json({
          status: false,
          message: error.message,
        });
      } else if (results.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: "Data tidak ditemukan",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data berhasil diupdate",
          data: {
            id: postId,
            nama_pemeran,
            nama_tokoh,
            umur_pemeran,
            umur_tokoh,
            gender,
            kepribadian,
            peran_tokoh,
            sifat_tokoh,
            ciri_fisik,
            latar_belakang,
            image: image,
            imagePemeran: imagePemeran,
          },
        });
      }
    });
  }
);

// Route DELETE - Menghapus Data Post Berdasarkan ID
router.delete("/:id", function (req, res) {
  const postId = req.params.id;

  // Menghapus post berdasarkan id
  koneksi.query(
    "DELETE FROM posts WHERE id = ?",
    [postId],
    function (error, results) {
      if (error) {
        return res.status(500).json({
          status: false,
          message: error.message,
        });
      } else if (results.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: "Data tidak ditemukan",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data berhasil dihapus",
        });
      }
    }
  );
});
module.exports = router;
