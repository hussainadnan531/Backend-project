//  require(`dotenv`).config({path:`./env`})
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

 connectDB()
 .then(() => {
    app.listen(port = (process.env.PORT || 8000), () => {
        console.log(`Server is running at port: ${port} `);
    })
 })
 .catch((error) => {
    console.log("MONGO DB connection Failed!! :", error);
 })









 /*
 ( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    } catch (error) {
        console.error("Error : ", error)
        throw error
    }
 })()
 */