<script setup>

</script>

<template>
  <router-view></router-view>
</template>

<script>
export default {
  data() {
    return {
      playerData: null,
      authToken: null
    };
  },
  created() {
    this.loadInitialData();
  },
  methods: {
    setPlayerData(data) {
      this.playerData = data;
      this.authToken = data.token;
    },
    loadInitialData() {
      const storedData = localStorage.getItem('playerData');
      if (storedData) {
        this.setPlayerData(JSON.parse(storedData));
      }
    }
  }
};
</script>