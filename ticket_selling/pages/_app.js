import Navbar from '../components/Navbar'
import UserContext from '../components/UserContext'
import '../styles/globals.css'
import '../styles/Navbar.css'
import '../styles/OCR.css'
import { SessionProvider } from "next-auth/react"
 
function MyApp({ Component, pageProps: { session, ...pageProps }}) {
    // state = {
    //     user: null
    // };
    return (
    <>
    <Navbar />
    <SessionProvider session={session}>
      {/* <UserContext.Provider value = {{email: this.state.email, loggedIn: this.loggedIn}}>
              <Component {...pageProps} />
          </UserContext.Provider> */}
      <Component {...pageProps} />
    </SessionProvider>
    </>
    )
}
 
export default MyApp