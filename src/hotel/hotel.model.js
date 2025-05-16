import { Schema, model } from 'mongoose';

const hotelSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true
    },
    phone:{
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

hotelSchema.methods.toJSON = function () {
    const { _id, ...hotel } = this.toObject();
    hotel.uid = _id;
    return hotel;
};

export default model('Hotel', hotelSchema);