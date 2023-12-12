<script>

</script>

<template>
  <div class="flex-grow flex flex-col md:flex-row">
    <div class="hidden md:flex flex-col justify-center items-start w-1/5 fixed left-0 top-1/2 -translate-y-1/2 h-screen">
      <RouterLink to="/home" class="flex items-center pl-3.5 bg-fuchsia-500 text-black font-bold py-4 rounded-r-full w-full mb-4 hover:bg-cyan-500 hover:translate-x-2 transition duration-300 uppercase justify-start text-2xl">
        <font-awesome-icon icon="home" class="mr-2" /> Home
      </RouterLink>
      <RouterLink to="/profile" class="flex items-center pl-3.5 bg-fuchsia-500 text-black font-bold py-4 rounded-r-full w-full mb-4 hover:bg-cyan-500 hover:translate-x-2 transition duration-300 uppercase justify-start text-2xl">
        <font-awesome-icon icon="user" class="mr-2" /> Profile
      </RouterLink>
      <RouterLink to="/shop" class="flex items-center pl-3.5 bg-fuchsia-500 text-black font-bold py-4 rounded-r-full w-full mb-4 hover:bg-cyan-500 hover:translate-x-2 transition duration-300 uppercase justify-start text-2xl">
        <font-awesome-icon icon="shopping-cart" class="mr-2" /> Shop
      </RouterLink>
      <RouterLink to="/inventory" class="flex items-center pl-3.5 bg-fuchsia-500 text-black font-bold py-4 rounded-r-full w-full mb-4 hover:bg-cyan-500 hover:translate-x-2 transition duration-300 uppercase justify-start text-2xl">
        <font-awesome-icon icon="list" class="mr-2" /> Inventory
      </RouterLink>
      <RouterLink to="/ranking" class="flex items-center pl-3.5 bg-fuchsia-500 text-black font-bold py-4 rounded-r-full w-full mb-4 hover:bg-cyan-500 hover:translate-x-2 transition duration-300 uppercase justify-start text-2xl">
        <font-awesome-icon icon="trophy" class="mr-2" /> Ranking
      </RouterLink>
    </div>
  </div>

  <!-- Menu inferior para pantallas pequeñas -->
  <div class="flex md:hidden flex-row justify-between items-center w-full fixed bottom-0 left-0 right-0 bg-black pl-5 pr-5">
    <RouterLink to="/home" class="flex items-center ml-0.5 mr-0.5 justify-center bg-fuchsia-500 text-black font-bold p-2 rounded-t-md w-1/5 hover:bg-cyan-500 hover:-translate-y-1 transition duration-300 uppercase text-3xl">
      <font-awesome-icon icon="home" />
    </RouterLink>
    <RouterLink to="/profile" class="flex items-center ml-0.5 mr-0.5 justify-center bg-fuchsia-500 text-black font-bold p-2 rounded-t-md w-1/5 hover:bg-cyan-500 hover:-translate-y-1 transition duration-300 uppercase text-3xl">
      <font-awesome-icon icon="user" />
    </RouterLink>
    <RouterLink to="/shop" class="flex items-center ml-0.5 mr-0.5 justify-center bg-fuchsia-500 text-black font-bold p-2 rounded-t-md w-1/5 hover:bg-cyan-500 hover:-translate-y-1 transition duration-300 uppercase text-3xl">
      <font-awesome-icon icon="shopping-cart" />
    </RouterLink>
    <RouterLink to="/inventory" class="flex items-center ml-0.5 mr-0.5 justify-center bg-fuchsia-500 text-black font-bold p-2 rounded-t-md w-1/5 hover:bg-cyan-500 hover:-translate-y-1 transition duration-300 uppercase text-3xl">
      <font-awesome-icon icon="list" />
    </RouterLink>
    <RouterLink to="/ranking" class="flex items-center ml-0.5 mr-0.5 justify-center bg-fuchsia-500 text-black font-bold p-2 rounded-t-md w-1/5 hover:bg-cyan-500 hover:-translate-y-1 transition duration-300 uppercase text-3xl">
      <font-awesome-icon icon="trophy" />
    </RouterLink>
  </div>
</template>

<style scoped>

</style>