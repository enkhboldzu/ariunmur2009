<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <header class="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <h1 class="text-xl font-semibold text-gray-900">Ariunmur</h1>
        <nav class="flex gap-1 text-sm">
          <RouterLink to="/" class="rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-100">Нүүр</RouterLink>
          <RouterLink
            to="/vocab"
            class="rounded-lg px-3 py-1.5 font-medium text-indigo-600 hover:bg-indigo-50"
          >Үгсийн сан</RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-2xl px-4 pt-4">
      <div class="flex gap-2">
        <div class="flex flex-1 items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2">
          <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Хайх: 汉字, pinyin, монгол..."
            class="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <button
          v-for="lvl in levels"
          :key="lvl"
          :class="[
            'rounded-full px-3 py-1 text-sm font-medium transition',
            selectedLevel === lvl
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50',
          ]"
          @click="selectedLevel = lvl"
        >{{ levelLabel(lvl) }}</button>
      </div>

      <p v-if="error" class="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
        Серверээс өгөгдөл ачаалах боломжгүй байна. Дараа дахин оролдоно уу.
      </p>

      <p v-if="stats.length" class="mt-2 text-xs text-gray-500">
        HSK 1: {{ stats[0]?.count ?? 0 }} · HSK 2: {{ stats[1]?.count ?? 0 }} · HSK 3: {{ stats[2]?.count ?? 0 }}
        · HSK 4: {{ stats[3]?.count ?? 0 }} · HSK 5: {{ stats[4]?.count ?? 0 }}
      </p>

      <div v-if="loading" class="mt-8 space-y-3">
        <div v-for="i in 8" :key="i" class="h-20 animate-pulse rounded-2xl bg-gray-200" />
      </div>

      <p v-else-if="words.length === 0" class="mt-10 text-center text-gray-500">
        Юу ч олдсонгүй
      </p>

      <div v-else class="mt-4 space-y-3">
        <div
          v-for="w in words"
          :key="w.id"
          class="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <span class="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
            HSK {{ w.hsk_level }}
          </span>
          <div class="flex-1">
            <div class="flex items-baseline gap-3">
              <button
                type="button"
                class="text-2xl font-semibold leading-none text-gray-900 transition hover:text-indigo-600"
                :aria-label="`Сонсох: ${w.simplified}`"
                @click="speak(w.simplified)"
              >{{ w.simplified }}</button>
              <button
                type="button"
                class="text-gray-400 transition hover:text-indigo-600"
                :aria-label="`Дуу: ${w.simplified}`"
                @click="speak(w.simplified)"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z" />
                </svg>
              </button>
              <span class="text-sm text-gray-500">{{ w.pinyin }}</span>
              <span class="ml-auto text-sm text-gray-400">#{{ w.rank }}</span>
            </div>
            <div class="mt-1 text-sm text-gray-800">{{ w.meaning_mn }}</div>
            <div v-if="w.meaning_en" class="text-xs text-gray-400">{{ w.meaning_en }}</div>
          </div>
        </div>
      </div>

      <p class="mt-6 text-center text-xs text-gray-400">Нийтийн {{ words.length }} үг харагдаж байна</p>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const search = ref('')
const selectedLevel = ref(0)
const words = ref([])
const stats = ref([])
const loading = ref(true)
const error = ref(false)

const levels = [0, 1, 2, 3, 4, 5]

function levelLabel(lvl) {
  if (lvl === 0) return 'Бүгд'
  return `HSK ${lvl}`
}

function speak(text) {
  if (!text) return
  const synth = window.speechSynthesis
  const zh = synth
    ? synth.getVoices().find((v) => v.lang.toLowerCase().replace('_', '-').startsWith('zh'))
    : null
  if (zh) {
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = zh.lang
    u.voice = zh
    u.rate = 0.85
    synth.speak(u)
    return
  }
  const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=zh-CN&q=${encodeURIComponent(text)}`)
  audio.play().catch(() => {})
}

let timer
async function loadWords() {
  loading.value = true
  clearTimeout(timer)
  timer = setTimeout(async () => {
    const params = new URLSearchParams()
    if (selectedLevel.value) params.set('level', selectedLevel.value)
    if (search.value.trim()) params.set('q', search.value.trim())
    try {
      const res = await fetch(`/api/words?${params}`)
      const data = await res.json()
      error.value = !res.ok
      words.value = Array.isArray(data.words) ? data.words : []
    } catch {
      error.value = true
      words.value = []
    } finally {
      loading.value = false
    }
  }, selectedLevel.value ? 0 : 250)
}

watch([search, selectedLevel], loadWords)

fetch('/api/words/stats')
  .then((r) => r.json())
  .then((d) => { stats.value = Array.isArray(d.stats) ? d.stats : [] })
  .catch(() => { stats.value = [] })

loadWords()
</script>
