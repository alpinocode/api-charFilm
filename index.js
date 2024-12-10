// import library yang di butuhkan
const express = require("express");
const bodyParser = require("body-parser");

// import route
const postsRouter = require("./routes/post");
// inisialisasi express
const app = express();

// inisialisasi body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// inisialisasi port
const port = 3000;

// membuat route home page
app.get("/", (req, res) => {
  res.send("Halo Cia cantik");
});

app.use("/api/posts", postsRouter);

//  Digunakan untuk membuat server mendengarkan permintaan HTTP pada port tertentu.
app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
