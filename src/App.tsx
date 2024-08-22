import * as Popover from '@radix-ui/react-popover';
import { useMemo, useState } from 'react';
import { LuGem } from 'react-icons/lu';
import './App.css';
import BoardComponent from './BoardComponent';
import { Board } from './game/Board';
import { CellColor } from './game/Cell';
import { Player } from './game/Player';

const COUNT_PLAYERS = 6;

function App() {

  const players = useMemo(() => {
    const players: Player[] = [];
    for (let i = 0; i < COUNT_PLAYERS; i++) {
      players.push(new Player(`Player ${i + 1}`));
    }
    return players;
  }, []);

  const game = useMemo(() => new Board(players), [players]);

  const [nextPlayer, setNextPlayer] = useState(0);

  const handleCellClick = (row: number, col: number, color: CellColor) => {
    players[nextPlayer].makeMove(row, col, color);

    setNextPlayer((previousPlayerIndex) => previousPlayerIndex + 1 === COUNT_PLAYERS ? 0 : previousPlayerIndex + 1);
  }

  return (
    <>
      <h1>
        Stratagèmes - tour {game.turn}
      </h1>
      <div>
        <p>Au tour du joueur {players[nextPlayer].getName()}</p>
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
        <Popover.Root>
          <Popover.Trigger>
            Debug joueurs
          </Popover.Trigger>
          <Popover.Content>
            {players.map((player, i) => (
              <div key={i}>
                {player.getName()}
                <ul>
                  <li>Gèmes: {player.handStones.join(', ')}</li>
                  <li>Rouge: {player.hasRedStone() ? 'oui' : 'non'}</li>
                  <li>Bleu: {player.hasBlueStone() ? 'oui' : 'non'}</li>
                  <li>Verte: {player.hasGreenStone() ? 'oui' : 'non'}</li>
                </ul>
              </div>
            ))}
          </Popover.Content>
        </Popover.Root>
      </div>
    </>
  )
}

export default App
