const Notification = require("../models/Notification");

async function createNotification({
    user,
    vendor = null,
    title,
    message,
    type = "order"
}) {

    try {

        const notification =
            await Notification.create({

                user,

                vendor,

                title,

                message,

                type,

                isRead: false,

                status: true

            });


        console.log(
            "NOTIFICATION CREATED:",
            notification._id
        );


        return notification;

    } catch (error) {

        console.log(
            "CREATE NOTIFICATION ERROR:",
            error
        );

        return null;
    }
}

module.exports = createNotification;