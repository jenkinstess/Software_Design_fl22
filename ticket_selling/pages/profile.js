
import {useState} from 'react'
function Profile() {
  const [users, setUsers] = useState([])

  const fetchUsers = async() =>{
    const response = await fetch('/api/profile')
    const data = await response.json()
    setUsers(data)
  }

  // export const getStaticProps = async () => {
  //   // pulling events data from events-data.js file
  //   const response = await fetch('/api/profile')
  //   const user = await response.json()
  //   return {
  //       props: {
  //           user,
  //       },
  //   }
  // }

  return(
    <>
    <button onClick={fetchUsers}>Load Profile</button>
    <div>
        <h1>{users.password}</h1>
    </div>
    </>
  )
}



  
  export default Profile