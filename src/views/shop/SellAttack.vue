<script setup>
  import { ref } from 'vue';
  import ReturnToShop from "../../ components/ReturnToShop.vue";

  const items = ref([
    { imageSrc: '/welcome_page/avatar.png/', username: 'Ola de Caos', Cost: 50 },
    { imageSrc: '/welcome_page/avatar.png/', username: 'Explosión Arcana', Cost: 70 },
    { imageSrc: '/welcome_page/avatar.png/', username: 'Golpe Relámpago', Cost: 20 },
    { imageSrc: '/welcome_page/avatar.png/', username: 'Vórtice Abrasador', Cost: 40 },
    { imageSrc: '/welcome_page/avatar.png/', username: 'Flecha del Crepúsculo', Cost: 100 },
    { imageSrc: '/welcome_page/avatar.png/', username: 'Maldición Mortal', Cost: 25 },
    { imageSrc: '/welcome_page/avatar.png/', username: 'Avalancha Glacial', Cost: 90 }
  ]);
</script>

<template>
  <div class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <button class="bg-cyan-400 text-black font-bold py-2 md:py-5 px-4 md:px-10 rounded-r-full rounded-l-md text-base md:text-2xl uppercase fixed top-5 left-0">
      SELL AN ATTACK
    </button>

    <!-- Imagen monedas -->
    <img src="/src/assets/shop/Monedas.png" alt=" " class="mi-imagen">

    <!--Imagen chico tamaño pequeño-->
    <div class="img-container">
      <img src="/src/assets/shop/image 16.png" alt=" " class="absolute top-50 left-0 m-4 w-50 h-50 object-cover">
    </div>


    <div class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-20 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pr-5 mr-4">
      <div v-for="(item, index) in items" :key="item.id" class="flex items-center justify-between w-full h-[88px] my-2 bg-yellow-100 rounded-[10px] border-4 border-black">
        <div class="flex items-center">
          <div class="text-black text-xl md:text-xl lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase mr-4 ml-2">{{ index + 1 }}</div>
          <img class="w-[58px] h-[58px]" :src="item.imageSrc" />
          <div class="text-black text-sm md:text-lg lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase ml-5">{{ item.username }} - Cost: {{ item.Cost }}$</div>
        </div>
        <div class="flex items-center mt">
          <input type="checkbox" class="h-6 w-6 mr-4">
          <label class="mr-4 text-black text-2xl font-bold">SELL</label>
        </div>
      </div>
    </div>

    <!-- Botón de Regreso a Shop -->
    <ReturnToShop/>
    </div>
</template>

<!-- IMAGEN MONEDAS -->

<style>
.mi-imagen {
  position: absolute;
  top: 0;
  right: 0;
  margin: 4px;}

@media screen and (max-width: 767px) {
  .mi-imagen {
    width: 20%;
    height: auto;
    margin-top: 10px;
  }
}

@media screen and (min-width: 768px) {
  .mi-imagen {
    width: 10%;
    height: auto;
  }
}
</style>

