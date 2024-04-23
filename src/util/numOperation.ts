
class NumberOperation {
    constructor() { }
    randomSixDigitNumber(): number {
        const min = 100000
        const max = 999999
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

const numberOperation = new NumberOperation();
export default numberOperation;