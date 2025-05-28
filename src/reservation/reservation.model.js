import { Schema, model } from 'mongoose';

const reservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut:{
        type: Date,
        required: true
    },
    date:{
        type: Date,
        default: new Date()
    },
    room:{
        type: Schema.Types.ObjectId,
        ref: 'Room' ,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING","COMPLETED","CANCELLED"],
        default: "PENDING"
    },
});

reservationSchema.methods.toJSON = function () {
    const { _id, ...reservation } = this.toObject();
    reservation.uid = _id;
    return reservation;
};

export default model('Reservation', reservationSchema);