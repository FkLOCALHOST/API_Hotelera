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
        typr: String,
        required: true
    }
})

amenitySchema.methods.toJSON = function () {
    const { _id, ...amenity } = this.toObject();
    amenity.uid = _id;
    return amenity;
};

export default model('Amenity', amenitySchema);