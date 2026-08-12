<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const levels = [
  { level: 1, desc: 'HSK 1 — Basic conversations' },
  { level: 2, desc: 'HSK 2 — Everyday conversations' },
  { level: 3, desc: 'HSK 3 — Daily life & travel' },
  { level: 4, desc: 'HSK 4 — Work, study & news' },
  { level: 5, desc: 'HSK 5 — Advanced topics' },
]

const isActive = (level) => String(route.query.level) === String(level)
</script>

<template>
  <div
    class="relative flex min-h-screen items-center justify-center bg-cover bg-center p-6"
    style="background-image: url('https://images.pexels.com/photos/36480901/pexels-photo-36480901.jpeg?auto=compress&cs=tinysrgb&w=1920')"
  >
    <div class="absolute inset-0 bg-black/50" />
    <div class="relative flex w-full max-w-2xl flex-col gap-10 rounded-3xl border border-white/20 bg-white/90 p-12 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div class="flex flex-col divide-y divide-gray-100">
        <div
          v-for="item in levels"
          :key="item.level"
          class="-mx-3 flex flex-col items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-200 hover:bg-gray-100/80 sm:flex-row sm:gap-4"
        >
          <RouterLink
            :to="`/vocab?level=${item.level}`"
            :class="isActive(item.level)
              ? 'bg-blue-500 shadow-lg shadow-blue-500/40 ring-2 ring-blue-300'
              : 'bg-blue-400/80 hover:bg-blue-500'"
            class="flex h-20 w-20 items-center justify-center rounded-xl text-lg font-semibold text-white transition-all duration-200"
          >HSK {{ item.level }}</RouterLink>
          <span class="text-sm text-gray-500">{{ item.desc }}</span>
        </div>
      </div>
      <div class="flex justify-center border-t border-gray-200 pt-8">
        <RouterLink
          to="/vocab"
          class="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition-all duration-200 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/40 active:scale-95"
        >Бүх үгсийн санг нээх →</RouterLink>
      </div>
    </div>
  </div>
</template>
