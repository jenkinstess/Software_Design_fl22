import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import { server } from '../config';
import { QueryTypes, Sequelize } from 'sequelize';
import { StyleRegistry } from 'styled-jsx';







  export const getStaticProps = async() =>{
    const response = await fetch(`${server}/api/profile`) //local
    // const response = await fetch('http://ec2-3-141-164-182.us-east-2.compute.amazonaws.com:3000/api/profile') //ec2

    //only absolute urls supported ^^^^^
    const data = await response.json()
    console.log(data)
    return {
      props: {users: data.users, tickets: data.tickets} 
    }
  }

  async function listTicket(ticket_id) {
    // update ticket's owner to current user 
    const transfer_res = await fetch(`${server}/api/update_ticket/list_ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket_id,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
      });
      location.reload();
  }

  async function claimTicket(ticket_id) {
    // update ticket's owner to current user 
    const transfer_res = await fetch(`${server}/api/update_ticket/claim_ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket_id,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
      });
      location.reload();
  }

  async function removeTicket(ticket_id) {
    // update ticket's owner to current user 
    const transfer_res = await fetch(`${server}/api/update_ticket/remove_ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket_id,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
      });
      location.reload();
  }

  async function unremoveTicket(ticket_id) {
    // update ticket's owner to current user 
    const transfer_res = await fetch(`${server}/api/update_ticket/unremove_ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket_id,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
      });
      location.reload();
  }

  async function confirmTicket(ticket_id) {
    // update ticket's owner to current user 
    const transfer_res = await fetch(`${server}/api/update_ticket/confirm_ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket_id,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
      });
      location.reload();
  }

async function viewRemoved(){
  document.getElementById("removed_tix").style.display = "block"
  document.getElementById("remove_button").style.display = "none"
}

async function hideRemoved(){
  document.getElementById("removed_tix").style.display = "none"
  document.getElementById("remove_button").style.display = "block"
}

const Profile = ({tickets, users}) =>{
  let cur_venmo;
  let cur_user_index = 0;
  let user_id = 0;
  let users_tix = []
  let selling_tix = []
  const {data, revalidate} = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  },{refreshInterval:10});
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  
  //extract user information from full list of users
  if (data.email) {
    loggedIn = true;
    let users_json = JSON.parse(users)
    let num_users = (users_json.result).length
    for(let i = 0; i < num_users; i++){
      if ((data.email).localeCompare(JSON.stringify(users_json.result[i].email).replaceAll('"', '')) == 0){
        cur_user_index = i;
        cur_venmo = JSON.stringify(users_json.result[i].venmo).replaceAll('"', '')
        user_id = JSON.stringify(users_json.result[i].userid)
      }
    }

  //extract users tickets from full list of tickets
  let tickets_json = JSON.parse(tickets)
  let num_tix = (tickets_json).length
  for (let j = 0; j < num_tix; j++){
    if (user_id == JSON.stringify(tickets_json[j].userUserid).replaceAll('"', '')){
      let is_sold =  JSON.stringify(tickets_json[j].is_sold).replaceAll('"', '')
      if (is_sold == 0){
        is_sold = false
      } else {
        is_sold = true
      }
    let is_removed = JSON.stringify(tickets_json[j].is_removed).replaceAll('"',  '')
    if (is_removed == 0){
      is_removed = true
    } else {
      is_removed = false
    }    
      
      let ticket = [((JSON.stringify(tickets_json[j].event)).replaceAll('"', '')), JSON.stringify(tickets_json[j].price), 
                    is_sold, JSON.stringify(tickets_json[j].event_id), JSON.stringify(tickets_json[j].id_tickets), 
                  is_removed]

      users_tix.push(ticket)
    } else if (data.email == JSON.stringify(tickets_json[j].sold_from).replaceAll('"', '')) {
      let is_confirmed = JSON.stringify(tickets_json[j].is_removed).replaceAll('"',  '')
      if (is_confirmed == 0){
        is_confirmed = false
      } else {
        is_confirmed = true //NOTE; this true false is FLIPPED!!! For convenience with the if statement below 
      }    

       let ticket = [((JSON.stringify(tickets_json[j].event)).replaceAll('"', '')), JSON.stringify(tickets_json[j].price),  JSON.stringify(tickets_json[j].is_sold), JSON.stringify(tickets_json[j].event_id), JSON.stringify(tickets_json[j].id_tickets), is_confirmed]
       
       selling_tix.push(ticket)
    }
  }

  }
  
  return (
    <div>
    {/*<Head>
        <title>Profile</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>*/}
      <h2>Profile</h2>
      {loggedIn && (
        <>
          <p><b>Welcome to the profile page <i>{data.email}!</i></b></p>
          <p>You can find relevant account information here: </p>
          
          <p>Venmo: <i>{cur_venmo}</i></p>

      <h5>Your Tickets: </h5>
      <div>
      <div class="card text-center mx-auto" style={{width: '18rem'}}>
        <ul class="list-group list-group-flush">
          {users_tix.map((ticket) =>
             ticket[2] ? (
              ticket[5] &&
            <li key={ticket} class="list-group-item">
             {/* <a href = {`${server}/event/${ticket[3]}`} ><strong>Event:</strong> {ticket[0]}</a> 
              <strong>Event:</strong> {ticket[0]}
            <li><a href = {`${server}/ticket/${ticket[4]}`} >Price: {ticket[1]}</a></li> */}
              <p><a href = {`${server}/event/${ticket[3]}`}><i>Event</i></a>: {ticket[0]}</p>
              <p><i>Price:</i> $<b>{ticket[1]}</b></p>
              <button onClick={()=>listTicket(ticket[4])}>Resell Ticket</button>
              <button onClick={()=>removeTicket(ticket[4])}>Remove Ticket</button>
            </li>
            
          ) : ticket[5] &&
          <li key={ticket} class="list-group-item">
             {/* <a href = {`${server}/event/${ticket[3]}`} ><strong>Event:</strong> {ticket[0]}</a> 
              <strong>Event:</strong> {ticket[0]}
            <li><a href = {`${server}/ticket/${ticket[4]}`} >Price: {ticket[1]}</a></li> */}
              <p><a href = {`${server}/event/${ticket[3]}`}><i>Event</i></a>: {ticket[0]} | On Market</p>
              <p><i>Price:</i> $<b>{ticket[1]}</b></p>
              <button onClick={()=>claimTicket(ticket[4])}>Claim Ticket</button>
            </li>
          )}
          </ul>
          </div>
        </div>
        <h5>Recently Sold: </h5>
      <div>
        <br></br>
      <div class="card text-center mx-auto" style={{width: '18rem'}}>
        <ul class="list-group list-group-flush">
          {selling_tix.map((ticket) =>
          ticket[5] &&
            <li key={ticket} class="list-group-item">
             {/* <a href = {`${server}/event/${ticket[3]}`} ><strong>Event:</strong> {ticket[0]}</a> 
              <strong>Event:</strong> {ticket[0]}
            <li><a href = {`${server}/ticket/${ticket[4]}`} >Price: {ticket[1]}</a></li> */}
              <p><a href = {`${server}/event/${ticket[3]}`}><i>Event</i></a>: {ticket[0]}</p>
              <p><i>Price:</i> $<b>{ticket[1]}</b></p>
              <button onClick={()=>confirmTicket(ticket[4])}>Confirm Ticket</button>
            </li>
            // NEED A WAY HERE TO INDICATE IF THE TICKET HAS BEEN SOLD OR NOT.... 
          )}
         
          </ul>
          </div>
        </div>
          <button id = "remove_button" onClick = {() => viewRemoved()}>View Removed Tickets</button>
          <div id = "removed_tix">
          <div class="card text-center mx-auto" style={{width: '18rem'}}>
           <ul class="list-group list-group-flush">
           {users_tix.map((ticket) =>
              ticket[5] &&
            <li key={ticket} class="list-group-item">
             {/* <a href = {`${server}/event/${ticket[3]}`} ><strong>Event:</strong> {ticket[0]}</a> 
              <strong>Event:</strong> {ticket[0]}
            <li><a href = {`${server}/ticket/${ticket[4]}`} >Price: {ticket[1]}</a></li> */}
              <p><a href = {`${server}/event/${ticket[3]}`}><i>Event</i></a>: {ticket[0]}</p>
              <p><i>Price:</i> $<b>{ticket[1]}</b></p>
              <button onClick={()=>removeTicket(ticket[4])}>Unremove Ticket</button>
            </li>

          )}
             </ul>
           </div>
          <button id = "remove_button" onClick = {() => hideRemoved()}>Hide Removed Tickets</button>
          </div>
          <br /><br />
        </>
      )}
    </div>
  );
  
}

export default Profile;
