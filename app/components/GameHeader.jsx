import logo from '../assets/images/logo.svg'
import styles from './page.module.css'
import Link from 'next/link'

export default function GameHeader() {
    return(
        <header className={styles['black-header']}>
            <Link href="/"><img src={logo.src} alt="Marketing Darts" /></Link>
        </header>
    )
}