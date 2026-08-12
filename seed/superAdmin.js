const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../app/models/User");
const Role = require("../app/models/Role");

mongoose.connect(process.env.MONGO_URL);

async function createSuperAdmin() {

    try {

        let role = await Role.findOne({

            roleName: "Super Admin"

        });

        if (!role) {

            role = await Role.create({

                roleName: "Super Admin",

                description: "System Administrator"

            });

        }

        const adminExist = await User.findOne({

            email: "krishna@yopmail.com"

        });

        if (adminExist) {

            console.log("Super Admin already exists.");

            process.exit();

        }

        const password = await bcrypt.hash("123456", 10);

        await User.create({

            role: role._id,

            name: "Super Admin",

            email: "krishna@yopmail.com",

            phone: "7063562654",

            password,

            isVerified: true,

            status: true,

            isBlocked: false

        });

        console.log("Super Admin Created Successfully");

        process.exit();

    } catch (error) {

        console.log(error);

        process.exit();

    }

}

createSuperAdmin();