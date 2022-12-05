import Link from 'next/link'
import { server } from '../../../config';
import AuthRedirection from '../../../components/AuthRedirection';

const event = ({ event, event_tickets }) => {
    return (
        <>
            <AuthRedirection/>
            <div>
                <h2>Event Details</h2>
                <p>Name: <i>{event.name}</i></p>
                <p>Date: <i>{event.date}</i></p>
                <p>Details: <i>{event.description}</i></p>
                <h4>Price Data:</h4>
                <p>Min: <i>${event.minPrice}</i> | Avg: <i>${event.avgPrice}</i> | Total Available: <i>{event.numTickets}</i></p>
            </div>
            <div>
                <h4>Event Tickets:</h4>
                <p>Select from the tickets below to purchase:</p>
                <div class="card text-center mx-auto" style={{width: '18rem'}}>
                    <ul class="list-group list-group-flush">
                    {event_tickets.map((ticket) => (
                        <li key={ticket} class="list-group-item">
                            <p>
                                $<b>{ticket.price} &emsp;</b>
                                <a href={`/ticket/${ticket.id_tickets}`}  class="btn btn-primary btn-sm">Buy Now &rarr;</a>
                            </p>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export const getStaticProps = async (context) => {
    // get event details
    let event_id = context.params.id
    const event_res = await fetch(`${server}/api/events_buy/${event_id}`)
    const event = await event_res.json()

    // get price data associated with the event
    // get price data for current event:
    var priceData_res = await fetch(`${server}/api/prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: event.name
        }),
    }) 
    const priceData = await priceData_res.json()
    event.minPrice = priceData["minPrice"]
    event.maxPrice = priceData["maxPrice"]
    event.avgPrice = priceData["averagePrice"]
    event.ticketsLeft = priceData["numTickets"] // unsold tickets

    // get tickets associated with the event
    const tickets_res = await fetch(`${server}/api/tickets_hard`)
    
    const all_tickets = await tickets_res.json()
    // filter for matching event and ticket not already sold
    const event_tickets = all_tickets.result.filter((ticket) => ticket.event_id == event_id && !ticket.is_sold)

    return {
      props: {
        event,
        event_tickets,
      },
    }
}

export const getStaticPaths = async () => {
    // render other event paths 
    const res = await fetch(`${server}/api/events_buy`)
  
    const events = await res.json()
    //console.log(events)
    const ids = events.result.map((event) => event.id)
    const paths = ids.map((id) => ({ params: { id: id.toString() } }))
  
    return {
      paths,
      fallback: false,
    }
  }

export default event
