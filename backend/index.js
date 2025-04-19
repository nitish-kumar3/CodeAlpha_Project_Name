
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
const usersRoute = require("./routes/users");
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

mongoose.connect("mongodb://localhost:27017/social_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes(io));

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
