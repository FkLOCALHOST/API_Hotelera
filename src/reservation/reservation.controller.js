import Reservation from './reservation.model.js';
import Room from "../room/room.model.js"
import User from "../user/user.model.js"
import Amenity from "../amenity/amenity.model.js";
import Event from "../event/event.model.js";
import Hotel from "../hotel/hotel.model.js";

import { generateReservationPDF } from '../middlewares/receipt-generator.js';

export const createReservation = async (req, res) => {
    try {
        const data = req.body;
        const reservation = await Reservation.create(data);

        const room = await Room.findById(reservation.room);

        let AmenityPrices = [];

        for (const element of room.amenity) {
            const amenity = await Amenity.findById(element);
            if (amenity) {
                AmenityPrices.push(parseFloat(amenity.price));
            } else {
                console.warn(`Amenity con ID ${element} no encontrado`);
            }
        }

        let priceAmenity = AmenityPrices.reduce((acc, price) => acc + price, 0);

        Promise.all([
            await Room.findByIdAndUpdate(reservation.room, { $setOnInsert: { reservations: reservation._id }, $inc: { popularityRoom: +1 } }, { new: true }),
            await Hotel.findByIdAndUpdate(room.hotel, { $setOnInsert: { reservations: reservation._id }, $inc: { popularityHotel: +1 } }, { new: true }),
            await User.findByIdAndUpdate(reservation.user, { $setOnInsert: { reservations: reservation._id } }, { new: true }),
            await User.findByIdAndUpdate(reservation.user, { $setOnInsert: { historyOfReservations: reservation._id } }, { new: true })
        ])
        generateReservationPDF(reservation, room, priceAmenity);
        return res.status(201).json({
            success: true,
            message: 'Reserva creada',
            reservation
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear la reserva',
            error: error.message
        });
    }
};

export const getReservationById = async (req, res) => {
    try {
        const { uid } = req.params;
        const reservation = await Reservation.findById(uid);

        if (!reservation || reservation.status === 'CANCELLED') {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }

        return res.status(200).json({
            success: true,
            reservation
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener la reserva',
            error: error.message
        });
    }
};

export const completeReservation = async (req, res) => {
    try {
        const { uid } = req.params;
        const reservation = await Reservation.findById(uid);

        await Reservation.findByIdAndUpdate(uid, { status: "COMPLETED" }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Reserva completada con éxito"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al completar la reserva',
            error: error.message
        });
    }
};

export const getReservations = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { status: { $ne: 'CANCELLED' } };

        const [total, reservations] = await Promise.all([
            Reservation.countDocuments(query),
            Reservation.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        return res.status(200).json({
            success: true,
            total,
            reservations
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las reservas',
            error: error.message
        });
    }
};

export const updateReservation = async (req, res) => {
    try {
        const { uid } = req.params;
        const data = req.body;

        const reservation = await Reservation.findByIdAndUpdate(uid, data, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Reserva actualizada',
            reservation
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar la reserva',
            error: error.message
        });
    }
};

export const cancelReservation = async (req, res) => {
    try {
        const { uid } = req.params;

        const reservation = await Reservation.findByIdAndUpdate(uid, { status: 'CANCELLED' }, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Reserva cancelada',
            reservation
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al cancelar la reserva',
            error: error.message
        });
    }
};

export const searchReservations = async (req, res) => {
    try {
        const { limite = 5, desde = 0, search = "" } = req.query;
        const skip = Number(desde);
        const limit = Number(limite);
        const regex = new RegExp(search, 'i');

        const pipeline = [
            { $match: { status: { $ne: 'CANCELLED' } } },
            { $lookup: { from: Room.collection.name, localField: 'room', foreignField: '_id', as: 'room' } },
            { $unwind: '$room' },
            { $lookup: { from: Hotel.collection.name, localField: 'room.hotel', foreignField: '_id', as: 'hotel' } },
            { $unwind: '$hotel' },
            {
                $lookup: {
                    from: Event.collection.name,
                    localField: 'room.roomEvent',
                    foreignField: '_id',
                    as: 'events'
                }
            }
        ];
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { 'hotel.name': regex },
                        { 'hotel.department': regex },
                        { 'events.name': regex },
                        { 'events.place': regex }
                    ]
                }
            });
        }
        pipeline.push({
            $facet: {
                total: [{ $count: 'count' }],
                data: [{ $skip: skip }, { $limit: limit }]
            }
        });

        const result = await Reservation.aggregate(pipeline);
        const total = result[0].total[0]?.count || 0;
        const reservations = result[0].data;

        return res.status(200).json({
            success: true,
            total,
            reservations
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al buscar reservas',
            error: error.message
        });
    }
};

export const getStatsGenerales = async (req, res) => {
    try {
        const { limite = 50, desde = 0 } = req.query;

        const [hoteles, habitaciones] = await Promise.all([
            Hotel.find()
                .skip(Number(desde))
                .limit(Number(limite)),
            Room.find()
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        const hotelStats = {};
        hoteles.forEach(hotel => {
            hotelStats[hotel.name] = {
                popularidad: hotel.popularityHotel || 0,
                reservaciones: hotel.reservations?.length || 0
            };
        });

        const roomStats = habitaciones.reduce((acc, room) => {
            acc.popularidad += room.popularityRoom || 0;
            acc.reservaciones += (room.reservations?.length || 0);
            return acc;
        }, { popularidad: 0, reservaciones: 0 });

        return res.status(200).json({
            success: true,
            total: hoteles.length,
            hotel: hotelStats,
            room: roomStats
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las estadísticas',
            error: error.message
        });
    }
}
