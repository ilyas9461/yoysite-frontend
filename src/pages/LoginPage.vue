<template>
  <div class="p-d-flex p-jc-center">

      <div class="p-col-6 p-mb-2 p-lg-4 ">
        <img alt="Vue logo" src="../assets/primevue-logo.png" />
        <LoginForm />
      </div>

    <!-- <div class="p-col-6 p-mb-2 p-lg-4 ">
      <div class="p-mr-4">
        <HelloWorld msg="Welcome to Your Vue.js App" />
      </div>
    </div> -->
  </div>

  <Toast />
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import LoginForm from "../components/LoginForm.vue";
// import HelloWorld from "../components/HelloWorld.vue";

export default {
  name: "LoginPage",
  components: {
    LoginForm,
    // HelloWorld,
  },
  data() {
    return {
      message: null,
      text: null,
    };
  },
  methods: {
    greet() {
      this.$toast.add({ severity: "info", summary: "Hello " + this.text });
      this.message = "Hello " + this.text;
    },
  },
};
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.app-container {
  text-align: center;
}

body #app .p-button {
  margin-left: 0.2em;
}

form {
  margin-top: 2em;
}
</style>