import styles from './page.module.css'

export default function DartBoard() {

    const board = [];
    const buildBoard = () => {
        let n = 1;
        while (n != 21) {
            board.push(n);
            n = n + 1;
        }
    }
    buildBoard()

    
    return(
        <>
            <div className={styles['dart-board']}>
                <p className={`${styles['outer-bull']}`}>Outer Bull</p>
                <p>Bull</p>
                {board.map((n, i) => {
                    let style = n % 2 ? 'odd' : 'even';
                    return (<><p key={i} className={styles[style]}>{n}</p><p>D</p><p>T</p></>)
                })}
            </div>
        </>
    )
}