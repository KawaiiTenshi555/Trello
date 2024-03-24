import React from 'react';
import { useNavigate } from 'react-router-dom';
import therellaLogo from '../../assets/therellaLogo.png';
import logoutIcon from "../../assets/logout.png";
import goBack from "../../assets/goBack.png";
import { logout } from "../../api/api"; // Note the direct import of the logout function

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(() => navigate("/")); // Call the imported logout function directly
    };

    return (
        <div className='flex w-screen bg-gray-200 justify-between items-center h-14 border-b-2 border-black px-4'>
            <div onClick={() => navigate("/workspace")}>
                <img src={goBack} className="w-auto h-8 cursor-pointer hover:rotate-90 duration-300" alt="Return button"/>
            </div>
            <img src={therellaLogo} className="w-auto h-10 ml-auto" alt="Therella logo" />
            <div className="ml-auto" onClick={handleLogout}>
                <img src={logoutIcon} className="w-auto h-8 cursor-pointer hover:rotate-90 duration-300" alt="Logout button"/>
            </div>
        </div>
    );
};

export default Header;
