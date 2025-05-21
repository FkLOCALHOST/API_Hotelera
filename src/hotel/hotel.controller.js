import Hotel from './hotel.model.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

cloudinary.config({
    cloud_name: 'djqjmyuoc',
    api_key: '391147666643324',
    api_secret: 'BzLcGiZftBZunt8647Dg2TnKNJs'
});

export const createHotel = async (req, res) => {
    try {
        const data = req.body;
        let imageHotel = null;

        if (req.file) {
            const fullPath = req.file.path;
            const result = await cloudinary.uploader.upload(fullPath, {
                folder: "hotels"
            });
            await fs.unlink(fullPath);
            imageHotel = result.secure_url;
        }
        data.imageHotel = imageHotel;
        const hotel = await Hotel.create(data);

        return res.status(201).json({
            success: true,
            message: 'Hotel creado',
            hotel
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear el hotel',
            error: error.message
        });
    }
};

export const getHotelById = async (req, res) => {
    try {
        const { uid } = req.params;
        const hotel = await Hotel.findById(uid);

        if (!hotel || hotel.status === false) {
            return res.status(404).json({
                success: false,
                message: 'Hotel no encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            hotel
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el hotel',
            error: error.message
        });
    }
};

export const getHotels = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { status: true };

        const [total, hotels] = await Promise.all([
            Hotel.countDocuments(query),
            Hotel.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        return res.status(200).json({
            success: true,
            total,
            hotels
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los hoteles',
            error: error.message
        });
    }
};

export const searchHotels = async (req, res) => {
    try {
        const { limite = 5, desde = 0, search = "" } = req.query;
        const skip = Number(desde);
        const limit = Number(limite);
        const query = { status: true };
        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [ { name: regex }, { department: regex } ];
        }
        const [total, hotels] = await Promise.all([
            Hotel.countDocuments(query),
            Hotel.find(query)
                .skip(skip)
                .limit(limit)
        ]);

        return res.status(200).json({
            success: true,
            total,
            hotels
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los hoteles',
            error: error.message
        });
    }
};

export const updateHotel = async (req, res) => {
    try {
        const { uid } = req.params;
        const data = req.body;

        const hotel = await Hotel.findByIdAndUpdate(uid, data, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Hotel actualizado',
            hotel
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar el hotel',
            error: error.message
        });
    }
};

export const deleteHotel = async (req, res) => {
    try {
        const { uid } = req.params;

        const hotel = await Hotel.findByIdAndUpdate(uid, { status: false }, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Hotel eliminado',
            hotel
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el hotel',
            error: error.message
        });
    }
};
