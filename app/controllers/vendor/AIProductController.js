const client = require("../../config/openai");

class AIProductController {

    async generateDescription(req, res) {

        try {

            const { name, category, brand } = req.body;

            const response = await client.chat.completions.create({

                model: "nvidia/nemotron-3-super-120b-a12b:free",

                messages: [

                    {
                        role: "system",
                        content: `
You are an expert eCommerce copywriter.

Return ONLY valid JSON.

Do not explain anything.

Do not use markdown.

Return exactly this JSON format:

{
    "title":"",
    "shortDescription":"",
    "description":"",
    "features":[],
    "seoTitle":"",
    "seoDescription":"",
    "seoKeywords":[],
    "tags":[]
}
`
                    },

                    {
                        role: "user",
                        content: `
Product Name: ${name}

Category: ${category}

Brand: ${brand}

Generate a professional eCommerce product.
`
                    }

                ],

                temperature: 0.7

            });

            // Get AI response
            const content = response.choices?.[0]?.message?.content;

            if (!content) {

                return res.json({

                    success: false,

                    message: "AI did not return any content."

                });

            }

            console.log("========== RAW AI RESPONSE ==========");
            console.log(content);

            // Remove markdown if present
            const cleanContent = content
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            let aiData;

            try {

                aiData = JSON.parse(cleanContent);

            } catch (err) {

                

                return res.json({

                    success: false,

                    message: "AI returned invalid JSON.",

                    raw: cleanContent

                });

            }

            return res.json({

                success: true,

                data: aiData

            });

        } catch (error) {

            console.log(error);

            return res.json({

                success: false,

                message: error.message

            });

        }

    }

}

module.exports = new AIProductController();