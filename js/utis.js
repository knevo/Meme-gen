function getRandomId() {
    var chars = '1234567890pioutewqsfghjklmnbvcxzAXDCTVGBXIUNMOPTYFVRDQ'
    var id = ''
    for (let i = 0; i < 5; i++) {
        id += chars[getRandomNumber(chars.length)]
    }
    return id;
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}