import Reservation from './reservation.model.js';
import Room from "../room/room.model.js"
import User from "../user/user.model.js"
import Amenity from "../amenity/amenity.model.js"

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
            await Room.findByIdAndUpdate(reservation.room, {$push: {reservations: reservation._id}}, {new:true}),
            await User.findByIdAndUpdate(reservation.user, {$push: {reservations: reservation._id}}, {new:true}),
            await User.findByIdAndUpdate(reservation.user, {$push: {historyOfReservations: uid}}, {new:true})

        ])
        generateReservationPDF(reservation,room,priceAmenity);
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

        await Reservation.findByIdAndUpdate(uid, {status: "COMPLETED"}, {new:true});

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
