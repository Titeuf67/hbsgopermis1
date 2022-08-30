
exports.inc = (num) => num + 1

exports.upper = (str) => str.toUpperCase()

exports.checkBooleanOutputColor = (bool) => {
    if (bool === 1) return 'success'
    else return 'danger'

}