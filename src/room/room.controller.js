import Room from "./room.model.js"
import Hotel from "../hotel/hotel.model.js"
import Amenity from '../amenity/amenity.model.js'
import Event from '../event/event.model.js'
import Reservation from "../reservation/reservation.model.js"
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import { eachDayOfInterval } from "date-fns";
import { stat } from "fs"

cloudinary.config({
    cloud_name: 'djqjmyuoc',
    api_key: '391147666643324',
    api_secret: 'BzLcGiZftBZunt8647Dg2TnKNJs'
});

export const createRoom = async (req, res) => {
    try {
        const data = req.body;
        let preView = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const fullPath = path.join(file.destination, file.filename);
                const result = await cloudinary.uploader.upload(fullPath, {
                    folder: "rooms"
                });
                await fs.unlink(fullPath);
                preView.push(result.secure_url);
            }
        }

        data.preView = preView;

        const room = await Room.create(data);
        await Hotel.findByIdAndUpdate(data.hotel, { $push: { rooms: room._id } }, { new: true });

        return res.status(201).json({
            message: "Room has been created",
            room
        });
    } catch (err) {
        return res.status(500).json({
            message: "Room registration failed",
            error: err.message
        });
    }
};


export const getRoomById = async (req, res) => {
    try {
        const { uid } = req.params;
        const room = await Room.findById(uid)
            .populate("amenity") 

        if (!room || room.status === false) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        return res.status(200).json({
            success: true,
            room
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving room",
            error: error.message
        });
    }
};

export const getRooms = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { status: true };

        const [total, rooms] = await Promise.all([
            Room.countDocuments(query),
            Room.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate("amenity")
        ]);

        return res.status(200).json({
            success: true,
            total,
            rooms
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving rooms",
            error: error.message
        });
    }
};

export const updateRoom = async (req, res) => {
    try {
        const { uid } = req.params;
        const data = req.body;

        if (req.file) {
            data.preView = req.file.filename;
        }

        const room = await Room.findByIdAndUpdate(uid, data, { new: true });

        return res.status(200).json({
            success: true,
            message: "Room updated",
            room
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating room",
            error: error.message
        });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        const { uid } = req.params;

        const room = await Room.findByIdAndUpdate(uid, { status: false }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Room deleted",
            room
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting room",
            error: error.message
        });
    }
};

export const addAmenity = async (req, res) => {
    try {
        const { uid } = req.params;
        const { amenities } = req.body; 

        const updatedRoom = await Room.findByIdAndUpdate(uid,{ $addToSet: { amenity: { $each: amenities } } },{ new: true }).populate("amenity");

        if (!updatedRoom) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Room updated",
            room: updatedRoom
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating room",
            error: error.message
        });
    }
};

export const uploadRoomImages = async (req, res) => {
    try {
        const { uid } = req.params;
        const room = await Room.findById(uid);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Habitación no encontrada"
            });
        }

        let newImages = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const fullPath = path.join(file.destination, file.filename);
                const result = await cloudinary.uploader.upload(fullPath, {
                    folder: "rooms"
                });
                await fs.unlink(fullPath);
                newImages.push(result.secure_url);
            }
        }

        room.preView.push(...newImages);
        await room.save();

        return res.status(200).json({
            success: true,
            message: "Imágenes agregadas exitosamente",
            images: room.preView
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al subir imágenes",
            error: error.message
        });
    }
};

export const searchRooms = async (req, res) => {
    try {
        const { search = "", capacity = "", maxPrice = "", limite = 5, desde = 0 } = req.query;
        const skip = Number(desde);
        const limit = Number(limite);
        const query = {status: true};
        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [{ name: regex }, { number: regex }];
        }
        
        if (capacity) {
            query.capacity = { $gte: Number(capacity) };
        }
        
        if (maxPrice) {
            query.price = { $lte: Number(maxPrice) };
        }

        const [total, rooms] = await Promise.all([
            Room.countDocuments(query),
            Room.find(query)
                .skip(skip)
                .limit(limit)
                .populate("amenity")
        ]);

        return res.status(200).json({
            success: true,
            total,
            rooms
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error searching rooms",
            error: error.message
        });
    }
};

export const verifyRoom = async (req, res) => {
    try {
        const { uid } = req.params;
        const { date } = req.body;

        const room = await Room.findById(uid).populate("reservations");

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found",
            });
        }

        const selectedDate = new Date(date).toISOString().slice(0, 10);

        for (const reservation of room.reservations) {
            const checkInDate = new Date(reservation.checkIn).toISOString().slice(0, 10);
            const checkOutDate = new Date(reservation.checkOut).toISOString().slice(0, 10);

            if (selectedDate >= checkInDate && selectedDate < checkOutDate) {
                return res.status(400).json({
                    success: false,
                    message: "Room is already reserved for this date",
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Room is available for this date",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error verifying room",
            error: error.message,
        });
    }
};

export const getUnavailableDates = async (req, res) => {
    try {
        const { uid } = req.params;

        const room = await Room.findById(uid).populate("reservations");

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found",
            });
        }

        let unavailableDates = [];

        for (const reservation of room.reservations) {
            const { checkIn, checkOut } = reservation;

            const intervalDates = eachDayOfInterval({
                start: new Date(checkIn),
                end: new Date(checkOut),
            });

            const formattedDates = intervalDates.map(date =>
                date.toISOString().slice(0, 10)
            );

            unavailableDates.push(...formattedDates);
        }

        unavailableDates = [...new Set(unavailableDates)];

        return res.status(200).json({
            success: true,
            unavailableDates,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error getting unavailable dates",
            error: error.message,
        });
    }
};
