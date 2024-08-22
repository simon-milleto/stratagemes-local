import { Cell, CellColor } from './Cell';
import { Player } from './Player';
import { Stone } from './Stone';

const DIRECTIONS = {
    TOP_LEFT: [-1, -1],
    TOP: [-1, 0],
    TOP_RIGHT: [-1, 1],
    LEFT: [0, -1],
    RIGHT: [0, 1],
    BOTTOM_LEFT: [1, -1],
    BOTTOM: [1, 0],
    BOTTOM_RIGHT: [1, 1]
}

export class Board {
    private cells: Cell[][];
    public size: number;
    public turn: number;
    public availableColors: CellColor[];
    public availablePlayerColors: CellColor[];
    public players: Player[];

    constructor(players: Player[]) {
        this.availableColors = [CellColor.Red, CellColor.Blue, CellColor.Green];
        this.players = players;

        switch (players.length) {
            case 2:
            case 3:
                this.size = 5;
                break;
            case 4:
                this.availableColors.push(CellColor.Yellow);
                this.size = 6;
                break;
            case 5:
                this.availableColors.push(CellColor.Yellow, CellColor.Black);
                this.size = 6;
                break;
            case 6:
                this.availableColors.push(CellColor.Yellow, CellColor.Black, CellColor.White);
                this.size = 7;
                break;
            default:
                throw new Error('Invalid number of players');
        }

        this.availablePlayerColors = [...this.availableColors];
        this.cells = [];
        this.turn = 0;

        for (let i = 0; i < this.size; i++) {
            this.cells[i
            ] = [];
            for (let j = 0; j < this.size; j++) {
                this.cells[i][j] = new Cell(CellColor.Empty, i, j);
            }
        }

        for (const player of players) {
            player.board = this;
            const indexColor = Math.floor(Math.random() * this.availablePlayerColors.length);
            player.hiddenWinningColor = this.availablePlayerColors[indexColor];
            this.availablePlayerColors.splice(indexColor, 1);
        }
    }

    getCenter(): Cell | null {
        return this.cells[Math.floor(this.size / 2)][Math.floor(this.size / 2)];
    }

    cellIsEnabled(row: number, col: number): boolean {
        const cell = this.getCell(row, col);
        if (!cell) return false;

        const surroundingColors = this.getSurroundingColors(row, col);

        const hasSurrondingColors = surroundingColors.some(color => color !== CellColor.Empty)

        return (
            (this.turn !== 0 || cell === this.getCenter()) &&
            (this.turn === 0 || hasSurrondingColors) &&
            cell.getColor() === CellColor.Empty
        )
    }

    getCells(): Cell[][] {
        return this.cells;
    }

    getCell(row: number, col: number): Cell | null {
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            return this.cells[row][col];
        }

        return null;
    }


    getSurroundingColors(row: number, col: number): CellColor[] {
        return Object.keys(DIRECTIONS).map(key => {
            const [dx, dy] = DIRECTIONS[key as keyof typeof DIRECTIONS];
            return this.getCell(row + dx, col + dy)?.getColor();
        }).filter(color => color !== undefined) as CellColor[];
    }

    captureCells(row: number, col: number, playerColor: CellColor): Stone[] {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        const capturedStone: Stone[] = [];
        for (const [dx, dy] of directions) {
            capturedStone.push(...this.checkCapture(row, col, dx, dy, playerColor));
        }

        return capturedStone;
    }

    checkCapture(row: number, col: number, dx: number, dy: number, playerColor: CellColor): Stone[] {
        let x = row + dx;
        let y = col + dy;
        const capturedCells: [number, number][] = [];
        const stoneWons: Stone[] = [];

        while (true) {
            const cell = this.getCell(x, y);
            if (!cell) break;

            if (cell.getColor() === CellColor.Empty) break;
            if (capturedCells.length >= 2) break;
            if (cell.getColor() === playerColor) {
                // Capture all cells between
                for (const [cx, cy] of capturedCells) {
                    stoneWons.push(new Stone(this.getCell(cx, cy)!.getColor()));

                    this.getCell(cx, cy)!.setColor(CellColor.Empty);
                }
                break;
            }

            capturedCells.push([x, y]);
            x += dx;
            y += dy;
        }

        return stoneWons;
    }

    checkWinCondition(): boolean {
      const directions = [
        [0, 1],  // horizontal
        [1, 0],  // vertical
        [1, 1],  // diagonal down-right
        [1, -1]  // diagonal down-left
      ];

      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          const currentColor = this.cells[row][col].getColor();
          if (currentColor === CellColor.Empty) continue;

          for (const [dx, dy] of directions) {
            if (this.checkLine(row, col, dx, dy, currentColor)) {
              return true;
            }
          }
        }
      }

      return false;
    }

    private checkLine(row: number, col: number, dx: number, dy: number, color: CellColor): boolean {
      for (let i = 0; i < 4; i++) {
        const cell = this.getCell(row + i * dx, col + i * dy);
        if (!cell || cell.getColor() !== color) {
          return false;
        }
      }
      return true;
    }

    printBoard(): void {
        console.log('---------------');
        for (let i = 0; i < this.size; i++) {
            let row = '';
            for (let j = 0; j < this.size; j++) {
                row += this.cells[i][j].getColor().charAt(0).toUpperCase() + ' ';
            }
            console.log(row);
        }
        console.log('---------------');
    }
}
