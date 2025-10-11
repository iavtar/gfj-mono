import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/user/userSlice';
import { Menu as MenuIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import gfjLogo from '../assets/gfj.png';
import LogOutIcon from '../assets/LogOutIcon';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userDetails);
  const isMobile = useSelector((state) => state.user.isMobile);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('dashboard_current_page');
    sessionStorage.clear();
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    toast.info('User logged out.');
    navigate('/login');
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 ${isMobile ? 'h-16' : 'h-20'} flex justify-between items-center ${isMobile ? 'px-4' : 'px-6'} py-2 bg-gradient-primary text-white shadow-xl border-b border-white/10 backdrop-blur-lg`}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={gfjLogo} className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} rounded-full border-2 border-white/20 shadow-lg`} alt="Logo" />
        </div>
        {!isMobile && (
          <div>
            <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gradient-secondary`}>Gems From Jaipur</h1>
            <p className="text-xs text-white/70">Premium Jewelry Management</p>
          </div>
        )}
      </div>

      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className={`bg-white/10 backdrop-blur-sm text-white ${isMobile ? 'px-2 py-1' : 'px-6 py-3'} rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/20 flex items-center ${isMobile ? 'gap-1' : 'gap-3'}`}
          >
            <div className={`${isMobile ? 'w-5 h-5' : 'w-8 h-8'} bg-gradient-secondary rounded-full flex items-center justify-center`}>
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-gray-800`}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="text-left">
              <div className={`font-semibold ${isMobile ? 'text-xs' : ''}`}>{isMobile ? user.name : `Hello, ${user.name}`}</div>
              {!isMobile && <div className="text-xs text-white/70">{user.role || 'User'}</div>}
            </div>
            {!isMobile && (
              <div className={`transform transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}>
                ▼
              </div>
            )}
          </button>

          {showDropdown && (
            <div className={`absolute right-0 mt-3 bg-glass text-gray-800 text-sm rounded-xl shadow-2xl z-10 border border-white/20 backdrop-blur-lg ${isMobile ? 'min-w-[180px]' : 'min-w-[200px]'} overflow-hidden`}>
              <div className={`${isMobile ? 'p-3' : 'p-4'} border-b border-white/10`}>
                <div className="font-semibold text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-600">{user.email || user.username}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-3 w-full flex items-center text-left bg-red-500 hover:bg-red-800 transition-colors duration-200 cursor-pointer text-white"
              >
                <LogOutIcon className="mr-3 w-4 h-4" />
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
