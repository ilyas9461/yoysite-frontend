<template>
  <div class="layout-topbar">
    <button class="p-link layout-menu-button" @click="onMenuToggle">
      <span class="pi pi-bars"></span>
    </button>
    <div class="layout-topbar-icons">
      <button class="p-link" @click="onClicAylikGunSonuListe">
        <span class="layout-topbar-item-text">List</span>
        <span class="layout-topbar-icon pi pi pi-list"></span>
      </button>
      <button class="p-link">
        <span class="layout-topbar-item-text">Events</span>
        <span class="layout-topbar-icon pi pi-calendar"></span>
        <span class="layout-topbar-badge">15</span>
      </button>
      <button class="p-link">
        <span class="layout-topbar-item-text">Settings</span>
        <span class="layout-topbar-icon pi pi-cog"></span>
      </button>
      <button class="p-link" @click="onClickLogout">
        <span class="layout-topbar-item-text">User</span>
        <span class="layout-topbar-icon pi pi-power-off"></span>
      </button>
    </div>
  </div>
</template>

<script>
import LoginSevice from "./service/LoginService";
import router from "./router";

export default {
  methods: {
    onMenuToggle(event) {
      this.$emit("menu-toggle", event);
    },
    onClickLogout(event) {
      //this.$store.dispatch("userReset");// strore/index.js teki metodlar için
      this.$store.dispatch("UserModule/userReset");
      const loginServise = new LoginSevice();
      loginServise.logoutUser(this.user);
      //console.log('Logout....clik');
      event.preventDefault();
    },
    onClicAylikGunSonuListe(event){
      router.push({ name: "gunsonulistele"});
      event.preventDefault();
    },
  },
};
</script>
