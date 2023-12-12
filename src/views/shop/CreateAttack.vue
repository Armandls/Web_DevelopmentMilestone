<script>

import {defineComponent} from "vue";
import {RouterLink} from "vue-router";
import Shop from "./Shop.vue";
import ReturnToShop from "../../ components/ReturnToShop.vue";

export default defineComponent({
  components: {ReturnToShop, Shop, RouterLink}
})
</script>

<template>
  <div class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">

    <button class="bg-cyan-400 text-black font-bold py-2 md:py-5 px-4 md:px-10 rounded-r-full rounded-l-md text-base md:text-2xl uppercase fixed top-5 left-0">
      CREATE AN ATTACK
    </button>

    <!-- Imagen monedas -->
    <img src="/src/assets/shop/Monedas.png" alt=" " class="mi-imagen">


    <!--Imagen chico tamaño pequeño-->
    <div class="img-container">
      <img src="/src/assets/shop/imagen_createattack.png" alt=" " class="absolute top-50 left-0 m-4 w-50 h-50 object-cover">
    </div>

    <!-- Imagen del cuadro -->
    <div class="flex items-center justify-center h-1/2 sm:h-1/3 md:h-1/3 lg:h-1/4 xl:h-1/5">
      <div class="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-full transition-transform duration-300 transform translate-y-0 sm:translate-y-1/4 md:translate-y-1/4 lg:translate-y-1/2 xl:translate-y-3/4 mi-contenedor">
        <div class="flex items-center justify-center p-8 h-full">
          <div class="h-[350px] xl:h-[400px] lg:h-[400px] md:h-[400px] sm:h-[350px] w-full xl:w-[700px] lg:w-[700px] md:w-[700px] sm:w-[700px] max-w-7xl bg-white bg-opacity-0 shadow-xl rounded" style="background-image: url('/src/assets/welcome_page/neon.png'); background-size: cover; background-position: center;">

            <!-- Contenedor para los campos -->
            <div class="p-8">
              <h2 class="text-xs h:text-xs sm:text-sm md:text-ml lg:text-xl xl:text-2xl font-bold text-white uppercase">To create an attack you need to add a
                name and a direction of attack, THE DMG
                WILL BE GENERATED RANDOMLY</h2>

              <div class="space-y-10">
                <!-- Name -->
                <div>
                  <label for="name" class="block text-sm font-bold text-white uppercase">Name</label>
                  <input type="text" id="name" name="name" class="w-full p-2 mt-1 bg-white text-black rounded">
                </div>

                <!-- Direction -->
                <div>
                  <label for="direction" class="block text-sm font-bold text-white uppercase">Direction of Attack</label>
                  <input type="text" id="direction" name="direction" class="w-full p-2 mt-1 bg-white text-black rounded">
                </div>

                <!-- Create Attack -->
                <div class="text-right">
                  <RouterLink to="/shop" class="bg-purple-600 hover:bg-yellow-300 text-white font-bold py-3 px-6 rounded-lg text-lg sm:text-base md:text-lg lg:text-xl xl:text-2xl uppercase">Create</RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Botón de Regreso a Shop -->
    <ReturnToShop/>

  </div>
</template>

<style scoped>

</style>

<style>
.img-container {
  position: fixed;
  left: 4%;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 1440px) {
  .img-container {
    display: flex;
  }
}

@media (max-width: 1439px) {
  .img-container {
    display: none;
  }
  .img-container img {
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>

<!--CONTENEDOR DE LA MONEDA-->
<style>
.mi-imagen {
  position: absolute;
  top: 0;
  right: 0;
  margin: 4px;
}

@media screen and (max-width: 767px) {
  .mi-imagen {
    width: 20%;
    height: auto;
    margin-top: 15px;
  }
}

@media screen and (min-width: 768px) {
  .mi-imagen {
    width: 10%;
    height: auto;
  }
}
</style>

<style>
.mi-contenedor {
  position: relative;
  max-width: 700px;
  width: 100%;
  margin: auto;
}

@media screen and (max-width: 767px) and (min-width: 576px){
  .mi-contenedor {
    max-width: 100%;
    top: 0;
    right: 0;
  }
}

@media screen and (max-width: 980px) and (min-width: 768px) {
  .mi-contenedor {
    max-width: 100%;
    top: -40px;
  }
}

@media screen and (max-width: 1439px) and (min-width: 981px) {
  .mi-contenedor {
    max-width: 100%;
    top: -40px;
  }
}

@media screen and (max-width: 575px) and (min-width: 0px){
  .mi-contenedor {
    max-width: 90%;
    max-height: 1%;
  }
}
</style>
