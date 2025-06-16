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
    const DB = await mongoose.connect(process.env.MONGO_URI || "");
    connection.isConnected = DB.connections[0].readyState;

    console.log("DB connected successfully")
  } catch (error) {
    console.log("DB Connection error : ", error.message)
    process.exit(1);
  }
}
