const express = require("express");

const router = express.Router();

const notificationController =
    require("../../controllers/admin/NotificationController");


// Notification List
router.get(
    "/notification/list",
    notificationController.list
);


// Edit Page
router.get(
    "/notification/edit/:id",
    notificationController.edit
);


// Update
router.post(
    "/notification/update/:id",
    notificationController.update
);


// Delete
router.get(
    "/notification/delete/:id",
    notificationController.delete
);


// Mark Single Read
router.get(
    "/notification/read/:id",
    notificationController.markAsRead
);


// Mark All Read
router.post(
    "/notification/mark-all-read",
    notificationController.markAllRead
);


module.exports = router;