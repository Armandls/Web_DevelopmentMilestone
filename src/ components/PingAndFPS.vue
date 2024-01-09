<template>
  <div class="ml-96 bg-green-500 text-white text-sm font-bold font-mono rounded">
    <div class="flex justify-between px-2 py-1 space-x-4">
      <div>FPS: <span class="font-bold">{{ fps }}</span></div>
      <div></div>
      <div><span class="font-bold">{{ ping.toFixed(0) }}</span> ms</div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const apiUrl = 'https://balandrau.salle.url.edu/i3/ping';
const ping = ref(0);
const fps = ref(0);

// Funcio per calcular el ping
function fetchPing() {
  const startTime = performance.now(); //Temps actual
  fetch(apiUrl)
      .then(response => {
        if (response.ok) {
          const endTime = performance.now(); //Temps actual
          ping.value = endTime - startTime; //Temps actual - temps anterior
        } else {
          console.error('Error en la resposta del servidor:', response.status);
        }
      })
      .catch(error => {
        console.error('Error en realitzar la petició:', error);
      });
}

// Calculem els FPS
let frameCount = 0; // Contador de frames
let lastTime = performance.now(); // Temps del frame anterior

const updateFPS = () => {
  const now = performance.now(); // Temps actual
  frameCount++; // Incrementem el contador de frames

  if (now >= lastTime + 1000) {
    fps.value = frameCount;
    frameCount = 0;
    lastTime = now;
  }

  requestAnimationFrame(updateFPS); // Actualitzem els FPS
};

// Iniciem calcul del ping i FPS
let pingInterval;
let animationFrameId;

onMounted(() => {
  pingInterval = setInterval(fetchPing, 5000);
  animationFrameId = requestAnimationFrame(updateFPS);
});

onUnmounted(() => {
  clearInterval(pingInterval);
  cancelAnimationFrame(animationFrameId);
});
</script>