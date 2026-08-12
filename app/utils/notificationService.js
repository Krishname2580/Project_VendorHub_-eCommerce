const Notification = require("../models/Notification");

class NotificationService {

    async createNotification(

        receiver,

        title,

        message,

        type = "System"

    ) {

        return await Notification.create({

            receiver,

            title,

            message,

            type

        });

    }

}

module.exports = new NotificationService();