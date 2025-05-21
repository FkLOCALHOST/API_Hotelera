import {Schema, model} from "mongoose";

const userSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is requiered"],
        maxLength: [25, "Name cannot exceed 25 characteres"]
    },
    surname:{
        type: String,
        required: [true, "Surname is requiered"],
        maxLength: [25, "Surname cannot exceed 25 characteres"]
    },
    userName: {
        type: String,
        required: [true, "username is required"],
        unique: true
    },
    profilePicture:{
        type: String
    },
    email: {
        type: String,
        required: [true, "Email is requiered"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is requiered"],
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true,
    },
    role: {
        type: String,
        enum: ["ADMIN_ROLE", "USER_ROLE"],
        default: "USER_ROLE",
    },
    rooms:[{
        type: Schema.Types.ObjectId,
        ref: "Room",
        default: []
    }],
    events:[{
        type: Schema.Types.ObjectId,
        ref: "Event",
        default: []
    }],
    reservations: [{
        type: Schema.Types.ObjectId,
        ref: "Reservation",
        default: [] 
    }],
    historyOfReservations:[{
        type: Schema.Types.ObjectId,
        ref: "Reservation",
        default: []
    }],
    favHotel:[{
        type: String,
        default:[]
    }],
    status: {
        type: Boolean,
        default: true,
    },
},
{
    versionKey: false,
    timeStamps: true
});

userSchema.methods.toJSON = function(){
    const {_v, password, _id, ...usuario} = this.toObject()
    usuario.uid = _id;
    return usuario;
};

export default model("User", userSchema);