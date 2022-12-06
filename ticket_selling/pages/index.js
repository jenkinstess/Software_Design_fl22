import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import Router from 'next/router';
import homeStyles from '../styles/Home.module.css'
import Image from 'next/image'
import EventList from '../components/EventList';
import { server } from '../config';

// import UserContext from '../components/UserContext';
const db = require('/config/database');
//test db
// db.authenticate()
//     .then(() => console.log('Database connected...'))
//     .catch(err => console.log("Error: " + err))


function Home({ trending_events }) {
  const { data, revalidate } = useSWR('/api/me', async function (args) {
    const res = await fetch(args);
    return res.json();
  }, { refreshInterval: 10 });
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
    // localStorage.setItem('email', data.email);
    // localStorage.setItem('loggedIn', loggedIn);
  }
  
  return (
    <div>
      <Head>
        <title>WashU Party Tix!</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div class="bg-image">
        <div style={{
          zIndex: -1,
          position: "fixed",
          width: "100vw",
          height: "100vh"
        }}>
          <Image
            src="/homebackground3.webp"
            alt="Party Picture"
            layout="fill"
            objectFit='cover'
          />
        </div>
        {/* <div class='mask' style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}></div> */}

      </div>
      <h1 style={{ "padding-top": "20px", "color": "white" }}>WashU Party Tix</h1>
      {loggedIn && (
        <>
          <h4 style={{ "padding-top": "10px", "color": "white" }} class="mb-4">Welcome <i>{data.email}</i>!</h4>
          <h3 style={{ "color": "white" }} class="mb-4">Ready to Party?</h3>
          <a href={`/buy`} class="btn btn-primary me-2">Buy Tickets &rarr;</a>
          <a href={`/sell`} class="btn btn-primary">Sell Tickets &rarr;</a>
        </>
      )}
      {!loggedIn && (
        <>
          <p class="text-light my-4">
            Welcome to the premier platform for buying and selling party and event tickets at WashU!
            <br></br>
            Securely, efficiently, and anonymously transact with fellow students.
          </p>
          <h3 style={{ "color": "white" }} class="mb-4">Ready to Party?</h3>
          <a href={`/login`} class="btn btn-primary me-2">Login &rarr;</a>
          <a href={`/signup`} class="btn btn-primary">Signup &rarr;</a>
          
        </>
      )}
      <h3 class="text-light mt-4">Trending Events:</h3>
      <EventList events={trending_events} logged_in={loggedIn} />

      {/* {loggedIn && (
          <>
            <p>Welcome <i>{data.email}!</i></p>
            <button
              onClick={() => {
                cookie.remove('token');
                Router.push("/")
                revalidate;
              }}>
              Logout
            </button>
            
            <br /><br />
          </>
        )} */}

    </div>
  );

}

export async function getStaticProps() {
  // TODO: copied from buy page - refactor
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

  // filter for only events with tickets 
  const events_available = upcoming_events.filter(event => { return event.numTickets && (event.numTickets > 0) })
  
  // sort for events by number of tickets available
  const sorted_events = events_available.sort((a, b) => parseInt(b.numTickets) - parseInt(a.numTickets))
  
  // only show x events
  let events_count = 2
  const trending_events = sorted_events.slice(0, events_count)

  // add price data to each event
  for (var idx = 0; idx < trending_events.length; idx++) {
    // get price data for current event:
    var priceData_res = await fetch(`${server}/api/prices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName: trending_events[idx].name
      }),
    })
    const priceData = await priceData_res.json()

    // append price data to each event element
    trending_events[idx].minPrice = priceData["minPrice"]
    trending_events[idx].maxPrice = priceData["maxPrice"]
    trending_events[idx].avgPrice = priceData["averagePrice"]
    trending_events[idx].allTickets = priceData["numTickets"] // unsold tickets
  }

  return {
    props: {
      trending_events,
    },
  }
}

export default Home;
