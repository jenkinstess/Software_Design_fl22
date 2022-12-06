import Link from 'next/link'
import { server } from '../../../config';
import React, { useEffect, useState } from 'react';
import AuthRedirection from '../../../components/AuthRedirection';
import Image from 'next/image';

const Event = ({ event, all_tickets }) => {
  const [event_tickets, setTickets] = useState(all_tickets);
  const [err_text, setText] = useState('');

  // filter out tickets that are owned by the user
  useEffect(() => {
    filterOwned(function (others_tickets) {
      // update event tickets to filtered list 
      if(others_tickets.length === 0) {
        setText('You own all available tickets for this event.')
      }
      setTickets(others_tickets)
    })
  }, [])

  async function filterOwned(callback) {
    // get currently logged in user's email
    const loggedin_user_res = await fetch(`${server}/api/me`)
    const loggedin_user = await loggedin_user_res.json()
    // get corresponding user in users table
    const users_res = await fetch(`${server}/api/all_users`)
    const users = await users_res.json()
    const current_user = users.result.filter((user) => user.email.toString() == loggedin_user.email.toString())[0]
    // filter tickets to aren't owned by logged in user
    const others_tickets = all_tickets.filter((ticket) => parseInt(ticket.userUserid) !== current_user.userid)
    callback(others_tickets)
  }

  return (
    <>
      <AuthRedirection />
      <div class="bg-image" style={{ "background-image": "url(/topbackground.webp)", "height": "270px", "object-fit": "cover", "width": "100%", "background-size": "cover" }}>
        <h1 class="pt-4 text-light">Event Details</h1>
        <p class="text-light">Name: <i>{event.name}</i></p>
        <p class="text-light">Date: <i>{event.date}</i></p>
        <p class="text-light">Details: <i>{event.description}</i></p>
        <h4 class="text-light">Price Data:</h4>
        <p class="text-light">Min: <i>${event.minPrice}</i> | Avg: <i>${event.avgPrice}</i> | Total Available: <i>{event.numTickets}</i></p>
      </div>
      <div>
        <h4 class="pt-3">Event Tickets:</h4>
        <p>Select from the tickets below to purchase:</p>
        <div class="card text-center mx-auto" style={{ width: '15rem' }}>
          {/* list-group-flush */}
          <ul class="list-group">
            {event_tickets && event_tickets.map((ticket) => (
              <li key={ticket} class="list-group-item d-flex justify-content-between align-items-center">
                <b>${ticket.price}</b>
                <a href={`/ticket/${ticket.id_tickets}`} class="btn btn-primary btn-sm">Purchase &rarr;</a>
              </li>
            ))}
          </ul>
        </div>
        {err_text && <p class="mt-3 text-danger">{err_text}</p>}
      </div>
    </>
  )
}

export const getStaticProps = async (context) => {
  // get event details
  let event_id = context.params.id
  const event_res = await fetch(`${server}/api/events_buy/${event_id}`)
  const event = await event_res.json()

  // get price data associated with the event
  // get price data for current event:
  var priceData_res = await fetch(`${server}/api/prices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventName: event.name
    }),
  })
  const priceData = await priceData_res.json()
  event.minPrice = priceData["minPrice"]
  event.maxPrice = priceData["maxPrice"]
  event.avgPrice = priceData["averagePrice"]
  event.ticketsLeft = priceData["numTickets"] // unsold tickets

  // get tickets associated with the event
  const tickets_res = await fetch(`${server}/api/tickets_hard`)

  const tickets_list = await tickets_res.json()

  // filter for matching event and ticket not already sold
  const tickets_filtered = tickets_list.result.filter((ticket) => ticket.event_id == event_id && !ticket.is_sold)

  // sort by price
  const all_tickets = tickets_filtered.sort((a, b) => a.price - b.price)

  return {
    props: {
      event,
      all_tickets,
    },
  }
}

export const getStaticPaths = async () => {
  // render other event paths 
  const res = await fetch(`${server}/api/events_buy`)

  const events = await res.json()
  //console.log(events)
  const ids = events.result.map((event) => event.id)
  const paths = ids.map((id) => ({ params: { id: id.toString() } }))

  return {
    paths,
    fallback: false,
  }
}

export default Event
