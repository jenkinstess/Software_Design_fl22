import '../styles/Navbar.css'
import Navbar from '../components/navbar'

// import App from 'next/app';

// export default App;

function MyApp({ Component, pageProps }) {
  return <Navbar {...pageProps} />
}

export default MyApp
