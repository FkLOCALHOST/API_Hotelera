import { Schema, model } from "mongoose";

const amenitySchema = new Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    }
})

amenitySchema.methods.toJSON = function () {
    const { _id, ...amenity } = this.toObject();
    amenity.uid = _id;
    return amenity;
};

export default model('Amenity', amenitySchema);