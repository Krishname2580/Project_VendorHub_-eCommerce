require("dotenv").config();

console.log(process.env.OPENROUTER_API_KEY);

const client = require("./app/config/openai");

async function test() {
    try {

        const response = await client.chat.completions.create({
            model: "nvidia/nemotron-3-super-120b-a12b:free",
            messages: [
                {
                    role: "user",
                    content: "Say Hello"
                }
            ]
        });

        console.log(response.choices[0].message.content);

    } catch (err) {

        console.log(err);

    }
}

test();