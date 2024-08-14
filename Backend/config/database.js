import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path: "../config/.env"
})

const databaseConnection = () => {
    mongoose.connect(process.env.MONGO_DATABASE_URL).then(() => {
        console.log("Connections Establishment to MongoDB Successfully ...   :)");
    }).catch((error) => {
        console.log("Database Connection Issue Please Try Again!");
    })
}

export default databaseConnection;