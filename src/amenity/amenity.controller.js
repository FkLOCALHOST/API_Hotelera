import Amenity from './amenity.model.js'


export const createAmenity = async(req,res) =>{
    try{
        const data = req.body;
        const amenity = await Amenity.create(data)

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

export const getAmenityById = async (req, res) => {
    try{
        const { uid } = req.params;
        const amenity = await Amenity.findById(uid)

        if(!amenity){
            return res.status(404).json({
                success: false,
                message: "Comodidad no encontrada"
            })
        }

        return res.status(200).json({
            success: true,
            amenity
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al obtener las comodidades",
            error: err.message
        })
    }
}

export const getAmenity = async (req, res) => {
    try{
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true }

        const [total, amenity ] = await Promise.all([
            Amenity.countDocuments(query),
            Amenity.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        return res.status(200).json({
            success: true,
            total,
            amenity
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al obtener las comodidades",
            error: err.message
        })
    }
}

export const deleteAmenity = async (req, res) => {
    try{
        const { uid } = req.params
        
        const amenity = await Amenity.findByIdAndUpdate(uid, {status: false}, {new: true})

        return res.status(200).json({
            success: true,
            message: "Comodidad eliminado",
            amenity
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al eliminar la comodidad",
            error: err.message
        })
    }
}

export const updateAmenity = async (req, res) => {
    try {
        const { uid } = req.params;
        const  data  = req.body;

        const amenity = await Amenity.findByIdAndUpdate(uid, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Comodidad Actualizada',
            amenity,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la comodidad',
            error: err.message
        });
    }
}