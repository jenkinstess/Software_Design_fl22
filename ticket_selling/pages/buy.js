import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import EventList from '../components/EventList';
import {useState, useCallback} from 'react';
import { server } from '../config';
import { createModuleResolutionCache } from 'typescript';

// import UserContext from '../components/UserContext';
const db = require('/config/database');

export default function Buy({ events }) {
    
    const [query, setQuery] = useState('')
    const [cur_events, setEvents] = useState(events)

    // search functionality:
    const onChange = useCallback((e) => {
        const query = e.target.value;
        setQuery(query)
        if (query.length) {
            // filter events by name in search bar
            const search_results = cur_events.filter(event => event.name.toLowerCase().includes(query.toLowerCase()))
            setEvents(search_results)
        } else {
          setEvents(cur_events)
        }
      }, [])

    // date filtering functionality
    const filterDates = (e) => {
        const to_date = e.target.valueAsNumber;
        if (to_date) {
            const events_within = cur_events.filter(event => new Date(event.date).getTime() <= to_date)
            setEvents(events_within)
        } else {
            setEvents(events)
        }
    }

    // TODO: get the search and date filter working in sync
    
    return (
        <>
        <div>
            <h2>Upcoming Events</h2>
            <h3>Please select from below to purchase a ticket</h3>
            <p>Search events: <input
                onChange={onChange}
                placeholder='Event name...'
                type='text'
                value={query}
            /></p>
            <p>View events until: <input
                type='date'
                onChange={filterDates}
                min={new Date().toISOString().split("T")[0]} // after current date
            /></p>
            <EventList events={cur_events} />
        </div>
        </>
    )

}

export async function getStaticProps() {
    const events_res = await fetch(`${server}/api/events_buy`)
    const events_json = await events_res.json()
    const all_events = events_json ? events_json.result : []

    // filter events for those on or after current date
    const upcoming_events = all_events.filter(event => {
        // adjust for time zone differences:
        // date from db is being converted to central (or browser's) time from UST by subtracting hours (6 in case of CST)
        var now = new Date();
        var today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() ));
        var event_date = new Date(event.date)
        event_date.setDate(event_date.getDate()+1) // add day back to account for lost hours in conversion
        return event_date.getTime() >= today.getTime();
    }) 
    // sort for events in chronological order
    const events = upcoming_events.sort((a, b) => new Date(a.date) - new Date(b.date))

    return {
        props: {
          events,
        },
      }
}