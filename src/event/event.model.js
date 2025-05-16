import {Schema, model} from 'mongoose'

const eventSchema = new Schema({
    name:{
        type: String,
        required: [true, 'El nombre es requerido'], 
        minLength: [5, 'El nombre debe tener al menos 5 caracteres'],
        maxLength: [70, 'El nombre no puede tener más de 70 caracteres']
    },
    description:{
        type: String,
        required: [true, 'La descripción es requerida'],
        minLength: [10, 'La descripción debe tener al menos 10 caracteres'],
        maxLength: [500, 'La descripción no puede tener más de 500 caracteres']
    },
    price:{
        type: Number,
        required: [true, 'El precio es requerido'],
        min: [0, 'El precio no puede ser negativo'],
    },
    date:{
        type: Date,
        required: [true, 'La fecha es requerida'],
        min: [new Date(), 'La fecha no puede ser anterior a la fecha actual']

    },
    place:{
        type: String,
        required: [true, 'El lugar es requerido'],
        minLength: [5, 'El lugar debe tener al menos 5 caracteres'],
        maxLength: [70, 'El lugar no puede tener más de 70 caracteres']
    },
    image:{
        type: String,
        default: null

    },
    status:{
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
    versionKey: false

})

eventSchema.methods.toJSON = function () {
    const { _id, ...event } = this.toObject();
    event.uid = _id;
    return event;
}

export default model('Event', eventSchema)
