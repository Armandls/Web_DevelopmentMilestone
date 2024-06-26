<script setup>
import {RouterLink} from 'vue-router';
import NavigationBar from "../../ components/NavigationBar.vue";
import {inject, onMounted, ref} from 'vue';
import {get} from "@jridgewell/set-array";
const playerData = inject('playerData');

const tooltip = ref('');

const authToken = inject('authToken');

const playerCoins = ref(0);

function getPlayerCoins() {
  const playerId = playerData.value.player_ID; // Obtener el ID del jugador desde playerData
  fetch(`https://balandrau.salle.url.edu/i3/players/${playerId}`, {
    method: 'GET',
    headers: {
      'Bearer': `${authToken.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error(`Error: ${response.status}`);
      })
      .then(player => {
        const coins = player.coins;
        playerCoins.value = coins;
      })
      .catch(error => {
        console.error('Error fetching player coins:', error.message);
      });
}

// Llamar a la función para obtener las monedas del jugador actual
onMounted(getPlayerCoins);


</script>

<template>
  <main class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">

    <!--Mensaje de bienvenida -->
    <header>
      <button class="bg-cyan-400 text-black font-bold py-2 md:py-5 px-4 md:px-10 rounded-r-full rounded-l-md text-base md:text-2xl uppercase fixed top-5 left-0">
        WELCOME TO NEONEXUZ
      </button>
    </header>

    <!-- Imagen monedas -->
    <img src="/src/assets/shop/Monedas.png" alt="" class="mi-imagen" style="width: 150px; height: auto;">
    <div class="coins text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold font-['Sigmar One']">
      {{ playerCoins }}
    </div>

    <!--Imagen chica tamaño pequeño-->
    <section class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-24 xl:mt-40 xl:mr-4 xl:mb-12 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[500px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pl-5 relative z-0">
      <article class="absolute bottom-0 left-0 w-full h-full flex items-center justify-center img-container z-[-1]">
        <img src="/src/assets/shop/chica.png" alt="Chica" class="w-100 h-100 object-contain mx-auto">
      </article>
    </section>

    <!-- Botones Centrados Abajo con Fotos Tamaño pequeño-->
    <footer class="flex justify-center items-end absolute bottom-20 left-0 right-0">
      <RouterLink to="/createattack" class="relative">
        <button @mouseover="tooltip = 'createattack'" @mouseleave="tooltip = ''" class="bg-fuchsia-500 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full mx-3">
          <img src="/src/assets/shop/logo1_abajo.png" alt="Logo 1" class="w-12 h-12 object-fit-contain" />
        </button>
        <div v-show="tooltip === 'createattack'" class="absolute bottom-0 mb-14 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm z-10">
          Create Attack
        </div>
      </RouterLink>

      <RouterLink to="/buyattack" class="relative">
        <button @mouseover="tooltip = 'buyattack'" @mouseleave="tooltip = ''" class="bg-fuchsia-500 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full mx-3">
          <img src="/src/assets/shop/carrito-de-compras.png" alt="Más" class="w-12 h-12 object-fit-contain" />
        </button>
        <div v-show="tooltip === 'buyattack'" class="absolute bottom-0 mb-14 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm z-10">
          Buy Attack
        </div>
      </RouterLink>

      <RouterLink to="/sellattack" class="relative">
        <button @mouseover="tooltip = 'sellattack'" @mouseleave="tooltip = ''" class="bg-fuchsia-500 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full mx-3">
          <img src="/src/assets/shop/hand.png" alt="Carrito de compras" class="w-12 h-12 object-cover object-fit-contain" />
        </button>
        <div v-show="tooltip === 'sellattack'" class="absolute bottom-0 mb-14 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm z-10">
          Sell Attack
        </div>
      </RouterLink>
    </footer>

    <!-- Navigation bar -->
    <NavigationBar/>

  </main>
</template>


<!-- APARARICION DESAPARICION CHICA -->
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
  background-color: rgba(255, 255, 255, 0.0);
}

@media (min-width: 1001px) {
  .img-container {
    display: flex;
  }
}

@media (max-width: 1000px) {
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


<!-- IMAGEN MONEDAS -->

<style>
.mi-imagen {
  position: absolute;
  top: 0;
  right: 0;
  margin: 4px;}

@media screen and (max-width: 767px) {
  .mi-imagen {
    width: 100%;
    height: auto;
  }
}

@media screen and (min-width: 768px) {
  .mi-imagen {
    width: 25%;
    height: auto;
  }
}
</style>

<!-- CONTENEDOR DE LA MONEDA -->
<style>
.coins {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 24px;
  margin-right: 20px;
  font-size: clamp(16px, 8vw, 30px); /* Utilizamos 'clamp' para limitar el tamaño del texto */
}

@media screen and (max-width: 767px) {
  .coins {
    margin-top: 35px;
  }
}

@media screen and (min-width: 767px) and (max-width: 1000px) {
  .coins {
    margin-top: 27px;
  }
}
</style>