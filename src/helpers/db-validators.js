import User from "../user/user.model.js";
import Amenity from "../amenity/amenity.model.js"
import Hotel from "../hotel/hotel.model.js"
import Room from "../room/room.model.js"
import Reservation from "../reservation/reservation.model.js"

export const emailExist = async(email = "") =>{
    const exist = await User.findOne({email});
    if(exist){
        throw new Error(`The email ${email} is already registered`);
    }

}

export const userNameExist = async(userName = "") =>{
    const exist = await User.findOne({userName});
    if(exist){
        throw new Error(`The userName ${userName} is already registered`);
    }

}

export const uidExist = async(uid = "") =>{
    const exist = await User.findById(uid);
    if(!exist){
        throw new Error("No exixte el ID proporcionado");
    }
}

export const uidAmenityExist = async(uid = "") =>{
    const exist = await Amenity.findById(uid);
    if(!exist){
        throw new Error("No exixte el ID proporcionado");
    }
}

export const uidHotelExist = async(uid = "") =>{
    const exist = await Hotel.findById(uid);
    if(!exist){
        throw new Error("No exixte el ID proporcionado");
    }
}

export const uidRoomExist = async(uid = "") =>{
    const exist = await Room.findById(uid);
    if(!exist){
        throw new Error("No exixte el ID proporcionado");
    }
}

export const uidReservationExist = async(uid = "") =>{
    const exist = await Reservation.findById(uid);
    if(!exist){
        throw new Error("No exixte el ID proporcionado");
    }
}