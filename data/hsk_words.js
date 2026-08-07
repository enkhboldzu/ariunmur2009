const hsk1 = require('./hsk_level1.js')
const hsk2 = require('./hsk_level2.js')
const hsk3a = require('./hsk_level3a.js')
const hsk3b = require('./hsk_level3b.js')
const hsk4 = require('./hsk_level4.js')
const hsk5a = require('./hsk_level5a.js')
const hsk5b = require('./hsk_level5b.js')

module.exports = [...hsk1, ...hsk2, ...hsk3a, ...hsk3b, ...hsk4, ...hsk5a, ...hsk5b]
