import { useRouter } from "next/router";
import styles from "../styles/index.module.css";

export default function Navbar() {
  const router = useRouter();
  const path = router.pathname;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLogo}>
        <img src="/images/plasticsense.png" alt="Logo" />
      </div>

      <ul className={styles.navLinks}>
        <li>
          <a
            href="/"
            className={path === "/" ? styles.active : ""}
          >
            Home
          </a>
        </li>

        <li>
          <a
            href="/live"
            className={path === "/live" ? styles.active : ""}
          >
            Footage
          </a>
        </li>

        <li>
          <a
            href="/dashboard"
            className={path === "/dashboard" ? styles.active : ""}
          >
            Dashboard
          </a>
        </li>

        <li>
          <a
            href="/analytics"
            className={path === "/analytics" ? styles.active : ""}
          >
            Analytics
          </a>
        </li>

        <li>
          <a
            href="/reports"
            className={path === "/reports" ? styles.active : ""}
          >
            Reports
          </a>
        </li>
      </ul>
    </nav>
  );
}