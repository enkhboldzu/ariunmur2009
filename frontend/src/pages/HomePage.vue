<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-50 p-6">
    <div class="flex w-full max-w-xs flex-col items-center gap-3">
      <RouterLink
        v-for="lvl in [1, 2, 3, 4, 5]"
        :key="lvl"
        :to="`/vocab?level=${lvl}`"
        class="rounded-xl bg-indigo-600 px-8 py-4 font-medium text-white shadow hover:bg-indigo-700"
      >HSK {{ lvl }}</RouterLink>
    </div>
    <RouterLink
      to="/vocab"
      class="text-sm font-medium text-gray-400 hover:text-indigo-600"
    >Бүх үгсийн санг нээх →</RouterLink>
  </div>
</template>
