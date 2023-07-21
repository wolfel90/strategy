export class WorldGrid {
    private _size: number;
    public get size() {
        return this._size;
    }
    private _color: string;
    public get color() {
        return this._color;
    }

    constructor(size: number, color: string) {
        this._size = size;
        this._color = color;
    }
}
