import styles from "../assets/Navbar.module.css";
import { Link } from "react-router-dom";
import Home from "../assets/svg/Home";
import Question from "../assets/svg/Question";

const Navbar = (props) => {
  return (
    <nav className={styles.nav}>
      <Link to={"/"}>
        <Home />
      </Link>
      <Link to={"/about"}>
        <Question />
      </Link>
      <Link to={`/user/${localStorage.getItem("userID")}`}>
        <div className={styles.profile}></div>
      </Link>
    </nav>
  );
};


export default Navbar;