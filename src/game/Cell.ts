export enum CellColor {
    Empty = 'empty',
    Green = 'green',
    Blue = 'blue',
    Red = 'red',
    Yellow = 'yellow',
    White = 'white',
    Black = 'black'
}

export class Cell {
    constructor(
        private color: CellColor,
        private row: number,
        private col: number
    ) { }

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