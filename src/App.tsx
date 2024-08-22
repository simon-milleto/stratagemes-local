import { useMemo, useState } from 'react';
import { LuGem } from 'react-icons/lu';
import './App.css';
import BoardComponent from './BoardComponent';
import { Board } from './game/Board';
import { CellColor } from './game/Cell';
import { Player } from './game/Player';

const COUNT_PLAYERS = 3;

function App() {
  const [countPlayers, setCountPlayers] = useState(COUNT_PLAYERS);
  const [winnerPlayer, setWinnerPlayer] = useState<Player | null>(null);

  const players = useMemo(() => {
    const players: Player[] = [];
    for (let i = 0; i < countPlayers; i++) {
      players.push(new Player(`Player ${i + 1}`));
    }
    return players;
  }, [countPlayers]);

  const game = useMemo(() => new Board(players), [players]);

  const [nextPlayer, setNextPlayer] = useState(0);

  const handleCellClick = (row: number, col: number, color: CellColor) => {
    const isWinner = players[nextPlayer].makeMove(row, col, color);
    if (isWinner) {
      setWinnerPlayer(players[nextPlayer]);
    } else {
      setNextPlayer((previousPlayerIndex) => previousPlayerIndex + 1 === countPlayers ? 0 : previousPlayerIndex + 1);
    }
  }

  return (
    <>
      <h1>
        Stratagèmes - tour {game.turn}
      </h1>
      <div>
        <label>Nombre de joueurs</label>
        <div>
          <input type="range" min="2" max="6" value={countPlayers} onChange={(e) => setCountPlayers(parseInt(e.target.value))} />
          <span>{countPlayers}</span>
        </div>
      </div>
      <div>
          {winnerPlayer !== null ? (
            <p>Le joueur {winnerPlayer.getName()} a gagné !</p>
          ) : (
            <p>Au tour du joueur {players[nextPlayer].getName()}</p>
          )}
        <p>Gème secrète:
          <span className={`cell-${players[nextPlayer].hiddenWinningColor?.toLowerCase()}`}>
            <LuGem />
          </span>
        </p>
        <span>Gèmes en main</span>
        <div className='hand-stones'>
          {players[nextPlayer].handStones.map((stone, i) => (
            <span key={i} className={`cell-${stone.toString().toLowerCase()}`}>
              <LuGem />
            </span>
          ))}
        </div>
      </div>
      <BoardComponent
        currentPlayer={players[nextPlayer]}
        onCellClick={handleCellClick}
        board={game} />
      <div>
      </div>
    </>
  )
}
        // <Popover.Root>
        //   <Popover.Trigger>
        //     Debug joueurs
        //   </Popover.Trigger>
        //   <Popover.Content>
        //     {players.map((player, i) => (
        //       <div key={i}>
        //         {player.getName()}
        //         <ul>
        //           <li>Gèmes: {player.handStones.join(', ')}</li>
        //           <li>Rouge: {player.hasRedStone() ? 'oui' : 'non'}</li>
        //           <li>Bleu: {player.hasBlueStone() ? 'oui' : 'non'}</li>
        //           <li>Verte: {player.hasGreenStone() ? 'oui' : 'non'}</li>
        //         </ul>
        //       </div>
        //     ))}
        //   </Popover.Content>
        // </Popover.Root>

export default App
