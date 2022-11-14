import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import EventList from '../components/EventList';
import {useState, useCallback} from 'react';
import { server } from '../config';
import { createModuleResolutionCache } from 'typescript';

// import UserContext from '../components/UserContext';
const db = require('/config/database');

export default function Buy({ events }) {
    // NOTE: current issue is that the date from db is being converted to central time from UST, whereas current date is already in CST (so doesn't lose 6 hrs)
    // TODO: find a way to get them into the same format / units to compare directly
    
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
          setEvents(events)
        }
      }, [])
    
    return (
        <>
        <div>
            <h2>Upcoming Events</h2>
            <input
                onChange={onChange}
                placeholder='Search events:'
                type='text'
                value={query}
            />
            <h3>Please select from below to purchase a ticket</h3>
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
    // NOTE: 
    const upcoming_events = all_events.filter(event => new Date(event.date) >= new Date()) 
    // sort for events in chronological order
    const events = upcoming_events.sort((a, b) => new Date(a.date) - new Date(b.date))

    return {
        props: {
          events,
        },
      }
}