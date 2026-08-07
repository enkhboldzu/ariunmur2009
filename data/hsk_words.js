const hsk1 = require('./hsk_level1.js')
const hsk2 = require('./hsk_level2.js')
const hsk3a = require('./hsk_level3a.js')
const hsk3b = require('./hsk_level3b.js')

module.exports = [...hsk1, ...hsk2, ...hsk3a, ...hsk3b]
