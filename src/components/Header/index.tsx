import styles from "../Header/header.module.scss";
import Image from 'next/image';
import Link from "next/link";

export default function Header() {
  // TODO
  return(
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a>
            <Image 
              src="/images/logo.svg"
              alt="logo"
              width={239}
              height={25}
            />
          </a>
        </Link>
      </div>
    </header>
  );
}
