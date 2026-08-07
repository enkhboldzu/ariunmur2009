-- Ariunmur HSK vocabulary schema

CREATE TABLE IF NOT EXISTS words (
  id          SERIAL PRIMARY KEY,
  hsk_level   INTEGER NOT NULL CHECK (hsk_level BETWEEN 1 AND 6),
  simplified  TEXT NOT NULL,
  pinyin      TEXT NOT NULL,
  meaning_mn  TEXT NOT NULL,
  meaning_en  TEXT,
  UNIQUE (simplified, pinyin)
);

CREATE INDEX IF NOT EXISTS idx_words_hsk_level ON words (hsk_level);

CREATE TABLE IF NOT EXISTS user_words (
  id            SERIAL PRIMARY KEY,
  word_id       INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'learning', 'mastered')),
  review_count  INTEGER NOT NULL DEFAULT 0,
  last_reviewed TIMESTAMPTZ,
  UNIQUE (word_id)
);
