function arraysEqual(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }

    const set1 = new Set(array1.map(JSON.stringify));
    const set2 = new Set(array2.map(JSON.stringify));

    for (let element of set1) {
        if (!set2.has(element)) {
            return false;
        }
    }

    return true;
}

module.exports = {
    arraysEqual,
};
