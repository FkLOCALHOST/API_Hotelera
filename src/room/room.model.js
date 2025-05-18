import { Schema, model } from 'mongoose';

const roomSchema = new Schema({
    number: {
        type: String,
        required: true,
        unique: true,
    },
    price:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    reservations:[{
        type: Schema.Types.ObjectId,
        ref: "Reservation",
        default: []
    }],
    amenity: [{
        type: Schema.Types.ObjectId,
        ref: "Amenity",
        default: []
    }],
    capacity:{
        type: String
    },
    hotel:{
        type: Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    },
    preView:{
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
});

roomSchema.methods.toJSON = function () {
    const { _id, ...room } = this.toObject();
    room.uid = _id;
    return room;
};

export default model('Room', roomSchema);