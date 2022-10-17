import { events } from '../../../events-data'

export default function handler({ query: { id } }, res) {
    // get the event with the corresponding ID 
    const filtered_events = events.filter((event) => event.id === id)

    if (filtered_events.length > 0) {
        res.status(200).json(filtered_events[0])
    } else {
        // error 
        res
        .status(404)
        .json({ message: `Event with the id of ${id} is not found` })
    }
}