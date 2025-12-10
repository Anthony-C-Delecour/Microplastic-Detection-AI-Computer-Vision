import Navbar from "../pages/navbar.jsx";
import styles from "../styles/index.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.fullWidth}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.overlay}></div>

        <div className={styles.heroContent}>
          <h1>
            Advanced Microplastic <br />
            <span className={styles.highlight}>
              Intelligent Monitoring System
            </span>
          </h1>

          <p>
            Empower ocean protection with high-precision monitoring technology.
            Detect and analyze microplastic pollution in real time, supported by 
            comprehensive data insights and actionable intelligence.
          </p>

          <Link href="/live" className={styles.getStartedBtn}>
            Get Started <span className={styles.arrow}>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}