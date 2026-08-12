const Notification = require("../models/Notification");


module.exports = async function (req, res, next) {

    try {


        if (req.user) {

            const notificationCount = await Notification.countDocuments({

                user: req.user._id,

                isRead: false

            });


            res.locals.notificationCount = notificationCount;

        }
        else {

            res.locals.notificationCount = 0;

        }


        next();


    } catch (error) {

        console.log(error);

        next();

    }

};