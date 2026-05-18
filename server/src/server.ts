import { configDotenv } from "dotenv"
import app from "./app.js"
import connectDB from "./config/db.js";

configDotenv();

const PORT = process.env.PORT || 3000

await connectDB();

app.listen(PORT, () => {
    console.log("Server is running at", +PORT)
})

// Hey bajarang bali meri kismat palat dena iske baad itne paise kamau kisi ne na kamaye ho khandan me har tarike se pari pooran hu apne ghar walo ke har sapne ko pura karu or har khawish ko pura karu or sab karu unke liye itni umeede jo merer ghar walo ne laga rakhi he mere se wo sab puri ho or me fir kabhi jeevan me wpas yeh time palat kar na dekkhi aesi karpa karo mere bajrangi 