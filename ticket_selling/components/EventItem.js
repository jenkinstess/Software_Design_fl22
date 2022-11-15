import Link from 'next/link'
import eventStyles from '../styles/Event.module.css'

const EventItem = ({ event }) => {
    return (
      // <Link href={`/event/${event.id}`}>
      //   <a className={eventStyles.preview}>
      //     <h3>{event.name}</h3>
      //     <h5>{event.date}</h5>
      //     <p>{event.description} &rarr;</p>
      //   </a>
      // </Link>
      <div class="card text-center mt-4 mx-auto">
        <div class="card-body">
          <h5 class="card-title">{event.name}</h5>
          <p class="card-text"><i>Details:</i> {event.description}</p>
          <a href={`/event/${event.id}`} class="btn btn-primary">View Tickets &rarr;</a>
        </div>
        <div class="card-footer text-muted"><i>Date:</i> {event.date}</div>
      </div>
    )
  }
  
  export default EventItem
