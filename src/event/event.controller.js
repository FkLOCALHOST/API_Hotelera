import Event from './event.model.js'
import Hotel from "../hotel/hotel.model.js"
import Room from "../room/room.model.js"
import fs from "fs/promises"
import { v2 as cloudinary } from 'cloudinary';

export const createEvent = async (req, res) => {
    try {
        const data = req.body;
        let imageUrl = null;

        if (req.file) {
            const fullPath = req.file.path;
            const result = await cloudinary.uploader.upload(fullPath, {
                folder: "events"
            });
            await fs.unlink(fullPath);
            imageUrl = result.secure_url;
        }

        data.image = imageUrl;

        const event = await Event.create(data);

        await Promise.all([
            Hotel.findByIdAndUpdate(data.hotel, { $push: { hotelEvents: event._id } }, { new: true }),
            Room.findByIdAndUpdate(data.room, { $push: { roomEvent: event._id } }, { new: true }),
        ]);

        return res.status(200).json({
            success: true,
            message: 'Evento creado exitosamente',
            data: event
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear el evento',
            error: error.message
        });
    }
};

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: true })

        return res.status(200).json({
            success: true,
            message: 'Events found',
            data: events
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error getting events',
            error: error.message
        })
    }
}

export const updateEvent = async (req, res) =>{
    try{
        const {eid} = req.params
        const data = req.body
        let image = req.file ? req.file.filename : null;
        data.image = image

        const event = await Event.findByIdAndUpdate(eid, data, {new: true})
        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Event updated",
            data: event
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error updating event",
            error: error.message
        })
    }
}

export const deleteEvent = async (req, res) => {
    try{
        const {eid} = req.params

        const event = await Event.findByIdAndDelete(eid)

        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Event deleted",
            data: event
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error deleting event",
            error: error.message
        })
    }
} 

export const searchEvent = async (req, res) => {
    try {
        const { 
            search = "", 
            place = "", 
            maxPrice = "", 
            date = "", 
            limite = 10, 
            desde = 0 
        } = req.query;
        
        const skip = Number(desde);
        const limit = Number(limite);
        const query = { status: true };
        
        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [{ name: regex }, { place: regex }];
        }
        
        if (place) {
            query.place = new RegExp(place, "i");
        }
    
        if (maxPrice) {
            query.price = { $lte: Number(maxPrice) };
        }

        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            
            query.date = { $gte: startDate, $lte: endDate };
        }

        const [total, events] = await Promise.all([
            Event.countDocuments(query),
            Event.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ date: 1 }) 
        ]);

        return res.status(200).json({
            success: true,
            total,
            events
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error searching events",
            error: error.message
        });
    }
};