
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Home, User, PlusCircle, Search } from "lucide-react";
import axiosInstance from "../AxiosConfig.js";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === "/";



  useEffect(() => {
    axiosInstance.get('api/accounts/check_authentication/')
      .then(res => {
        if (res.data.authenticated) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(err => {
        console.error('Auth check error:', err);
      });
  }, [location]);

  if (isLandingPage) {
    return null;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const q = encodeURIComponent(searchQuery.trim());
    // if empty or failed later, Home.jsx will redirect to /home
    navigate(`/home${q ? `?search=${q}` : ""}`);
  };

  return (
    <>
    <motion.nav
      className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to={isLoggedIn ? "/home" : "/"} className="flex items-center gap-2 shrink-0 text-2xl font-bold text-white hover:text-blue-400 transition-colors">
          <img
            src="/images/landing_logo.png"
            alt="DevDrop logo"
            className="h-4 w-4 inline-block ml-2"
          />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">DevDrop</span>
          </Link>


          <div className="flex items-center gap-4">
            <Link to="/home">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            {isLoggedIn ? (
              <> 
                <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search projects..."
                      className="w-full pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
      {isLoggedIn && (
        <Link
          to="/create-post"
          className="fixed bottom-6 right-6 z-50"
        >
          <Button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg">
            <PlusCircle className="h-6 w-6" />
          </Button>
        </Link>
      )}
    </>
  );
}

export default Navbar;
