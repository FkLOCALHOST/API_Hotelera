import Reservation from './reservation.model.js';
import Room from "../room/room.model.js";
import User from "../user/user.model.js";
import Amenity from "../amenity/amenity.model.js";
import Event from "../event/event.model.js";
import Hotel from "../hotel/hotel.model.js";
import fs from 'fs';

import { generateReservationPDF, findReservationPDF } from '../middlewares/receipt-generator.js';

export const createReservation = async (req, res) => {
    try {
        const data = req.body;
        const { checkIn, checkOut, room, user } = data;

        if (!checkIn || !checkOut || !room || !user) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios: checkIn, checkOut, room o user.'
            });
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkInDate >= checkOutDate) {
            return res.status(400).json({
                success: false,
                message: 'La fecha de entrada debe ser anterior a la fecha de salida.'
            });
        }

        const existingReservations = await Reservation.find({
            room: room,
            status: { $ne: 'CANCELLED' },
            $or: [
                {
                    checkIn: { $lt: checkOutDate },
                    checkOut: { $gt: checkInDate }
                }
            ]
        });

        if (existingReservations.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'La habitación ya está reservada en ese rango de fechas',
                conflicts: existingReservations
            });
        }

        const reservation = await Reservation.create({
            ...data,
            checkIn: checkInDate,
            checkOut: checkOutDate
        });

        const roomData = await Room.findById(reservation.room);

        let AmenityPrices = [];

        for (const element of roomData.amenity) {
            const amenity = await Amenity.findById(element);
            if (amenity) {
                AmenityPrices.push(parseFloat(amenity.price));
            } else {
                console.warn(`Amenity con ID ${element} no encontrado`);
            }
        }

        const priceAmenity = AmenityPrices.reduce((acc, price) => acc + price, 0);

        await Promise.all([
            Room.findByIdAndUpdate(reservation.room, {$push: { reservations: reservation._id },$inc: { popularityRoom: 1 }}, { new: true }),
            Hotel.findByIdAndUpdate(roomData.hotel, {$push: { reservations: reservation._id },$inc: { popularityHotel: 1 }}, { new: true }),
            User.findByIdAndUpdate(reservation.user, {$push: {reservations: reservation._id,historyOfReservations: reservation._id}}, { new: true })
        ]);

        generateReservationPDF(reservation, roomData, priceAmenity);

        return res.status(201).json({
            success: true,
            message: 'Reserva creada exitosamente',
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
        const { limite = 30 ,desde = 0 } = req.query;
        const query = { status: { $ne: 'CANCELLED' } };

        const [total, reservationsRaw] = await Promise.all([
            Reservation.countDocuments(query),
            Reservation.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('user', 'name')
                .populate('room', 'name') 
        ]);

        const reservations = reservationsRaw.map(r => {
            const obj = r.toObject();
            obj.user = obj.user?.name || null;
            obj.room = obj.room?.name || null; 
            obj.uid = obj._id;
            delete obj._id;
            return obj;
        });

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

        const roomStats = {};
        habitaciones.forEach(room => {
            const tipo = room.name || "Desconocido";
            if (!roomStats[tipo]) {
                roomStats[tipo] = {
                    popularidad: 0,
                    reservaciones: 0
                };
            }
            roomStats[tipo].popularidad += room.popularityRoom || 0;
            roomStats[tipo].reservaciones += (room.reservations?.length || 0);
        });

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
};

export const getReservationReceipt = async (req, res) => {
    try {
        const { uid } = req.params;
        console.log(`[getReservationReceipt] Buscando factura para UID: ${uid}`);
        const pdfPath = findReservationPDF(uid);
        if (!pdfPath) {
            console.log(`[getReservationReceipt] Factura no encontrada para UID: ${uid}`);
            return res.status(404).json({
                success: false,
                message: 'Factura no encontrada para esta reservación'
            });
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${pdfPath.split('/').pop()}"`);
        fs.createReadStream(pdfPath).pipe(res);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al buscar la factura',
            error: error.message
        });
    }
};