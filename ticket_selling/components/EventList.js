import EventItem from './EventItem'
//import eventStyles from '../styles/Event.module.css'


const EventList = ({ events, logged_in}) => {
    let half_width = events.length <= 2 ? "w-50" : "";
    return (
        // justify-content-center
       //<div class={`container ${half_width} mx-auto`}>
       <div class={`container ${half_width} mx-auto`}>
            <div  class="row row-cols-md-2 row-cols-1 g-2">
                {events && events.map((event) => (
                    <EventItem event={event} logged_in={logged_in}/>
                ))}
            </div>
        </div>
    )
}

export default EventList
