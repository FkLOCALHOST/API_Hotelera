import Event from './event.model.js'

export const createEvent = async (req, res) => {
    try{
        const data = req.body
        let image = req.file ? req.file.filename : null
        data.image = image

        const event = await Event.create(data)

        return res.status(200).json({
            success: true,
            message: 'Event created',
            data: event
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        })
    }
}

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
    try{
        const {name} = req.params

        const event = await Event.findOne({name})

        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Event found",
            data: event
        })


    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error searching event",
            error: error.message
        })
    }
}




