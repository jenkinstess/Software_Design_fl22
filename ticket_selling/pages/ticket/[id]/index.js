import { server } from "../../../config";
import React, {useState} from 'react';
import Link from 'next/link'
import AuthRedirection from "../../../components/AuthRedirection";

const Ticket = ({ticket, ticket_owner}) => {
    const [transferred, setTransferred] = useState(false);
  
    return (
        <>
            <AuthRedirection/>
            <div>
                <h1>Ticket Details</h1>
                <p>Venmo: {ticket_owner.venmo}</p>
                <p>Price: {ticket.price}</p>
                {!transferred && (
                  <>
                  <p><i>Instructions:</i> please venmo the account above with the listed price, and confirm below.</p>
                  <button onClick={() => handleTransfer(ticket)}>Venmo Sent</button>
                  </>
                )}
                {transferred && (
                  <>
                  <p>The ticket is now transferred to your account!</p>
                  <p>You can access the ticket document in your profile <Link href='/profile'><a><li>here.</li></a></Link></p>
                  </>
                )}
            </div>
        </>
    )

    async function handleTransfer(ticket) {
      console.log('transfer button selected')
      // get logged in user's email
      const loggedin_user_res = await fetch(`${server}/api/me`)
      const loggedin_user = await loggedin_user_res.json()
      
      // get logged in user's id
      const users_res = await fetch(`${server}/api/all_users`)
      const users = await users_res.json()
      const current_user = users.result.filter((user) => user.email.toString() == loggedin_user.email.toString())[0]
      console.log('logged in ID: ' + current_user.userid)
      
      const user_id = current_user.userid
      const ticket_id = ticket.id_tickets
      
      // update ticket's owner to current user 
      const transfer_res = await fetch(`${server}/api/transfer_ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticket_id,
          user_id,
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

  // get owner's details 
  const users_res = await fetch(`${server}/api/all_users`)
  const users = await users_res.json()
  const ticket_owner = users.result.filter((user) => user.userid.toString() == ticket.userUserid.toString())[0]

  return {
    props: {
      ticket: ticket,
      ticket_owner: ticket_owner,
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