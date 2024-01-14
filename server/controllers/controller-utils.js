const removeDecimalOrAddZeros = (amount) => {
    const priceString = amount.toString();
    if(priceString[priceString.length - 3] === '.' || priceString[priceString.length - 2] === '.') { //if it contains a decimal
        const removeDecPoint = priceString.split('.') //separate each side of the decimal point
        const priceWithoutDecimal = `${removeDecPoint[0]}${removeDecPoint[1]}` //combine into single string
        return parseInt(priceWithoutDecimal); //convert combined string to integer
    } else { //otherwise just return the number as is
        return parseInt(`${amount}00`); //but add on the two zeros so the math doesn't get screwed up later
    }
}

const addDecimal = (amount) => {
    return (amount / 100).toFixed(2);
}

const integerTest = (amount) => {
    if(Number.isInteger(amount / 100)) {
        return true;
    } else {
        return false;
    }
}

const calcUnitPrice = (price, quantity) => price / quantity;

module.exports = {removeDecimalOrAddZeros, integerTest, addDecimal, calcUnitPrice}