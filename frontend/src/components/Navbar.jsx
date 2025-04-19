
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Home, User, PlusCircle, Search } from "lucide-react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be replaced with actual auth state
  const [searchQuery, setSearchQuery] = useState("");

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
            <img 
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/8239a535-dabc-4715-863a-7b57a29506b6/0f72d798a0a0bdd24b1c93a379adcb89.png"
              alt="Dev Drop Logo"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-blue-500">Dev Drop</span>
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
