import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import EventList from '../components/EventList';
import { useState, useCallback } from 'react';
import { server } from '../config';
import { createModuleResolutionCache } from 'typescript';
import AuthRedirection from '../components/AuthRedirection';
import Image from 'next/image'

// import UserContext from '../components/UserContext';
const db = require('/config/database');

export default function Buy({ events }) {

    const [textQuery, setTextQuery] = useState('')
    const [cur_events, setEvents] = useState(events)
    const [dateQuery, setDateQuery] = useState('')

    // search functionality:
    const textChange = (e) => {
        const query = e.target.value;
        setTextQuery(query)
        let search_results = events
        if (query.length) {
            // filter events by name and description from text in search bar
            search_results = filterText(events, query)
            // apply date filter (if not empty)
            if (dateQuery) {
                search_results = filterDates(search_results, dateQuery)
            }
        } else {
            if (dateQuery) {
                search_results = filterDates(events, dateQuery)
            }
        }
        setEvents(search_results)
    }

    // date filtering functionality
    const dateChange = (e) => {
        const query = e.target.valueAsNumber;
        setDateQuery(query)
        let search_results = events
        if (query) {
            // filter events by name and description from text in search bar
            search_results = filterDates(events, query)
            // apply date filter (if not empty)
            if (textQuery.length) {
                search_results = filterText(search_results, textQuery)
            }
        } else {
            if (textQuery.length) {
                search_results = filterText(events, textQuery)
            }
        }
        setEvents(search_results)
    }

    function filterText(eventList, query) {
        return eventList.filter((event) => (
            event.name.toLowerCase().includes(query.toLowerCase()) ||
            event.description.toLowerCase().includes(query.toLowerCase())
        ))
    }

    function filterDates(eventList, query) {
        return eventList.filter(event => new Date(event.date).getTime() <= query)
    }

    return (
        <>
            <AuthRedirection />
            <div>
                <div class="bg-image" style={{"background-image":"url(/topbackground.webp)", "height":"225px", "object-fit":"cover", "width":"100%", "background-size": "cover"}}>
                    <h2 class="pt-4 text-light">Upcoming Events</h2>
                    <br></br>
                    <p class="text-light">Search events:<input
                        onChange={textChange}
                        placeholder='Event name...'
                        type='text'
                        value={textQuery}
                    /></p>
                    <p class="text-light">View events until: <input
                        type='date'
                        onChange={dateChange}
                        min={new Date().toISOString().split("T")[0]} // after current date
                    /></p>
                    <p class="text-light">Please select from the events below to purchase a ticket:</p>
                    {/* <Image
                        src="/topbackground.webp"
                        alt="Party Picture"
                        layout='fill'
                        class="bg-img"
                    /> */}
                </div>
                <EventList events={cur_events} logged_in={true} />
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
        var today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        var event_date = new Date(event.date)
        event_date.setDate(event_date.getDate() + 1) // add day back to account for lost hours in conversion
        return event_date.getTime() >= today.getTime();
    })
    // sort for events in chronological order
    const sorted_events = upcoming_events.sort((a, b) => new Date(a.date) - new Date(b.date))

    // filter for only events with tickets 
    const events = sorted_events.filter(event => { return event.numTickets && (event.numTickets > 0) })

    // add price data to each event
    for (var idx = 0; idx < events.length; idx++) {
        // get price data for current event:
        var priceData_res = await fetch(`${server}/api/prices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventName: events[idx].name
            }),
        })
        const priceData = await priceData_res.json()

        // append price data to each event element
        events[idx].minPrice = priceData["minPrice"]
        events[idx].maxPrice = priceData["maxPrice"]
        events[idx].avgPrice = priceData["averagePrice"]
        events[idx].allTickets = priceData["numTickets"] // unsold tickets
    }

    return {
        props: {
            events,
        },
    }
}
