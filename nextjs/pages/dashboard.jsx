import Navbar from "../pages/navbar.jsx";
import styles from "../styles/dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
    </div>
  );
}