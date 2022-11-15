
// // import {useState} from 'react'
// // function Profile() {
// //   const [users, setUsers] = useState([])

// //   const fetchUsers = async() =>{
// //     const response = await fetch('/api/profile')
// //     const data = await response.json()
// //     setUsers(data)
// //   }
// //   return(
// //     <>
// //     <button onClick={fetchUsers}>Load Profile</button>
// //     <div>
// //         <h1>{users.password}</h1>
// //     </div>
// //     </>
// //   )
// // }



  
// //   export default Profile






// import { SessionProvider } from "next-auth/react"

//   export const getStaticProps = async() =>{
//     const response = await fetch('http://localhost:3000/api/profile')
//     const data = await response.json()
//     return {
//       props: {profile: data}
//     }
//   }

//     // async function getUser() {
//   //         // get logged in user's email
//   //         const loggedin_user_res = await fetch(`http://localhost:3000/api/me`)
//   //         const loggedin_user = await loggedin_user_res.json()
          
//   //         // get logged in user's id
//   //         const users_res = await fetch(`http://localhost:3000/api/all_users`)
//   //         const users = await users_res.json()
//   //         const current_user = users.result.filter((user) => user.email.toString() == loggedin_user.email.toString())[0]
//   //         console.log('logged in ID: ' + current_user.userid)
          
//   //         const user_id = current_user.userid
//   //         return user_id
//   // }


  
//   const Profile = ({ profile }) =>{
//     console.log("acqui" + profile)
//     profile = JSON.stringify(profile)
//     // console.log("On profile client side. Here's profile !!!!!!!!!!!!!!!!!!"+ JSON.stringify(profile))
//     let json = JSON.stringify(profile)
//     console.log("json: " + json +", JSON Version: " + JSON.stringify(json))
//     let result = JSON.parse(json)
//     // console.log("result: " + result +", JSON Version: " + JSON.stringify(result))
//     let result_json = result.result
//     // console.log("result_json: " + result_json +", JSON Version: " + JSON.stringify(result_json))
//     let usable_result = JSON.parse(result_json)
//     // console.log("usable_result: " + json +", JSON Version: " + JSON.stringify(usable_result))
//     let email = usable_result.email
//     // console.log("Email: " + email +", JSON Version: " + JSON.stringify(email))
//     let id = usable_result.userid 

//     // profile = JSON.parse(profile)
//     // result = JSON.parse(profile.result)
//     // email = JSON.parse(result.email)
//     return(
//       <div>
//         <h1>Your Profile</h1>
//         <h3>Hello, here is your email: {email} and User ID: {id} </h3>
//       </div>
//     );
//   }

//   export default Profile;



/* Plan: get user info on main page by method of home page
        use static props to get a list of ALL the tickets - this is done on the backend api page
        then, back on the client side, filter the tickets with the known user information */



import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';




  export const getStaticProps = async() =>{
    const response = await fetch('http://localhost:3000/api/profile')
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
    if (user_id == JSON.stringify(tickets_json[j].userUserid)){
      let ticket = [JSON.stringify(tickets_json[j].event), JSON.stringify(tickets_json[j].price), JSON.stringify(tickets_json[j].is_sold)]
      users_tix.push(ticket)
      let tic_section = document.getElementById("users_tix")
      let new_node = document.createElement("div")
      new_node.append("Event: " + JSON.stringify(tickets_json[j].event) + " Price: " + JSON.stringify(tickets_json[j].price))
      tic_section.append('\n')
      tic_section.append(new_node)
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
          <h5>You can find relevant account informatio here: </h5>
          <p id = "users_tix">Tickets: </p>
          <p>Venmo: {cur_venmo}</p>
          {/* JSON.parse(JSON.stringify(user_arr))['email'] */}
          
          <br /><br />
        </>
      )}
    </div>
  );
  
}

export default Profile;