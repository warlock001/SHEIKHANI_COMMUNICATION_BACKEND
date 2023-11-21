const PostAnnouncemnetController = require("../controllers/PostAnnouncemnetController");
const GetAnnouncementController = require("../controllers/GetAnnouncementController");

const announcementRouter = require("express").Router();

announcementRouter.get("/announcement", async (req, res) => {
    GetAnnouncementController.Execute(req, res);
});

announcementRouter.post("/announcement", async (req, res) => {
    PostAnnouncemnetController.Execute(req, res);
});


module.exports = announcementRouter;
