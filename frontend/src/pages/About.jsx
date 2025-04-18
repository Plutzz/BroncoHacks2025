import React from "react";
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>About This App</h1>
      <p>
        This is a simple full-stack project built with React, Vite, and Django.
        It demonstrates:
      </p>
      <ul>
        <li>Vite + React for fast front-end development.</li>
        <li>Django REST Framework for the API backend.</li>
        <li>Integration of a React build into Django's static files.</li>
      </ul>
      <p>
        Use the navigation above to explore the Home page or come back here
        anytime to learn more.
      </p>
      <Navbar />
    </main>
  );
}