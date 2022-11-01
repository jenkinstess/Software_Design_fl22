import { server } from "../../../config";

const ticket = ({ticket, ticket_owner}) => {
    return (
        <>
            <div>
                <h1>Ticket Details</h1>
                <p>Venmo: {ticket_owner.venmo}</p>
                <p>Price: {ticket.price}</p>
                <p><i>Instructions:</i> please venmo the account above with the listed price, and confirm below.</p>
            </div>
        </>
    )
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
      ticket,
      ticket_owner,
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

export default ticket