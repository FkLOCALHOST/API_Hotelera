import { Schema, model } from 'mongoose';

const reservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    Date:{
        type: Date,
        required: true
    },
    room:{
        type: String,
        required: true
    },
    addres:{
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['1 STARS', '2 STARS', '3 STARS', '4 STARS', '5 STARS'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    department:{
        type: String,
        required: true
    },
    rooms: [{
        type: Schema.Types.ObjectId,
        ref: 'Room',
        default: [],
    }],
    status: {
        type: Boolean,
        default: true
    },
    registerDate: {
        type: Date,
        default: new Date(),
    }
});

reservationSchema.methods.toJSON = function () {
    const { _id, ...reservation } = this.toObject();
    reservation.uid = _id;
    return reservation;
};

export default model('Reservation', reservationSchema);