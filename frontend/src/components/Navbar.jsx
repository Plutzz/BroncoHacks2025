
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Icon } from "./ui/icon";
import { Home, User, PlusCircle, Search } from "lucide-react";
import axiosInstance from "../AxiosConfig.js";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [searchQuery, setSearchQuery] = useState("");

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
  }, []);


  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Icon className="h-8 w-8 text-blue-500" icon="logo" />
            <span className="text-xl font-bold text-blue-500">DevDrop</span>
          </Link>

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

          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/create-post">
                  <Button variant="ghost" size="icon">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </Link>
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
    </nav>
  );
}

export default Navbar;
