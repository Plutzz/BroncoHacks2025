import React from "react";
import styles from "../assets/Home.module.css";
import Navbar from "../components/Navbar";

const Home = ({ apiUrl }) => {
  return (
    <main>
      <h1 className={styles.h1}>Test App</h1>
      <div className={styles.container}>
        <div className={styles.classNav}>

        </div>
        
      </div>
      <Navbar />
    </main>
  );
};


export default Home;