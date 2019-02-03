module.exports.getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}
