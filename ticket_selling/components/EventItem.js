import Link from 'next/link'
import eventStyles from '../styles/Event.module.css'

const EventItem = ({ event, logged_in }) => {

  return (
    // <Link href={`/event/${event.id}`}>
    //   <a className={eventStyles.preview}>
    //     <h3>{event.name}</h3>
    //     <h5>{event.date}</h5>
    //     <p>{event.description} &rarr;</p>
    //   </a>
    // </Link>
    // <div class="card text-center m-4 shadow d-md-inline-flex">
    // style={{ "width": "20rem" }}
      <div class="card text-center m-4 shadow mx-auto" style={{ "width": "20rem" }}>
        <div class="card-body">
          <h3 class="card-title">{event.name}</h3>
          <p class="card-text"><i>Details:</i> {event.description}</p>
          <p class="card-text"><i>Prices:</i> Min: ${event.minPrice} | Average: ${event.avgPrice}</p>
          <p class="card-text"><i>Date:</i> {event.date}</p>
          <p class="card-text">{event.ticketsLeft} ticket{parseInt(event.ticketsLeft) > 1 ? "s" : ""} available now.</p>
          {logged_in && (<a href={`/event/${event.id}`} class="btn btn-primary">View Tickets &rarr;</a>)}
        </div>
      </div>
    
  )
}

export default EventItem
