import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import { server } from '../config';




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


const Profile = ({tickets, users}) =>{
  let user_arr;
  let cur_venmo;
  let cur_user_index = 0;
  let user_id = 0;
  let users_tix = []
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
      let ticket = [JSON.stringify(tickets_json[j].event), JSON.stringify(tickets_json[j].price), JSON.stringify(tickets_json[j].is_sold), JSON.stringify(tickets_json[j].event_id), JSON.stringify(tickets_json[j].id_tickets)]
      users_tix.push(ticket)
    }
  }

  }
  
  return (
    <div>
      <Head>
        <title>Profile</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1>Profile</h1>
      {loggedIn && (
        <>
          <h3>Welcome to the profile page {data.email}!</h3>
          <p>You can find relevant account information here: </p>
          
          <p>Venmo: {cur_venmo}</p>

      <h5>Your Tickets: </h5>
      <div>
          {users_tix.map((ticket) =>
            <ul><li>
             <a href = {`${server}/event/${ticket[3]}`} ><strong>Event:</strong> {ticket[0]}</a> 
              {/* <strong>Event:</strong> {ticket[0]} */}
            <li><a href = {`${server}/ticket/${ticket[4]}`} >Price: {ticket[1]}</a></li>
            </li>
            </ul>
          )}
          </div>
          
          {/* JSON.parse(JSON.stringify(user_arr))['email'] */}
          
          <br /><br />
        </>
      )}
    </div>
  );
  
}

export default Profile;