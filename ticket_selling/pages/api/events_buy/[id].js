import { server } from '../../../config';

export default async function handler({ query: { id } }, res) {
    const events = await fetch(`${server}/api/events_buy/`)
    const events_res = await events.json()
    const filtered_events = events_res.result.filter((event) => event.id.toString() === id)

    if (filtered_events.length > 0) {
        res.status(200).json(filtered_events[0])
    } else {
    // error 
        res
        .status(404)
        .json({ message: `Event with the id of ${id} is not found` })
    }
}