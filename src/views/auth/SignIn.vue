<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="flex flex-col min-h-screen w-screen items-center justify-center bg-cover bg-no-repeat bg-center" style="background-image: url('/src/assets/welcome_page/background.png')">
    <!-- Logo -->
    <div class="flex justify-center items-center w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 mb-1">
      <img src="/src/assets/welcome_page/logo_480x313.png" alt="" class="max-w-[380px] max-h-[213px]">
    </div>

    <!-- Contenedor Neon -->
    <div class="relative w-9/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 pb-2/3 sm:pb-1/2 md:pb-2/5 lg:pb-1/3 2xl:pb-1/4">
      <img src="/src/assets/welcome_page/neon_signup.png" alt="" class="relative left-0 right-0 bottom-4 object-cover">

      <div class="absolute top-0 left-0 right-0 bottom-4 flex flex-col items-center justify-center p-4 md:p-6 gap-4">
        <div class="text-white text-2xl font-semibold uppercase">Sign In</div>

        <!-- Contenidor pels camps -->
        <div class="flex flex-col w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bottom-4">
          <div class="flex flex-col w-full mb-2">
            <label class="text-white text-sm font-semibold">Username *</label>
            <input type="text" placeholder="Enter username" class="w-full h-10 px-4 bg-white rounded-md border border-neutral-200">
          </div>

          <div class="flex flex-col w-full mb-4">
            <label class="text-white text-sm font-semibold">Password *</label>
            <input :type="showPassword ? 'text' : 'password'" placeholder="Enter password" class="w-full h-10 px-4 bg-white rounded-md border border-neutral-200">
            <div class="flex justify-end items-center text-white text-sm mt-1 cursor-pointer" @click="togglePasswordVisibility">
              <div>{{ showPassword ? 'Hide' : 'Show' }} password</div>
            </div>
          </div>

          <!-- Sign In -->
          <div class="flex justify-center w-full">
            <RouterLink to="/home" class="flex justify-center items-center bg-fuchsia-500 text-yellow-400 font-semibold py-2 rounded-full text-center w-full">
              Sign In
            </RouterLink>
          </div>

          <!-- Sign Up -->
          <div class="flex justify-center text-center text-white mt-4">
            <span class="pr-1">Dont have an account?</span>
            <RouterLink to="/signup" class="font-bold">Sign Up</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::placeholder {
  color: #a1a1a1;
}
</style>