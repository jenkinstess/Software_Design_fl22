import { tickets } from '../../../tickets-data'

export default function handler({ query: { id } }, res) {
    // get the ticket with the corresponding ID 
    const filtered_tickets = tickets.filter((ticket) => ticket.id === id)

    if (filtered_tickets.length > 0) {
        res.status(200).json(filtered_tickets[0])
    } else {
        // error 
        res
        .status(404)
        .json({ message: `Ticket with the id of ${id} is not found` })
    }
}