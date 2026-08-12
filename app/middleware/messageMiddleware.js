const Message = require("../models/Message");


module.exports = async function (req, res, next) {

    try {


        if (req.user) {


            const messageCount = await Message.countDocuments({

                receiver: req.user._id,

                isRead: false

            });


            res.locals.messageCount = messageCount;


        }
        else {


            res.locals.messageCount = 0;


        }


        next();


    } catch (error) {

        console.log(error);

        next();

    }

};