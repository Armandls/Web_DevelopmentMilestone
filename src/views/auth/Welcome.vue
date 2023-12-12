<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="flex flex-col h-screen w-screen bg-cover bg-no-repeat bg-center items-center justify-start pt-5 pb-1/4 px-1/4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <img src="/src/assets/welcome_page/logo_480x313.png" alt="" class="max-w-[480px] max-h-[313px] object-contain w-full mx-auto">
    <div style="width: 100%; text-align: center">
      <span style="color: white; font-size: 32px; font-family: Poppins,serif; font-weight: 600; line-height: 42px; word-wrap: break-word">Step into the </span>
      <span style="color: #FFF500; font-size: 32px; font-family: Poppins,serif; font-weight: 600; line-height: 42px; word-wrap: break-word">Future</span>
      <span style="color: white; font-size: 32px; font-family: Poppins,serif; font-weight: 600; line-height: 42px; word-wrap: break-word">, <br/></span>
    </div>
    <div style="text-align: center; color: white; font-size: 32px; font-family: Poppins,ui-rounded; font-weight: 600; line-height: 42px; word-wrap: break-word">
      Battle for the Now.
    </div>
    <!-- Creación del botón de Create Account -->
    <RouterLink class="mt-6 cursor-pointer" to="/signup" style="background-color: #F707FC; padding: 12px 20px; border-radius: 17px; border: 2px #FFF500 solid; justify-content: center; align-items: center; display: inline-flex">
      <div style="text-align: center; color: #FFF500; font-size: 24px; font-family: Poppins,'Script MT Bold',ui-rounded; font-weight: 700; line-height: 30px; word-wrap: break-word">Create free account</div>
    </RouterLink>

    <!-- Creación del botón de Sign In -->
    <RouterLink class="mt-6 cursor-pointer" to="/signin">
      <div class="flex">
        <div style="text-align: center; color: #FFFFFF; font-size: 16px; font-family: Poppins,'Script MT Bold',ui-rounded; font-weight: 700; line-height: 30px; word-wrap: break-word">...or</div>
        <div class="ml-1" style="text-decoration: underline; color: #FFFFFF; font-size: 16px; font-family: Poppins,'Script MT Bold',ui-rounded; font-weight: 700; line-height: 30px; word-wrap: break-word">sign in</div>
        <div class="ml-1" style="color: #FFFFFF; font-size: 16px; font-family: Poppins,'Script MT Bold',ui-rounded; font-weight: 700; line-height: 30px; word-wrap: break-word">with existing account</div>
      </div>
    </RouterLink>

  </div>
</template>

<style scoped>
</style>