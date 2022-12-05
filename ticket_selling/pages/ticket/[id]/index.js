import { server } from "../../../config";
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import AuthRedirection from "../../../components/AuthRedirection";
import { useRouter } from 'next/router';
import Image from 'next/image'

async function getUser(callback) {
  // get currently logged in user's details with email
  const loggedin_user_res = await fetch(`${server}/api/me`)
  const loggedin_user = await loggedin_user_res.json()
  if (!('email' in loggedin_user)) {
    // user not logged in
    callback(false)
  } else {
    const users_res = await fetch(`${server}/api/all_users`)
    const users = await users_res.json()
    const current_user = users.result.filter((user) => user.email.toString() == loggedin_user.email.toString())[0]
    callback(current_user)
  }
}


const Ticket = ({ ticket, ticket_owner, event }) => {
  let ticket_owner_email = ticket_owner.email
  const [transferred, setTransferred] = useState(false);
  const [user, setUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    // TODO: refactor this so that the checking of user log in isn't redundent and we can just use exisitng component
    // if ticket sold or current user already owns ticket, redirect to event page
    getUser(function (current_user) {
      // checks that user logged in first 
      if (current_user) {
        if (ticket.is_sold || current_user.userid == ticket.userUserid) {
          router.push(`/event/${event.id}`);
        } else {
          setUser(current_user)
        }
      } else {
        // route back to login if not already signed in
        router.push('/login')
      }
    })
  }, [])
  
  return (
    <>
      <div class="bg-image">
        <div style={{
          zIndex: -1,
          position: "absolute",
          width: "100vw",
          height: "19vh"
        }}>
          <Image
            src="/topbackground.webp"
            alt="Party Picture"
            layout="fill"
            objectFit='cover'
          />
        </div>
      </div>
      <div>
        <h2 class="text-light pt-4">Ticket Details</h2>
        <p class="text-light">Event: <i>{event.name}</i></p>
        <p class="text-light">Venmo: <i>{ticket_owner.venmo}</i></p>
        <p class="pt-3"><b>Ticket Price: <i>${ticket.price}</i></b></p>
        {!transferred && (
          <>
            <p><i>Instructions:</i> please venmo the account above with the listed price, and confirm payment below:</p>
            <button class="btn btn-primary" onClick={() => handleTransfer(ticket, user, ticket_owner_email)}>Venmo Sent &#10003;</button>
          </>
        )}
        {transferred && (
          <>
            <p>The ticket is now transferred to your account!</p>
            <p>You can access the ticket in your profile <Link href='/profile'><a>here.</a></Link></p>
          </>
        )}
      </div>
    </>
  )

  async function handleTransfer(ticket, user, ticket_owner_email) {
    //console.log('transfer button selected')

    const ticket_id = ticket.id_tickets
    const prev_owner_email = ticket_owner_email
    const user_id = user.userid

    // update ticket's owner to current user 
    const transfer_res = await fetch(`${server}/api/transfer_ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket_id,
        user_id,
        prev_owner_email,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setTransferred(true)
        }
      });
  }
}

export const getStaticProps = async (context) => {
  // get ticket details
  let ticket_id = context.params.id
  const ticket_res = await fetch(`${server}/api/tickets/${ticket_id}`)
  const ticket = await ticket_res.json()

  // get event details
  const events_res = await fetch(`${server}/api/events_buy`)
  const events = await events_res.json()
  const event = events.result.filter((event) => event.id.toString() == ticket.event_id.toString())[0]

  // get owner's details 
  const users_res = await fetch(`${server}/api/all_users`)
  const users = await users_res.json()
  const ticket_owner = users.result.filter((user) => user.userid.toString() == ticket.userUserid.toString())[0]

  return {
    props: {
      ticket: ticket,
      ticket_owner: ticket_owner,
      event: event,
    },
  }
}

// TODO: add ability to transfer ownership by clicking button

export const getStaticPaths = async () => {
  //render other ticket paths 
  const res = await fetch(`${server}/api/tickets_hard`)
  const tickets = await res.json()
  console.log(tickets)
  const ids = tickets.result.map((ticket) => ticket.id_tickets)
  const paths = ids.map((id) => ({ params: { id: id.toString() } }))

  return {
    paths,
    fallback: false,
  }
}

export default Ticket
