const setPreviousInput = e => {
    e.preventDefault();
}

const getValidNumber = (str, min, max) => {
    if (str.length === 0 || str === "-" || (isNaN(str) && isNaN(str.subtring(1) && str.length > 1)) || (isNaN(str[0]) && str[0] !== "-")) {
        return null;
    }

    const number = str[0] === "-" ? - parseInt(str.substring(1)) : parseInt(str);
    if (number <= max && number >= min) {
        return number;
    }
    return null;
}


const makeInteger = value => {
    for (let i = 0; i < value.length; ++i) {
        if (!((value[i] >= '0' && value[i] <= '9') || value[i] === '-') || (value[i] === '-' && i !== 0) || (value[i] === '0' && value.length !== 1 && (i === 0 || (i === 1 && value[0] === '-')))) {
            return value.substring(0, i) + value.substring(i + 1);
        }
    }

    return value;
}

const makeNaturalNumber = value => {
    for (let i = 0; i < value.length; ++i) {
        if (!(value[i] >= '0' && value[i] <= '9') || (value[i] === '0' && i === 0)) {
            return value.substring(0, i) + value.substring(i + 1);
        }
    }

    return value;
}

const makeWholeNumber = value => {
    for (let i = 0; i < value.length; ++i) {
        if (!(value[i] >= '0' && value[i] <= '9') || (value[i] === '0' && value.length !== 1 && i === 0)) {
            return value.substring(0, i) + value.substring(i + 1);
        }
    }

    return value;
}

export { setPreviousInput, getValidNumber, makeInteger, makeWholeNumber, makeNaturalNumber };