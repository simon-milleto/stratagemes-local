enum CellColor {
    Empty = 'empty',
    Green = 'green',
    Blue = 'blue',
    Red = 'red'
}

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

class Stone {
    constructor(
        private color: CellColor
    ) {}

    getColor(): CellColor {
        return this.color;
    }
}

class Cell {
    constructor(
        private color: CellColor,
        private row: number,
        private col: number
    ) {}

    getColor(): CellColor {
        return this.color;
    }

    setColor(color: CellColor): void {
        this.color = color;
    }

    getRow(): number {
        return this.row;
    }

    getCol(): number {
        return this.col;
    }

    clone(): Cell {
        return new Cell(this.color, this.row, this.col);
    }
}

class Board {
    private cells: Cell[][];
    private size: number;
    public turn: number;

    constructor(size: number = 5) {
        this.size = size;
        this.cells = [];
        this.turn = 0;

        for (let i = 0; i < size; i++) {
            this.cells[i
            ] = [];
            for (let j = 0; j < size; j++) {
                this.cells[i][j] = new Cell(CellColor.Empty, i, j);
            }
        }
    }

    getCenter(): Cell | null {
        return this.cells[Math.floor(this.size / 2)][Math.floor(this.size / 2)];
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

    checkWinCondition() {
        // If 4 cells of the same color are next to each other, the player wins
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

class Player {
    constructor(
        private name: string,
        private board: Board
    ) {}

    stoneWons: Stone[] = [];

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
        this.board.turn++;

        const capturedStones = this.board.captureCells(row, col, color);
        this.stoneWons.push(...capturedStones);

        this.checkWinCondition();
    }

    checkWinCondition(): void {
        if (this.board.checkWinCondition()) {
            console.log('Winner!');
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


// Example usage:

async function play() {
    const game = new Board();
    
    const player1 = new Player('Player 1', game);
    const player2 = new Player('Player 2', game);

    // Play
    player1.makeMove(2, 2, CellColor.Red);
    game.printBoard();
    
    // Play
    player2.makeMove(1, 2, CellColor.Red);
    game.printBoard();
    
    // Play
    player1.makeMove(1, 1, CellColor.Green);
    game.printBoard();

    // Play
    player1.makeMove(3, 1, CellColor.Green);
    game.printBoard();

    // Play
    player1.makeMove(1, 3, CellColor.Green);
    game.printBoard();

    player1.printCurrentStones();
    player2.printCurrentStones();
}

play();
