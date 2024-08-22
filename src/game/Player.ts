import { Board } from './Board';
import { CellColor } from './Cell';
import { Stone } from './Stone';

export class Player {
    private _board!: Board;
    stoneWons: Stone[] = [];
    handStones: Stone[] = [];
    hiddenWinningColor: CellColor | null = null;

    constructor(
        private name: string
    ) {
    }

    set board(board: Board) {
        this._board = board;

        this.handStones = Array.from({
            length: Math.max(3, this.board.players.length)
        }, () => Stone.fromRandomColor(this.board.availableColors));
    }

    get board() {
        return this._board;
    }

    hasRedStone(): boolean {
        return this.handStones.some(stone => stone.getColor() === CellColor.Red);
    }

    hasBlueStone(): boolean {
        return this.handStones.some(stone => stone.getColor() === CellColor.Blue);
    }

    hasGreenStone(): boolean {
        return this.handStones.some(stone => stone.getColor() === CellColor.Green);
    }

    hasYellowStone(): boolean {
        return this.handStones.some(stone => stone.getColor() === CellColor.Yellow);
    }

    hasBlackStone(): boolean {
        return this.handStones.some(stone => stone.getColor() === CellColor.Black);
    }

    hasWhiteStone(): boolean {
        return this.handStones.some(stone => stone.getColor() === CellColor.White);
    }

    getName(): string {
        return this.name;
    }

    makeMove(row: number, col: number, color: CellColor): void {
        const surroundingColors = this.board.getSurroundingColors(row, col);

        if (this.board.turn === 0) {
            if (row !== this.board.getCenter()!.getRow() || col !== this.board.getCenter()!.getCol()) {
                console.log('Invalid move, you must place your piece in the center on the first move');
                return;
            }
        } else if (!surroundingColors.some(color => color !== CellColor.Empty)) {
            console.log('Invalid move, no cell next to you');
            return
        }

        this.board.getCell(row, col)?.setColor(color);

        this.handStones
            .find(stone => stone.getColor() === color)!
            .setRandomColor(this.board.availableColors);

        this.board.turn++;

        console.log(this.board);

        const capturedStones = this.board.captureCells(row, col, color);
        this.stoneWons.push(...capturedStones);

        this.checkWinCondition();
    }

    checkWinCondition(): void {
        if (this.board.checkWinCondition()) {
          console.log(`${this.name} wins!`);
            return;
        }

        // If 5 stone of the same color are captured, the player wins
        const countStones: Record<string, number> = {};
        for (const stone of this.stoneWons) {
            countStones[stone.getColor()] = (countStones[stone.getColor()] || 0) + 1;
        }

        for (const color in countStones) {
            if (countStones[color] >= 5) {
                console.log(`${this.name} wins!`);
                return;
            }
        }


        console.log('Next player');
    }

    printCurrentStones(): void {
        console.log('Player ' + this.name + ' has ' + this.stoneWons.length + ' stones');
    }
}
