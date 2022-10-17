import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import Navbar from '../components/navbar'
import Router from 'next/router';
import EventList from '../components/EventList';

// import UserContext from '../components/UserContext';
const db = require('/config/database');

export default function Buy({ events }) {
    //console.log({events})
    return (
        <div>
            <h2>Upcoming Events</h2>
            <h3>Please select from below to purchase a ticket</h3>
            <EventList events={events} />
        </div>
    )
}

export const getStaticProps = async () => {
    // pulling events data from events-data.js file
    const res = await fetch('http://localhost:3000/api/events')
    const events = await res.json()

    return {
        props: {
            events,
        },
    }
}