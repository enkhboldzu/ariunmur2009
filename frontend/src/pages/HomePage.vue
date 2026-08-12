<script setup>
const levels = [
  { level: 1, desc: 'HSK 1 — Basic conversations' },
  { level: 2, desc: 'HSK 2 — Everyday conversations' },
  { level: 3, desc: 'HSK 3 — Daily life & travel' },
  { level: 4, desc: 'HSK 4 — Work, study & news' },
  { level: 5, desc: 'HSK 5 — Advanced topics' },
]
</script>

<template>
  <div
    class="relative flex min-h-screen items-center justify-center bg-cover bg-center p-6"
    style="background-image: url('https://images.pexels.com/photos/36480901/pexels-photo-36480901.jpeg?auto=compress&cs=tinysrgb&w=1920')"
  >
    <div class="absolute inset-0 bg-black/50" />
    <div class="relative flex w-full max-w-2xl flex-col gap-10 rounded-3xl bg-white/95 p-12 shadow-2xl">
      <div class="flex flex-col divide-y divide-gray-100">
        <div
          v-for="item in levels"
          :key="item.level"
          class="flex flex-col items-center justify-between gap-3 py-3 sm:flex-row sm:gap-4"
        >
          <RouterLink
            :to="`/vocab?level=${item.level}`"
            class="w-full rounded-xl bg-blue-600 px-8 py-3 text-center font-semibold text-white shadow hover:bg-blue-700 sm:w-auto"
          >HSK {{ item.level }}</RouterLink>
          <span class="text-sm text-gray-500">{{ item.desc }}</span>
        </div>
      </div>
      <RouterLink
        to="/vocab"
        class="text-center text-sm font-medium text-gray-400 hover:text-blue-600"
      >Бүх үгсийн санг нээх →</RouterLink>
    </div>
  </div>
</template>
