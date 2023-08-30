const express = require("express");
const app = express();
const dotenv = require("dotenv");
const http = require("http").Server(app);
const cors = require("cors");
const PORT = 4000;

dotenv.config();

const mongoose = require("mongoose");

const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const userRouter = require("./routes/user");


app.use(cors());
app.use(express.json());
app.use(signupRouter);
app.use(loginRouter);
app.use(userRouter);


const socketIO = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:3000,*",
	},
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


var server = app.listen(process.env.API_PORT, (error) => {
	if (error) {
		console.error("Error Occurred while connecting to server: ", error);
	} else {
		console.log("App is listining on port " + process.env.API_PORT);

		console.log("Trying to connect to database server...");

		mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
			console.log("Connected to Database Successfully!");
		}).catch((err) => {
			console.error("Error Occurred while connecting to database: ", err);
		})
	}
});




const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = [];

socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("createRoom", (room) => {
		socket.join(room);
		chatRooms.unshift({ id: generateID(), room, messages: [] });
		socket.emit("roomsList", chatRooms);
	});

	socket.on("findRoom", (data) => {

		let result = chatRooms.filter((room) => room.id == data.id);
		// console.log(chatRooms);
		if (result.length == 0) {
			socket.join(data.roomName);
			chatRooms.unshift({ id: data.id, room: data.roomName, name: data.name, sender: data.sender, messages: data.roomMessages ? data.roomMessages : [] });
			result = chatRooms.filter((room) => room.id == data.id);
		}
		socket.emit("foundRoom", result[0]?.messages ? result[0].messages : []);
		// console.log("Messages Form", result[0].messages);
	});

	socket.on("newMessage", (data) => {
		// console.log(data)
		const { room_id, message, user, timestamp } = data;
		let result = chatRooms.filter((room) => room.id == room_id);
		const newMessage = {
			id: generateID(),
			text: message,
			user,
			time: `${timestamp.hour}:${timestamp.mins}`,
		};
		// console.log("New Message", newMessage);
		socket.to(result[0].roomName).emit("roomMessage", newMessage);
		result[0].messages.push(newMessage);

		socket.emit("roomsList", chatRooms);
		socket.emit("foundRoom", result[0].messages);
	});
	socket.on("disconnect", () => {
		socket.disconnect();
		console.log("🔥: A user disconnected");
	});
});

app.get("/api", (req, res) => {
	console.log(chatRooms)
	res.json(chatRooms);

});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
