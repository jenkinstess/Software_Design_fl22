import Link from 'next/link'
import eventStyles from '../styles/Event.module.css'

const EventItem = ({ event }) => {
    return (
      <Link href={`/event/${event.id}`}>
        <a className={eventStyles.preview}>
          <h3>{event.name}</h3>
          <h5>{event.date}</h5>
          <p>{event.description} &rarr;</p>
        </a>
      </Link>
    )
  }
  
  export default EventItem