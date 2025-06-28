import mongoose from "mongoose";

type ConnectionObject = {
  isConnected? : number;
}

const connection: ConnectionObject = {}


async function DbConnect() {
  if(connection.isConnected){
    console.log("DB is already connected")
    return
  }
  try {
    const DB = await mongoose.connect(`${process.env.MONGO_URI}/true-feedback` || "");
    connection.isConnected = DB.connections[0].readyState;

    console.log("DB connected successfully")
  } catch (error) {
    if (error instanceof Error) {
      console.log("DB Connection error : ", error.message);
    } else {
      console.log("DB Connection error : ", error);
    }
    process.exit(1);
  }
}

export default DbConnect;