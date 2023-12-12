const express = require("express");
const app = express();
const dotenv = require("dotenv");
const http = require("http").Server(app);
const cors = require("cors");
const PORT = 4000;

//models//
const RecentChats = require("./models/recentChats");
const Message = require("./models/message");
const Group = require("./models/group");
const Workspace = require("./models/workspace");

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
const workspace = require("./routes/workspace");
const file = require("./routes/file");
const groupMember = require("./routes/groupMember");
const password = require("./routes/password");
const upload = require("./middleware/upload");
const shiftGroupRouter = require("./routes/ShiftGroupToWorkspace");
const userDump = require("./routes/userdump")
const SetPassword = require("./routes/SetPassword")
const Department = require("./routes/department")
const Announcemnet = require("./routes/announcement")
const ShiftWorkspaceRouter = require("./routes/ShiftWorkspaceToGroup")
const filteredUsersRouter = require("./routes/filteredUsers")

app.use(cors());
app.use(express.json());
app.use(signupRouter);
app.use(loginRouter);
app.use(userRouter);
app.use(saveMessage);
app.use(getMessage);
app.use(userMessages);
app.use(recentChats)
app.use(file(upload));
app.use(group);
app.use(workspace)
app.use(groupMember);
app.use(password);
app.use(profilePicture(upload));
app.use(shiftGroupRouter);
app.use(ShiftWorkspaceRouter)
app.use(userDump)
app.use(SetPassword)
app.use(Department)
app.use(Announcemnet)
app.use(filteredUsersRouter)


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
		if (!socket.rooms.has(data.roomid)) {
			socket.join(data.roomid);
		}

	});

	socket.on("leave_room", (data) => {
		console.log("User with id", socket.id, "left room -", data.roomid);
		socket.leave(data.roomid);
	});

	//////////////////////////Direct Messaging///////////////

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
						title: data.message.title,
						newMessages: 0,
						time: new Date()
					}]
				})

				recentChats.save()

			} else {
				let targetChat = results[0].chats.filter((item) => {
					return item.user == data.message.recieverid
				})
				if (targetChat.length !== 0) {
					targetChat[0].lastMessage = data.message.message
					targetChat[0].newMessages = 0
					targetChat[0].time = new Date()

					results[0].chats = results[0].chats.map(item => {
						return item.user !== data.message.recieverid ? item : targetChat[0]
					})

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
						title: data.message.title,
						newMessages: 0,
						time: new Date()
					})


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
						title: data.message.user,
						newMessages: 1,
						time: new Date()
					}]
				})

				recentChats.save()

			} else {
				let targetChat = results[0].chats.filter((item) => {
					return item.user == data.message.senderid
				})
				if (targetChat.length !== 0) {
					targetChat[0].lastMessage = data.message.message
					targetChat[0].newMessages = targetChat[0].newMessages + 1
					targetChat[0].time = new Date()

					results[0].chats = results[0].chats.map(item => {
						return item.user !== data.message.senderid ? item : targetChat[0]
					})

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
						title: data.message.user,
						newMessages: 1,
						time: new Date()
					})


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

		var lastSenderCheck = await Message.find({ roomid: data.roomid })

		if (lastSenderCheck[lastSenderCheck.length - 1]?.senderid == data.recipient) {





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

			socket.broadcast.to(data.roomid).emit("update_read_receipt", data);


		}

	});

	/////////////////////Group Chats////////////////////////////

	socket.on("send_message_group", async (data) => {
		console.log("Group Message Recieved - ", data);
		socketIO.to(data.roomId).emit("receive_message", data);


		////updating sender chats///
		await RecentChats.find({ user: data.message.senderid }).then(async results => {
			if (results.length == 0) {

				const recentChats = new RecentChats({
					user: data.message.senderid,
					groups: [{
						user: data.roomId,
						lastMessage: data.message.message,
						title: data.message.title,
						newMessages: 0,
						time: new Date()
					}]
				})

				await recentChats.save().catch(err => {
					console.log(err)
				})

			} else {
				let targetChat = results[0].groups.filter((item) => {
					return item.user == data.roomId
				})
				if (targetChat.length !== 0) {
					targetChat[0].lastMessage = data.message.message
					targetChat[0].newMessages = 0
					targetChat[0].time = new Date()

					results[0].groups = results[0].groups.map(item => {
						return item.user !== data.roomId ? item : targetChat[0]
					})

					await RecentChats.findOneAndUpdate(
						{ 'user': data.message.senderid },
						{
							$set:
							{
								groups: results[0].groups
							}
						}).catch(err => {
							console.log(err)
						})

				} else {

					results[0].groups.push({
						user: data.roomId,
						lastMessage: data.message.message,
						title: data.message.title,
						newMessages: 0,
						time: new Date()
					})


					await RecentChats.findOneAndUpdate(
						{ 'user': data.message.senderid },
						{
							$set:
							{
								groups: results[0].groups
							}
						}).then(res => {
						}).catch(err => {
							console.log(err)
						})
				}
			}
		})

		////updating reciever chats///

		const group = await Group.findOne({
			roomid: data.roomId
		}).then(res => {

			res.members.forEach(async userId => {
				if (userId != data.message.senderid) {

					await RecentChats.find({ user: userId }).then(async results => {
						if (results.length == 0) {

							const recentChats = new RecentChats({
								user: userId,
								groups: [{
									user: data.roomId,
									lastMessage: data.message.message,
									title: data.message.title,
									newMessages: 1,
									time: new Date()
								}]
							})

							recentChats.save().catch(err => {
								console.log(err)
							})

						} else {
							let targetChat = results[0].groups.filter((item) => {
								return item.user == data.roomId
							})
							if (targetChat.length !== 0) {
								targetChat[0].lastMessage = data.message.message
								targetChat[0].newMessages = targetChat[0].newMessages + 1
								targetChat[0].time = new Date()

								results[0].groups = results[0].groups.map(item => {
									return item.user !== data.message.senderid ? item : targetChat[0]
								})

								await RecentChats.findOneAndUpdate(
									{ 'user': userId },
									{
										$set:
										{
											groups: results[0].groups
										}
									}).catch(err => {
										console.log(err)
									})

							} else {

								results[0].groups.push({
									user: data.roomId,
									lastMessage: data.message.message,
									title: data.message.title,
									newMessages: 1,
									time: new Date()
								})


								await RecentChats.findOneAndUpdate(
									{ 'user': userId },
									{
										$set:
										{
											groups: results[0].groups
										}
									}).catch(err => {
										console.log(err)
									})
							}
						}
					})

				}
			})
		})





	});

	socket.on("read_receipt_group", async (data) => {


		await RecentChats.find(
			{ user: data.id }
		).then(async res => {
			if (res.length !== 0) {
				let targetChat = res[0].groups.filter((item) => {
					return item.user == data.recipient
				})

				if (targetChat.length !== 0) {
					targetChat[0].newMessages = 0


					res[0].groups = res[0].groups.map(item => {
						return item.user !== data.recipient ? item : targetChat[0]
					})

					await RecentChats.findOneAndUpdate(
						{ 'user': data.id },
						{
							$set:
							{
								groups: res[0].groups
							}
						})

				}
			}
		})



	});

	/////////////////////Workspace Chats//////////////////////


	socket.on("send_message_workspace", async (data) => {
		console.log("workspace Message Recieved - ", data);
		socketIO.to(data.roomId).emit("receive_message", data);


		////updating sender chats///
		await RecentChats.find({ user: data.message.senderid }).then(async results => {
			if (results.length == 0) {

				const recentChats = new RecentChats({
					user: data.message.senderid,
					workspaces: [{
						user: data.roomId,
						lastMessage: data.message.message,
						title: data.message.title,
						newMessages: 0,
						time: new Date()
					}]
				})

				await recentChats.save().catch(err => {
					console.log(err)
				})

			} else {
				let targetChat = results[0].workspaces.filter((item) => {
					return item.user == data.roomId
				})
				if (targetChat.length !== 0) {
					targetChat[0].lastMessage = data.message.message
					targetChat[0].newMessages = 0
					targetChat[0].time = new Date()

					results[0].workspaces = results[0].workspaces.map(item => {
						return item.user !== data.roomId ? item : targetChat[0]
					})

					await RecentChats.findOneAndUpdate(
						{ 'user': data.message.senderid },
						{
							$set:
							{
								workspaces: results[0].workspaces
							}
						}).catch(err => {
							console.log(err)
						})

				} else {

					results[0].workspaces.push({
						user: data.roomId,
						lastMessage: data.message.message,
						title: data.message.title,
						newMessages: 0,
						time: new Date()
					})


					await RecentChats.findOneAndUpdate(
						{ 'user': data.message.senderid },
						{
							$set:
							{
								workspaces: results[0].workspaces
							}
						}).then(res => {
						}).catch(err => {
							console.log(err)
						})
				}
			}
		})

		////updating reciever chats///

		const workspace = await Workspace.findOne({
			roomid: data.roomId
		}).then(res => {

			res.members.forEach(async userId => {
				if (userId != data.message.senderid) {

					await RecentChats.find({ user: userId }).then(async results => {
						if (results.length == 0) {

							const recentChats = new RecentChats({
								user: userId,
								workspaces: [{
									user: data.roomId,
									lastMessage: data.message.message,
									title: data.message.title,
									newMessages: 1,
									time: new Date()
								}]
							})

							recentChats.save().catch(err => {
								console.log(err)
							})

						} else {
							let targetChat = results[0].workspaces.filter((item) => {
								return item.user == data.roomId
							})
							if (targetChat.length !== 0) {
								targetChat[0].lastMessage = data.message.message
								targetChat[0].newMessages = targetChat[0].newMessages + 1
								targetChat[0].time = new Date()

								results[0].workspaces = results[0].workspaces.map(item => {
									return item.user !== data.message.senderid ? item : targetChat[0]
								})

								await RecentChats.findOneAndUpdate(
									{ 'user': userId },
									{
										$set:
										{
											workspaces: results[0].workspaces
										}
									}).catch(err => {
										console.log(err)
									})

							} else {

								results[0].workspaces.push({
									user: data.roomId,
									lastMessage: data.message.message,
									title: data.message.title,
									newMessages: 1,
									time: new Date()
								})


								await RecentChats.findOneAndUpdate(
									{ 'user': userId },
									{
										$set:
										{
											workspaces: results[0].workspaces
										}
									}).catch(err => {
										console.log(err)
									})
							}
						}
					})

				}
			})
		})





	});

	socket.on("read_receipt_workspace", async (data) => {


		await RecentChats.find(
			{ user: data.id }
		).then(async res => {
			if (res.length !== 0) {
				let targetChat = res[0].workspaces.filter((item) => {
					return item.user == data.recipient
				})

				if (targetChat.length !== 0) {
					targetChat[0].newMessages = 0


					res[0].workspaces = res[0].workspaces.map(item => {
						return item.user !== data.recipient ? item : targetChat[0]
					})

					await RecentChats.findOneAndUpdate(
						{ 'user': data.id },
						{
							$set:
							{
								workspaces: res[0].workspaces
							}
						})

				}
			}
		})



	});

	//////////////////old code /////////////////
	socket.on("createRoom", (room) => {
		socket.join(room);
		chatRooms.unshift({ id: generateID(), room, messages: [] });
		socket.emit("roomsList", chatRooms);
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
	res.json(chatRooms);
});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
