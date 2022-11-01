import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import EventList from '../components/EventList';
import {useState} from 'react';
import { server } from '../config';

// import UserContext from '../components/UserContext';
const db = require('/config/database');

export default function Buy({ events }) {
    return (
        
        <div>
            <h2>Upcoming Events</h2>
            <h3>Please select from below to purchase a ticket</h3>
            <EventList events={events} />
        </div>
    )
}

export async function getStaticProps() {
    const res = await fetch(`${server}/api/events_buy`)
    const events = await res.json()
    return {
        props: {
          events,
        },
      }
}