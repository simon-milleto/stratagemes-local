import * as Popover from '@radix-ui/react-popover';
import { LuGem } from "react-icons/lu";
import { Board } from "./game/Board"
import { Button, Flex } from "@radix-ui/themes";
import { CellColor } from "./game/Cell";
import { Player } from './game/Player';

const BoardComponent = ({
    board,
    currentPlayer,
    onCellClick
}: {
    board: Board;
    currentPlayer: Player;
    onCellClick: (row: number, col: number, color: CellColor) => void;
}) => {

    return (
        <section className="board" style={{
            '--board-size': board.size
        } as React.CSSProperties}>
            {board.getCells().map((row, i) => (
                <div className="row" key={i}>
                    {row.map((cell, j) => (
                        <Popover.Root key={`popover-${i}-${j}`}><Popover.Trigger asChild key={`trigger-${i}-${j}`}>
                            <button
                                aria-label="cell"
                                disabled={!board.cellIsEnabled(i, j)}
                                className={`cell cell-${cell.getColor()}`}
                            >
                                {cell.getColor() !== CellColor.Empty && (
                                    <LuGem />
                                )}
                            </button>
                        </Popover.Trigger>
                            <Popover.Content sideOffset={5} key={`content-${i}-${j}`}>
                                Vos gèmes
                                <Flex gap="3" mt="3" justify="center" align="center">
                                    {currentPlayer.hasYellowStone() &&
                                        <Popover.Close asChild>
                                            <Button
                                                className="color-btn choose-yellow"
                                                onClick={() => onCellClick(i, j, CellColor.Yellow)}
                                                radius="full"
                                                size="1"></Button>
                                        </Popover.Close>
                                    }
                                    {currentPlayer.hasWhiteStone() &&
                                        <Popover.Close asChild>
                                            <Button
                                                className="color-btn choose-white"
                                                onClick={() => onCellClick(i, j, CellColor.White)}
                                                radius="full"
                                                size="1"></Button>
                                        </Popover.Close>
                                    }
                                    {currentPlayer.hasBlackStone() &&
                                        <Popover.Close asChild>
                                            <Button
                                                className="color-btn choose-black"
                                                onClick={() => onCellClick(i, j, CellColor.Black)}
                                                radius="full"
                                                size="1"></Button>
                                        </Popover.Close>
                                    }
                                    {currentPlayer.hasGreenStone() &&
                                        <Popover.Close asChild>
                                            <Button
                                                className="color-btn choose-green"
                                                onClick={() => onCellClick(i, j, CellColor.Green)}
                                                radius="full"
                                                size="1"></Button>
                                        </Popover.Close>
                                    }
                                    {currentPlayer.hasRedStone() &&
                                        <Popover.Close asChild>
                                            <Button
                                                className="color-btn choose-red"
                                                onClick={() => onCellClick(i, j, CellColor.Red)}
                                                radius="full"
                                                size="1"></Button>
                                        </Popover.Close>
                                    }
                                    {currentPlayer.hasBlueStone() &&
                                        <Popover.Close asChild>
                                            <Button
                                                className="color-btn choose-blue"
                                                onClick={() => onCellClick(i, j, CellColor.Blue)}
                                                radius="full"
                                                size="1"></Button>
                                        </Popover.Close>
                                    }

                                </Flex>
                            </Popover.Content>
                        </Popover.Root>
                    ))}
                </div>
            ))}
        </section>
    )
}

export default BoardComponent