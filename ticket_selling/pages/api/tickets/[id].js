import { server } from '../../../config';

export default async function handler({ query: { id } }, res) {
    // get the ticket with the corresponding ID 
    const tickets_res = await fetch(`${server}/api/tickets_hard`)
    const tickets = await tickets_res.json()
    const filtered_tickets = tickets.result.filter((ticket) => ticket.id_tickets.toString() === id)

    if (filtered_tickets.length > 0) {
        res.status(200).json(filtered_tickets[0])
    } else {
        // error 
        res
        .status(404)
        .json({ message: `Ticket with the id of ${id} is not found` })
    }
}