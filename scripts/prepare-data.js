const fs = require('fs')
const path = require('path')
const data = require('/var/folders/0x/6yzq5jyj503b46bf74t280580000gn/T/opencode/hsk-complete.json')
const words = require('../data/hsk_words.js')
const ourWords = new Set(words.map((w) => w.simplified.replace(/\s+/g, '')))

const POS_LABELS = {
  n: ['名词', 'Нэр үг'],
  v: ['动词', 'Үйл үг'],
  vn: ['动词/名词', 'Үйл нэр'],
  a: ['形容词', 'Тэмдэг нэр'],
  ad: ['形容词/副词', 'Тэмдэг нэр'],
  an: ['形容词/名词', 'Тэмдэг нэр'],
  d: ['副词', 'Дайвар үг'],
  m: ['数词', 'Тооны нэр'],
  q: ['量词', 'Тоолуур үг'],
  qv: ['动量词', 'Тоолуур үг'],
  r: ['代词', 'Төлөөний нэр'],
  p: ['介词', 'Угтвар үг'],
  c: ['连词', 'Холбоос үг'],
  cc: ['连词', 'Холбоос үг'],
  u: ['助词', 'Туслах үг'],
  y: ['语气词', 'Аялга үг'],
  e: ['叹词', 'Аялга үг'],
  o: ['拟声词', 'Дуураймал үг'],
  t: ['时间词', 'Цаг үг'],
  s: ['处所词', 'Газар үг'],
  f: ['方位词', 'Чиглэл үг'],
  b: ['区别词', 'Ялгах үг'],
  z: ['状态词', 'Байдлын үг'],
  g: ['语素', 'Хэл зүйн нэгж'],
  h: ['前接成分', 'Бусад'],
  k: ['后接成分', 'Бусад'],
  i: ['成语', 'Хэллэг'],
  l: ['习惯用语', 'Хэллэг'],
  j: ['简称', 'Товчлол'],
  nz: ['专有名词', 'Онцлог нэр'],
  nr: ['人名', 'Хүний нэр'],
  ns: ['地名', 'Газар нэр'],
  nt: ['机构名', 'Байгууллагын нэр'],
  mx: ['数量词', 'Тооны нэр'],
  tg: ['时语素', 'Бусад'],
  ng: ['名语素', 'Бусад'],
  vg: ['动语素', 'Бусад'],
  ag: ['形语素', 'Бусад'],
  dg: ['副词素', 'Бусад'],
  rg: ['代语素', 'Бусад'],
  Mg: ['数语素', 'Бусад'],
  qg: ['量语素', 'Бусад'],
  Rg: ['区语素', 'Бусад'],
}

const OLD_LEVELS = new Set(['old-1', 'old-2', 'old-3', 'old-4', 'old-5'])

const PRIORITY = {
  v: 10, n: 9, a: 8, d: 7, t: 6, r: 5, m: 4, q: 4, u: 4, y: 4, p: 3, c: 3, f: 3, s: 3,
  e: 3, o: 3, vn: 8, an: 7, ad: 6, b: 6, z: 5, i: 4, l: 4, j: 4, nz: 4, nr: 4, ns: 4, nt: 4, g: 2,
}

const clean = (s) => (s || '').replace(/\s+/g, '')
const cap = (s) => (s || '').trim().replace(/\s+/g, ' ')

const posByWord = new Map()
const allWords = new Set()

for (const entry of data) {
  const s = clean(entry.simplified)
  if (!s) continue
  allWords.add(s)
  const isOld = entry.level.some((l) => OLD_LEVELS.has(l))
  const tags = entry.pos || []
  if (!tags.length) continue
  let best = null
  for (const t of tags) {
    const p = PRIORITY[t] ?? 0
    if (!best || p > best.p) best = { t, p }
  }
  const labels = POS_LABELS[best.t] || ['其他', 'Бусад']
  const prev = posByWord.get(s)
  if (!prev || (isOld && !prev.isOld)) {
    posByWord.set(s, { pos: labels[0], pos_mn: labels[1], isOld })
  }
}

const outPos = {}
for (const [s, v] of posByWord) {
  if (ourWords.has(s)) outPos[s] = [v.pos, v.pos_mn]
}

const outWords = []
for (const entry of data) {
  const s = clean(entry.simplified)
  if (!s) continue
  outWords.push([s, entry.frequency])
}
outWords.sort((a, b) => a[1] - b[1])

fs.writeFileSync(path.join(__dirname, '..', 'data', 'pos-data.js'),
  `module.exports = {\n  '爱': ['动词', 'Үйл үг'],\n` +
  Object.keys(outPos).map((s) => `  ${JSON.stringify(s)}: ${JSON.stringify(outPos[s])},`).join('\n') +
  '\n}\n')

fs.writeFileSync(path.join(__dirname, '..', 'data', 'zh-wordbank.js'),
  'module.exports = ' + JSON.stringify(outWords) + '\n')
console.log('wordbank entries:', outWords.length)
console.log('sample:', JSON.stringify(outPos['爱']), JSON.stringify(outPos['吃']), JSON.stringify(outPos['东西']))
