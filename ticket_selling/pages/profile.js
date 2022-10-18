
import {useState} from 'react'
function Profile() {
  const [users, setUsers] = useState([])

  const fetchUsers = async() =>{
    const response = await fetch('/api/profile')
    const data = await response.json()
    setUsers(data)
  }
  return(
    <>
    <button onClick={fetchUsers}>Load Profile</button>
    {
      console.log(users)}
      {
        <div>
          <h1>{users.password}</h1>
        </div>
      }
      
    </>
  )
}



  
  export default Profile