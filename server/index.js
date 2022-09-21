const express = require("express");
require("dotenv").config();
const app = express();
const fs = require("fs");

const PORT = process.env.PORT || 4000;

const http = require("http").Server(app);
const cors = require("cors");
const rawData = fs.readFileSync("data.json");
const productData = JSON.parse(rawData);

app.use(cors());

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});
function findProduct(nameKey, productsArray, last_bidder, new_price) {
  console.log("new price", new_price);
  for (let i = 0; i < productsArray.length; i++) {
    if (productsArray[i].name === nameKey) {
      productsArray[i].last_bidder = last_bidder;
      productsArray[i].price = new_price;
    }
  }
  const stringData = JSON.stringify(productData, null, 2);
  fs.writeFile("data.json", stringData, (err) => {
    console.error(err);
  });
}

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
  socket.on("addProduct", (data) => {
    productData["products"].push(data);
    const stringData = JSON.stringify(productData, null, 2);
    fs.writeFile("data.json", stringData, (err) => {
      console.error(err);
    });
    socket.broadcast.emit("addProductResponse", data);
  });
  socket.on("bidProduct", (data) => {
    findProduct(
      data.name,
      productData["products"],
      data.last_bidder,
      data.userInput
    );
    socket.broadcast.emit("bidProductResponse", data);
  });
});

app.get("/api", (req, res) => {
  res.json(productData);
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
