import DartBoard from "../components/dartboard/DartBoard";
import GameHeader from "../components/GameHeader"
import PlayerScore from "../components/PlayerScore/PlayerScore"

export default function Oh1() {
    return(
        <>
            <GameHeader />
            <div className={`content-container`}>
                <PlayerScore />
                <DartBoard />
            </div>
        </>
    )
}