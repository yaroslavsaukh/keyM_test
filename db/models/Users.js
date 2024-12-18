import mongoose from "mongoose";

const Users = new mongoose.Schema(
    {
        name:{type:String, required: true},
        username: { type: String, required: true },
        password: { type: String, required: true },
    }
)

export default mongoose.model('Users', Users)
