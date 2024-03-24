import * as api from "../api/api";
import trelloLogo from "../assets/TrelloLogo.png";
import therellaLogo from "../assets/therellaLogo.png";
import Cookies  from "js-cookie";
import {useNavigate} from "react-router-dom";

const process = {
  env: {
    REACT_APP_BASE_URL: "https://api.trello.com/1/",
    REACT_APP_REDIRECT_URL: "http://localhost:5173/workspace",
    REACT_APP_API_KEY: "",
  },
};



function Home() {let navigate=useNavigate()
  class authAPI {

    static authorizeApp() {
      if(!Cookies.get('trello_token')) {
        window.open(
            `${api.process.env.REACT_APP_BASE_URL}authorize/?key=${api.process.env.REACT_APP_API_KEY}&return_url=${api.process.env.REACT_APP_REDIRECT_URL}&callback_method=fragment&scope=read,write&expiration=${api.process.env.REACT_APP_EXPIRATION}&name=trelloClientApp&response_type=fragment`,
            "_self"
        );
      }else
        navigate('/workspace')
    }
  }
  return (
    <>
      <div className='flex flex-col h-screen w-screen justify-center items-center bg-gradient-to-r from-slate-300 to-slate-100'>
        <div className='flex justify-center content-center'>
          <img src={therellaLogo} className="logo w-3/4" alt="Vite logo" />
        </div>
        <div className='flex justify-center content-center mt-10'>
          <div className='flex justify-center w-96 py-2 rounded-lg bg-blue-400 shadow-lg shadow-blue-400/50 text-white cursor-pointer' href='#' onClick={() => authAPI.authorizeApp(process.env.REACT_APP_API_KEY)}>Login with <img className='w-20' src={trelloLogo} alt="trello logo"></img></div>
        </div>
      </div>
    </>
  );
}

export default Home;
