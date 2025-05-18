'use strict';

import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import { connectionDB } from "./mongo.js";
import authRoutes from "../src/auth/auth.routes.js"
import eventRoutes from "../src/event/event.routes.js"
import userRoutes from "../src/user/user.routes.js"
import amenityRoutes from "../src/amenity/amenity.routes.js"
import hotelRoutes from "../src/hotel/hotel.routes.js"
import roomRoutes from "../src/room/room.routes.js"
import reservationRoutes from "../src/reservation/reservation.routes.js"

const middlewares = (app) => {
    app.use(express.urlencoded({extended:false}));
    app.use(express.json());
    app.use(helmet());
    app.use(cors('*'));
    app.use(morgan("dev"));

};

const routes = (app) =>{
    app.use("/hotelManagerSystem/v1/auth", authRoutes);
    app.use("/hotelManagerSystem/v1/event", eventRoutes);
    app.use("/hotelManagerSystem/v1/user", userRoutes);
    app.use("/hotelManagerSystem/v1/amenity", amenityRoutes);
    app.use("/hotelManagerSystem/v1/hotel", hotelRoutes);
    app.use("/hotelManagerSystem/v1/room", roomRoutes);
    app.use("/hotelManagerSystem/v1/reservation", reservationRoutes);
}


const connectionMongo = async() =>{
    try{
        await connectionDB();
    }catch(error){
        console.log(`Data Base connection is failed, please try again ${e}`);
    }
};


export const initServer = () => {
    const app = express();
    const timeInit = Date.now();
    try{
        middlewares(app);
        routes(app);
        connectionMongo();
        app.listen(process.env.PORT);
        const elapsedTime = Date.now() - timeInit;
        console.log(`Server running on port ${process.env.PORT} ${elapsedTime}ms`);
    }catch(error){
        console.log(`Server failed to start: ${error}`);
    }
};