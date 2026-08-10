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
        <button
          type="button"
          :class="[
            'rounded-full px-3 py-1 text-sm font-medium transition',
            favoriteOnly
              ? 'bg-amber-400 text-white'
              : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50',
          ]"
          @click="favoriteOnly = !favoriteOnly"
        >
          <svg
            class="mr-1 inline-block h-3.5 w-3.5"
            :fill="favoriteOnly ? 'currentColor' : 'none'"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.101c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Онцлог
        </button>
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

      <p v-else-if="visibleWords.length === 0" class="mt-10 text-center text-gray-500">
        {{ favoriteOnly ? 'Онцолсон үг алга' : 'Юу ч олдсонгүй' }}
      </p>

      <div v-else class="mt-4 space-y-3">
        <div
          v-for="w in visibleWords"
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
              <button
                type="button"
                class="transition hover:text-amber-400"
                :class="isFavorite(w.id) ? 'text-amber-400' : 'text-gray-300'"
                :aria-label="`Онцлох: ${w.simplified}`"
                @click="toggleFavorite(w.id)"
              >
                <svg
                  class="h-5 w-5"
                  :fill="isFavorite(w.id) ? 'currentColor' : 'none'"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.101c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            </div>
            <div class="mt-1 text-sm text-gray-800">{{ w.meaning_mn }}</div>
            <div v-if="w.meaning_en" class="text-xs text-gray-400">{{ w.meaning_en }}</div>
          </div>
        </div>
      </div>

      <p class="mt-6 text-center text-xs text-gray-400">Нийтийн {{ visibleWords.length }} үг харагдаж байна</p>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const search = ref('')
const selectedLevel = ref(Number(route.query.level) || 0)
const words = ref([])
const stats = ref([])
const loading = ref(true)
const error = ref(false)
const favoriteOnly = ref(false)
const favorites = ref([])
try {
  favorites.value = JSON.parse(localStorage.getItem('starred-words') || '[]')
} catch {
  favorites.value = []
}

function isFavorite(id) {
  return favorites.value.includes(id)
}

function toggleFavorite(id) {
  if (isFavorite(id)) favorites.value = favorites.value.filter((x) => x !== id)
  else favorites.value.push(id)
}

watch(favorites, (v) => localStorage.setItem('starred-words', JSON.stringify(v)), { deep: true })

const visibleWords = computed(() => {
  if (!favoriteOnly.value) return words.value
  return words.value.filter((w) => favorites.value.includes(w.id))
})

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
