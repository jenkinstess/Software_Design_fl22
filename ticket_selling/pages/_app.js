import Navbar from '../components/Navbar'
import UserContext from '../components/UserContext'
import '../styles/globals.css'
import '../styles/Navbar.css'
 
function MyApp({ Component, pageProps }) {
    // state = {
    //     user: null
    // };
    return (
    <>
      <Navbar />
      {/* <UserContext.Provider value = {{email: this.state.email, loggedIn: this.loggedIn}}>
              <Component {...pageProps} />
          </UserContext.Provider> */}
      <Component {...pageProps} />
    </>
    )
}
 
export default MyApp