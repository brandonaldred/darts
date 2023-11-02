import logo from '../assets/images/logo.svg'
import styles from './page.module.css'

export default function GameHeader() {
    return(
        <header className={styles['black-header']}>
            <img src={logo.src} alt="Marketing Darts" />
        </header>
    )
}