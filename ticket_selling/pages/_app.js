import Navbar from '../components/Navbar'
import AuthRedirection from '../components/AuthRedirection'
import UserContext from '../components/UserContext'
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/globals.css'
import '../styles/Navbar.css'
import '../styles/OCR.css'
import { SessionProvider } from "next-auth/react"
import { useEffect } from 'react';
 
function MyApp({ Component, pageProps: { session, ...pageProps }}) {
    // state = {
    //     user: null
    // };

    useEffect(() => {
      require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

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
