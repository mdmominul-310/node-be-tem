import mongoose from 'mongoose';
import looger from "../helpers/logger"

class database {
    constructor() {

    }

    async mongoConnect(uri: string, dbName: string) {
        try {
            console.log(uri)
            await mongoose.connect(uri as string)
            looger.info("MongoDB connected uri: ".green + uri + " dbName: " + dbName.green)
        } catch (err) {

            if (err instanceof Error) {
                looger.error(err.message.red)
            }
        }
    }
}

export default database;
