import EventTypes from "../models/exchange/EventTypes.js"


export const getEventTypes = async () => {
    try {
        const data = await EventTypes.findOne()
        if (data && data.events && data.events.length > 0) {
            return data.events
        } else {
            return []
        }
    } catch (error) {
        console.log(error)
    }
}