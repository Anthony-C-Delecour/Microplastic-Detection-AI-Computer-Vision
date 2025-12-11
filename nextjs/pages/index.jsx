import Navbar from "../pages/navbar.jsx";
import styles from "../styles/index.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Navbar />
      <div style={{ backgroundColor: "#f5f5f5" }}>
        <section className={styles.hero}>
          <div className={styles.overlay}></div>

          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Advanced Microplastic <br />
              <span className={styles.highlight}>
                Intelligent Monitoring System
              </span>
            </h1>
            <p>
              Empower ocean protection with high-precision monitoring technology.
              <br />
              Detect and analyze microplastic pollution in real time, supported by
              comprehensive data insights and actionable intelligence.
            </p>
          </div>
        </section>

        <p className={styles.readyText}>
          Ready to Monitor{" "}
          <span className={styles.highlightHover}>Microplastic Concentration?</span>
        </p>

        <div className={styles.bottomButtonWrapper}>
          <Link href="/dashboard" legacyBehavior>
            <a className={styles.getStartedBtn}>
              Get Started <span className={styles.arrow}>→</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}