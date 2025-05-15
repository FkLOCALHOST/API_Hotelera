import Amenity from './amenity.model.js'


export const createAmenity = async(req,res) =>{
    try{
        const data = req.body;
        const amenity = new Amenity(data);

        return res.status(201).json({
            message: 'Amenity created',
            amenity
        })
    }catch(error){
        return res.status(500).json({
            message: 'Error creating amenity',
            error: error.message
        })
    }
}

