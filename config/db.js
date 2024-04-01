import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const dataBaseConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log(`DB connected @ host:${connect.connection.host}`)
    } catch (error) {
        console.error(error)
    }
}  