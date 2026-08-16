<script setup>
import { ref, computed } from 'vue'

const levels = [
  { level: 1, desc: 'HSK 1 — Basic conversations' },
  { level: 2, desc: 'HSK 2 — Everyday conversations' },
  { level: 3, desc: 'HSK 3 — Daily life & travel' },
  { level: 4, desc: 'HSK 4 — Work, study & news' },
  { level: 5, desc: 'HSK 5 — Advanced topics' },
]

const stats = ref([])
const countFor = (level) => {
  const s = stats.value.find((x) => x.hsk_level === level)
  return s ? s.count : 0
}
const total = computed(() => stats.value.reduce((acc, x) => acc + x.count, 0))

fetch('/api/words/stats')
  .then((r) => r.json())
  .then((d) => { stats.value = Array.isArray(d.stats) ? d.stats : [] })
  .catch(() => { stats.value = [] })
</script>

<template>
  <div
    class="relative min-h-screen bg-cover bg-center bg-[url('https://images.pexels.com/photos/36480901/pexels-photo-36480901.jpeg?auto=compress&cs=tinysrgb&w=1920')] p-6"
  >
    <div class="absolute inset-0 bg-white/40" />
    <div class="relative mx-auto max-w-2xl">
      <header class="flex items-center justify-between py-3">
        <RouterLink to="/" class="text-lg font-bold text-indigo-700 drop-shadow-sm">HSK Үгсийн сан</RouterLink>
        <nav class="flex gap-2 text-sm">
          <RouterLink
            to="/"
            class="rounded-full px-4 py-1.5 font-semibold text-white shadow-lg shadow-indigo-600/40 transition-all duration-200 bg-indigo-600"
          >Нүүр</RouterLink>
          <RouterLink
            to="/vocab"
            class="rounded-full bg-white/90 px-4 py-1.5 font-semibold text-indigo-600 transition-all duration-200 hover:bg-white"
          >Үгсийн сан</RouterLink>
        </nav>
      </header>

      <div class="flex flex-col gap-10 rounded-3xl border border-indigo-100 bg-white/90 p-12 shadow-2xl shadow-indigo-200/60 backdrop-blur-xl">
        <div class="flex flex-col divide-y divide-gray-100">
          <div
            v-for="item in levels"
            :key="item.level"
            class="-mx-3 flex flex-col items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-200 hover:bg-indigo-50/80 sm:flex-row sm:gap-4"
          >
            <RouterLink
              :to="`/vocab?level=${item.level}`"
              class="flex h-20 w-20 items-center justify-center rounded-xl bg-blue-400/80 text-lg font-semibold text-white shadow-lg shadow-blue-400/30 transition-all duration-200 hover:bg-blue-500"
            >HSK {{ item.level }}</RouterLink>
            <div class="flex flex-col items-center sm:items-start">
              <span class="text-sm text-gray-600">{{ item.desc }}</span>
              <span class="text-xs font-semibold text-indigo-600">{{ countFor(item.level) }} үг</span>
            </div>
          </div>
        </div>
        <div class="flex justify-center border-t border-gray-200 pt-8">
          <RouterLink
            to="/vocab"
            class="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition-all duration-200 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/40 active:scale-95"
          >Бүх үгсийн санг нээх ({{ total }} үг) →</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
