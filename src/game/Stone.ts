import { CellColor } from "./Cell";

export class Stone {
    constructor(
        private color: CellColor
    ) { }

    getColor(): CellColor {
        return this.color;
    }

    setRandomColor(colors: CellColor[] = [CellColor.Red, CellColor.Blue, CellColor.Green]): void {
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    toString(): string {
        return this.color.charAt(0).toUpperCase() + this.color.slice(1);
    }

    static fromRandomColor(colors: CellColor[] = [CellColor.Red, CellColor.Blue, CellColor.Green]): Stone {
        return new Stone(colors[Math.floor(Math.random() * colors.length)]);
    }
}