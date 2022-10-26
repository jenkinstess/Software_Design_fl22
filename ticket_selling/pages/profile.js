
// import {useState} from 'react'
// function Profile() {
//   const [users, setUsers] = useState([])

//   const fetchUsers = async() =>{
//     const response = await fetch('/api/profile')
//     const data = await response.json()
//     setUsers(data)
//   }
//   return(
//     <>
//     <button onClick={fetchUsers}>Load Profile</button>
//     <div>
//         <h1>{users.password}</h1>
//     </div>
//     </>
//   )
// }



  
//   export default Profile






//   import {fetchUsers} from '..api/pages/'


  export const getStaticProps = async() =>{
    const response = await fetch('http://localhost:3000/api/profile')
    const data = await response.json()
    return {
      props: {profile: data}
    }
  }

  const Profile = ({ profile }) =>{
    // profile = JSON.stringify(profile)
    // console.log("On profile client side. Here's profile !!!!!!!!!!!!!!!!!!"+ JSON.stringify(profile))
    let json = JSON.stringify(profile)
    // console.log("json: " + json +", JSON Version: " + JSON.stringify(json))
    let result = JSON.parse(json)
    // console.log("result: " + result +", JSON Version: " + JSON.stringify(result))
    let result_json = result.result
    // console.log("result_json: " + result_json +", JSON Version: " + JSON.stringify(result_json))
    let usable_result = JSON.parse(result_json)
    // console.log("usable_result: " + json +", JSON Version: " + JSON.stringify(usable_result))
    let email = usable_result.email
    // console.log("Email: " + email +", JSON Version: " + JSON.stringify(email))
    let id = usable_result.userid 

    // profile = JSON.parse(profile)
    // result = JSON.parse(profile.result)
    // email = JSON.parse(result.email)
    return(
      <div>
        <h1>Your Profile</h1>
        <h3>Hello, here is your email: {email} and User ID: {id} </h3>
      </div>
    );
  }

  export default Profile;