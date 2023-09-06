const express = require("express");
const app = express();
const dotenv = require("dotenv");
const http = require("http").Server(app);
const cors = require("cors");
const PORT = 4000;

//models//
const RecentChats = require("./models/recentChats");
const Message = require("./models/message");

dotenv.config();

const mongoose = require("mongoose");

const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const userRouter = require("./routes/user");
const saveMessage = require("./routes/saveMessage");
const getMessage = require("./routes/getMessage");
const userMessages = require("./routes/userMessages");
const profilePicture = require("./routes/profilePicture");
const recentChats = require("./routes/recentChats");
const group = require("./routes/group");
const file = require("./routes/file");
const upload = require("./middleware/upload");


app.use(cors());
app.use(express.json());
app.use(signupRouter);
app.use(loginRouter);
app.use(userRouter);
app.use(saveMessage);
app.use(getMessage);
app.use(userMessages);
app.use(recentChats)
app.use(file);
app.use(group);
app.use(profilePicture(upload));

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

		mongoose
			.connect(process.env.DB_CONNECTION_STRING)
			.then(() => {
				console.log("Connected to Database Successfully!");
			})
			.catch((err) => {
				console.error("Error Occurred while connecting to database: ", err);
			});
	}
});

const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = [];

socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("join_room", (data) => {
		console.log("User with id", socket.id, "Join room -", data.roomid);
		socket.join(data.roomid);
	});

	socket.on("leave_room", (data) => {
		console.log("User with id", socket.id, "left room -", data.roomid);
		socket.leave(data.roomid);
	});

	socket.on("send_message", (data) => {
		console.log("Message Recieved - ", data);
		socketIO.to(data.roomId).emit("receive_message", data);

		// chats={
		// 	user,
		// 	lastMessage,
		// 	newMessages,
		// }

		////updating sender chats///
		RecentChats.find({ user: data.message.senderid }).then(async results => {
			if (results.length == 0) {

				const recentChats = new RecentChats({
					user: data.message.senderid,
					chats: [{
						user: data.message.recieverid,
						lastMessage: data.message.message,
						newMessages: 0,
						time: new Date()
					}]
				})

				recentChats.save()

			} else {
				let targetChat = results[0].chats.filter((item) => {
					return item.user == data.message.recieverid
				})
				console.log("All Chats,", JSON.stringify(results))
				console.log("chats found,", targetChat)
				if (targetChat.length !== 0) {
					targetChat[0].lastMessage = data.message.message
					targetChat[0].newMessages = 0
					targetChat[0].time = new Date()

					results[0].chats = results[0].chats.map(item => {
						console.log(item.user)
						console.log(data.message.recieverid)
						return item.user !== data.message.recieverid ? item : targetChat[0]
					})
					console.log(JSON.stringify(results))

					await RecentChats.findOneAndUpdate(
						{ 'user': data.message.senderid },
						{
							$set:
							{
								chats: results[0].chats
							}
						})

				} else {

					results[0].chats.push({
						user: data.message.recieverid,
						lastMessage: data.message.message,
						newMessages: 0,
						time: new Date()
					})

					console.log(JSON.stringify(results))

					await RecentChats.findOneAndUpdate(
						{ 'user': data.message.senderid },
						{
							$set:
							{
								chats: results[0].chats
							}
						})
				}
			}
		})

		////updating reciever chats///

		RecentChats.find({ user: data.message.recieverid }).then(async results => {
			if (results.length == 0) {

				const recentChats = new RecentChats({
					user: data.message.recieverid,
					chats: [{
						user: data.message.senderid,
						lastMessage: data.message.message,
						newMessages: 1,
						time: new Date()
					}]
				})

				recentChats.save()

			} else {
				let targetChat = results[0].chats.filter((item) => {
					return item.user == data.message.senderid
				})
				console.log("All Chats,", JSON.stringify(results))
				console.log("chats found,", targetChat)
				if (targetChat.length !== 0) {
					targetChat[0].lastMessage = data.message.message
					targetChat[0].newMessages = targetChat[0].newMessages + 1
					targetChat[0].time = new Date()

					results[0].chats = results[0].chats.map(item => {
						console.log(item.user)
						console.log(data.message.senderid)
						return item.user !== data.message.senderid ? item : targetChat[0]
					})
					console.log(JSON.stringify(results))

					await RecentChats.findOneAndUpdate(
						{ 'user': data.message.recieverid },
						{
							$set:
							{
								chats: results[0].chats
							}
						})

				} else {

					results[0].chats.push({
						user: data.message.senderid,
						lastMessage: data.message.message,
						newMessages: 1,
						time: new Date()
					})

					console.log(JSON.stringify(results))

					await RecentChats.findOneAndUpdate(
						{ 'user': data.message.recieverid },
						{
							$set:
							{
								chats: results[0].chats
							}
						})
				}
			}
		})

	});


	socket.on("read_receipt", async (data) => {
		await Message.updateMany(
			{ roomid: data.roomid },
			{
				$set:
				{
					seen: true
				}
			}
		)

		await RecentChats.find(
			{ user: data.id }
		).then(async res => {
			if (res.length !== 0) {
				let targetChat = res[0].chats.filter((item) => {
					return item.user == data.recipient
				})

				if (targetChat.length !== 0) {
					targetChat[0].newMessages = 0


					res[0].chats = res[0].chats.map(item => {
						return item.user !== data.recipient ? item : targetChat[0]
					})

					await RecentChats.findOneAndUpdate(
						{ 'user': data.id },
						{
							$set:
							{
								chats: res[0].chats
							}
						})

				}
			}
		})

		socketIO.to(data.roomid).emit("update_read_receipt", data);


	});

	//////////////////old code /////////////////
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
			chatRooms.unshift({
				id: data.id,
				room: data.roomName,
				name: data.name,
				sender: data.sender,
				messages: data.roomMessages ? data.roomMessages : [],
			});
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
	console.log(chatRooms);
	res.json(chatRooms);
});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
