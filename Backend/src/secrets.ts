import dotenv from "dotenv";
dotenv.config({path:"../.env"})

const PORT = process.env.PORT! || 7777;
const JWT_SECRET = process.env.JWT_SECRET!
const NODE_ENV=process.env.NODE_ENV!

export {PORT,JWT_SECRET,NODE_ENV}