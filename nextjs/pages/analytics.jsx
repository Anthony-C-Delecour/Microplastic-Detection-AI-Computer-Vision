import Navbar from "../pages/navbar.jsx";
import styles from "../styles/analytics.module.css";
import Link from "next/link";

export default function Analytics() {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
    </div>
  );
}