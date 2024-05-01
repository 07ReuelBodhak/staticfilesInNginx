const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/v1", (req, res) => {
  res.send({ msg: "ROY" });
  console.log("roy is greeting you 1");
});

app.get("/api/v1/image", (req, res) => {
  const imagePath = path.join(__dirname, "public", "image.jpg");
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      return res.status(500).send("internal server error");
    }
    res.setHeader("Content-Type", "image/jpeg");
    res.send(data);
  });
});

app.use((req, res) => {
  res.status(404).sendFile("./404.html", { root: __dirname });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server listening on port : ", PORT));
