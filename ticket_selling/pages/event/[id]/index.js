import Link from 'next/link'

const event = ({ event, event_tickets }) => {
    console.log(event_tickets)
    return (
        <>
            <div>
                <h1>{event.name}</h1>
                <h3>{event.date}</h3>
                <p>{event.description}</p>
            </div>
            <div>
                <h2>Event Tickets:</h2>
                <p>Select one to purchase it.</p>
                {event_tickets.map((ticket) => (
                    <Link href={`/ticket/${ticket.id}`}>
                        <a>
                            <p>{ticket.price} &rarr;</p>
                        </a>
                    </Link>
                ))}
            </div>
        </>
    )
}

export const getStaticProps = async (context) => {
    // get event details
    let event_id = context.params.id
    const event_res = await fetch(`http://localhost:3000/api/events/${event_id}`)
    const event = await event_res.json()

    // get tickets associated with the event
    const tickets_res = await fetch('http://localhost:3000/api/tickets')
    const all_tickets = await tickets_res.json()
    const event_tickets = all_tickets.filter((ticket) => ticket.event_id == event_id)

    return {
      props: {
        event,
        event_tickets,
      },
    }
}

export const getStaticPaths = async () => {
    // render other event paths 
    const res = await fetch(`http://localhost:3000/api/events`)
  
    const events = await res.json()
  
    const ids = events.map((event) => event.id)
    const paths = ids.map((id) => ({ params: { id: id.toString() } }))
  
    return {
      paths,
      fallback: false,
    }
  }

export default event