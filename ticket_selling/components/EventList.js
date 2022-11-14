import EventItem from './EventItem'
import eventStyles from '../styles/Event.module.css'


const EventList = ({ events }) => {
    console.log("events JSON:")
    console.log(typeof events.result)
    return (
        // TODO: add filtering here for here for next week, day, etc. and sorting by event date
        <div className={eventStyles.list}>
            {events && events.map((event) => (
                <EventItem event={event} />
            ))}
        </div>
    )
}

export default EventList