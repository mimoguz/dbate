
export class IndexedColor {
    constructor(index: number, value: number) {
        this.index = index
        this.value = value
    }

    readonly index: number
    readonly value: number

    get hex(): string {
        return ("#" + (this.value & 0xff_ff_ff_ff).toString(16).padStart(8, "0"))
    }

    update(value: number) {
        return new IndexedColor(this.index, value)
    }
}