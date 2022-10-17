import EventItem from './EventItem'
import eventStyles from '../styles/Event.module.css'


const EventList = ({ events }) => {
    return (
        // TODO: add filtering here for here for next week, day, etc. and sorting by event date
        <div className={eventStyles.list}>
            {events.map((event) => (
                <EventItem event={event} />
            ))}
        </div>
    )
}

export default EventList