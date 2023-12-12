<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <main class="h-screen overflow-hidden w-full bg-cover bg-no-repeat bg-center justify-center px-4 pt-10" style="background-image: url('/src/assets/welcome_page/background.png')">
    <!-- Botón de regresar -->
    <header class="absolute top-4 left-0 z-10">
      <router-link to="/joingame" class="flex items-center pr-3.5 pl-4 bg-cyan-400 text-black font-extrabold py-2 rounded-r-full rounded-l-none uppercase sm:w-auto">
        <img src="/src/assets/game_filter/return_icon.png" class="w-6 h-6 mr-2 font-extrabold" alt=""/>
        <span class="hidden sm:inline">RETURN</span>
      </router-link>
    </header>

    <!-- Contenedor con información para filtrar -->
    <section class="rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 mx-auto mt-10 sm:mt-20 md:mt-24
            w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-4xl"
             style="background-image: url('/src/assets/welcome_page/neon.png'); background-size: cover; background-position: center;">
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">FILTER GAMES</h2>

      <form class="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <section class="w-full">
          <label for="startDate" class="block text-lg font-semibold text-white mb-2">Start Date</label>
          <input id="startDate" type="date" class="border-2 border-gray-300 rounded-lg p-3 w-full text-lg">
        </section>
        <section class="w-full">
          <label for="endDate" class="block text-lg font-semibold text-white mb-2">End Date</label>
          <input id="endDate" type="date" class="border-2 border-gray-300 rounded-lg p-3 w-full text-lg">
        </section>
      </form>

      <aside class="mb-6">
        <label class="inline-flex items-center">
          <input type="checkbox" class="form-checkbox h-6 w-6 text-blue-600 rounded">
          <span class="ml-3 text-2xl font-bold text-white">AVAILABLE</span>
        </label>
      </aside>

      <aside class="mb-6">
        <label class="inline-flex items-center">
          <input type="checkbox" class="form-checkbox h-6 w-6 text-blue-600 rounded">
          <span class="ml-3 text-2xl font-bold text-white">FINISHED GAMES</span>
        </label>
      </aside>

      <footer class="text-right">
        <RouterLink to="/joingame" class="bg-purple-600 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg text-lg">APPLY AND SEARCH</RouterLink>
      </footer>
    </section>
  </main>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
}
</style>
