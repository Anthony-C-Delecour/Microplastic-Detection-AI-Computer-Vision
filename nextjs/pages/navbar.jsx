import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/index.module.css";

export default function Navbar() {
  const router = useRouter();
  const path = router.pathname;

  const isActive = (href) => {
    if (href === "/") return path === "/";
    return path === href || path.startsWith(href + "/");
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/analytics", label: "Analytics" },
    { href: "/reports", label: "Reports" },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLogo}>
        <img src="/images/plasticsense.png" alt="Logo" />
      </div>

      <ul className={styles.navLinks}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} legacyBehavior>
              <a className={isActive(link.href) ? styles.active : ""}>
                {link.label}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}