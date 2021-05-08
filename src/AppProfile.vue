<template>
  <div class="layout-profile">
    <div>
      <img src="assets/layout/images/avatar_2.png" alt="" />
    </div>
    <button class="p-link layout-profile-link" @click="onClick">
      <span class="username">{{  getStoreUser()}}</span>
      <i class="pi pi-fw pi-cog"></i>
    </button>
    <transition name="layout-submenu-wrapper">
      <ul v-show="expanded">
        <li>
          <button class="p-link">
            <router-link to="/empty">
              <i class="pi pi-fw pi-user"></i><span>Hesap</span>
            </router-link>
            
          </button>
        </li>
        <li>
          <button class="p-link">
            <i class="pi pi-fw pi-inbox"></i><span>Bildirimler</span
            ><span class="menuitem-badge">2</span>
          </button>
        </li>
        <li>
          <button class="p-link" @click="onClickLogout">
            <i class="pi pi-fw pi-power-off"></i><span>Çıkış</span>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import LoginSevice from "./service/LoginService";

export default {
  data() {
    return {
      expanded: false,
      user: null,
    };
  },
  created() {
    //this.$store.dispatch("setUser");  //module yokken store/index.js erişmek için
   // this.$store.dispatch("UserModule/setUser");
  },
  computed: {
    ...mapState({
      storeUser: state => state.UserModule.user
    }),
    ...mapGetters('userModule', {
      getUser: 'getUser',
 
    }),
  },

  methods: {
    onClick(event) {
      this.expanded = !this.expanded;
      event.preventDefault();
    },

    getStoreUser() {
      //this.user = this.$store.getters.getuser; // index.js erişmek için
     this.user = this.storeUser;
     //console.log("user profile..:" + JSON.stringify(this.user));
      if (this.user !== null) {
        return this.user.adSoyad;
      }
    },
    onClickLogout(event) {  
      //this.$store.dispatch("userReset");// strore/index.js teki metodlar için 
      this.$store.dispatch("UserModule/userReset");
      const loginServise = new LoginSevice();
      loginServise.logoutUser(this.user);
      this.user = null;
       //console.log('Logout....clik');
      event.preventDefault();
    },
  },
};
</script>

<style scoped>
</style>