import EventItem from './EventItem'
//import eventStyles from '../styles/Event.module.css'


const EventList = ({ events }) => {
    
    return (
        // className={eventStyles.list}
        <div  class="container w-50 mx-auto">
            {events && events.map((event) => (
                <EventItem event={event} />
            ))}
        </div>
    )
}

export default EventList
