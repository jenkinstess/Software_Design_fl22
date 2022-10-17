
const ticket = ({ ticket }) => {
    return (
        <>
            <div>
                <h1>Ticket Details</h1>
                <h3>Venmo: {ticket.venmo}</h3>
                <p>Price: {ticket.price}</p>
            </div>
        </>
    )
}

export const getStaticProps = async (context) => {
    // get ticket details
    let ticket_id = context.params.id
    const ticket_res = await fetch(`http://localhost:3000/api/tickets/${ticket_id}`)
    const ticket = await ticket_res.json()

    return {
      props: {
        ticket,
      },
    }
}

export const getStaticPaths = async () => {
    // render other ticket paths 
    const res = await fetch(`http://localhost:3000/api/tickets`)
  
    const tickets = await res.json()
  
    const ids = tickets.map((ticket) => ticket.id)
    const paths = ids.map((id) => ({ params: { id: id.toString() } }))
  
    return {
      paths,
      fallback: false,
    }
  }

export default ticket