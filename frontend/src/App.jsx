
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostDetail from "./pages/PostDetail";
import Landing from "./pages/Landing";

function App() {
  return (
    <Router>
      <div className="min-h-screen text-white"
      style={{
    backgroundImage: `
      repeating-linear-gradient(
        -45deg,
        rgba(255, 255, 255, 0.03) 0px,
        rgba(255, 255, 255, 0.03) 5px,
        rgba(0, 0, 0, 0.03) 5px,
        rgba(0, 0, 0, 0.03) 10px
      ),
      linear-gradient(to bottom,rgb(8, 11, 17), rgb(50, 67, 100)
    `,
    backgroundBlendMode: "overlay",
  }}> {/* //#1f2937 */}
        <Navbar />
        <main className="px-2 py-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
