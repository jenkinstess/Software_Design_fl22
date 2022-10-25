import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import EventList from '../components/EventList';
import {useState} from 'react'

// import UserContext from '../components/UserContext';
const db = require('/config/database');

// export default function Buy({ events }) {
//     console.log({events})
//     return (
//         <div>
//             <h2>Upcoming Events</h2>
//             <h3>Please select from below to purchase a ticket</h3>
//             <EventList events={events} />
//         </div>
//     )
// }

export default function Buy() {
    const [events, setEvents] = useState([])
    const getCurrentEvents = async () => {
        // pulling events data from events-data.js file
        const res = await fetch('/api/events_buy')
        const events = await res.json()
        console.log(events)
        setEvents(events)
    }
    return (
        
        <div>
            <h2>Upcoming Events</h2>
            <h3>Please select from below to purchase a ticket</h3>
            <button onClick={getCurrentEvents}>Load Events</button>
            <EventList events={events} />
        </div>
    )
}