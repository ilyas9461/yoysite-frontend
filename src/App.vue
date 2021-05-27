<template>
  <!-- <div v-if="!!isLogin" :class="containerClass" @click="onWrapperClick"> -->

  <div v-if="!userFirmaTask.isRunning" :class="containerClass"  @click="onWrapperClick" >
    <!-- !!isLogin -->
    <div v-if="userData('login')">
      <AppTopBar @menu-toggle="onMenuToggle" />

      <transition name="layout-sidebar">
        <div
          :class="sidebarClass"
          @click="onSidebarClick"
          v-show="isSidebarVisible()"
        >
          <div class="layout-logo">
            <router-link to="/">
              <!-- <img alt="Logo" :src="logo" /> -->
              <h3 style="font-weight: bold">
                :: Yoyuncak :: {{ userData("firmaWebId") }}
              </h3>
              <!-- {{userObj.adSoyad}} -->
            </router-link> 
          </div>

          <AppProfile />
          <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
        </div>
      </transition>

      <div class="layout-main">
        <router-view />
      </div>
      <!-- Sağ taraftaki ayarlar butonu -->
      <!-- <AppConfig :layoutMode="layoutMode" :layoutColorMode="layoutColorMode" 
             @layout-change="onLayoutChange" @layout-color-change="onLayoutColorChange" /> -->

      <AppFooter />
    </div> <!-- login kontrolü -->    
    <div v-else>  
      <NoUserPage />
    </div>
  </div>

  <div v-else>
    <NoUserPage />
    <!-- Yükleniyor App.vue -->
  </div>
</template>

<script>
import AppTopBar from "./AppTopbar.vue";
import AppProfile from "./AppProfile.vue";
import AppMenu from "./AppMenu.vue";
// import AppConfig from './AppConfig.vue';
import AppFooter from "./AppFooter.vue";
import LoginSevice from "./service/LoginService";
import NoUserPage from "./pages/NoUserPage.vue";

import { useTask } from "vue-concurrency";
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  setup() {
    const store = useStore();
    const loginServise = new LoginSevice();

    const getUserTask = useTask(function* () {
      const userdata = yield loginServise.getLoginData();
      store.dispatch("UserModule/setUserData", JSON.parse(userdata));

      return JSON.parse(userdata);
    });

    const getFirmaTask=useTask(function*(signal,userData){
      // console.log('getFirmaTask',userData.firmaWebId);
       const firmaData=yield loginServise.getFirmaData(userData.firmaWebId);
       store.dispatch("UserModule/setFirmaData",firmaData);
        
    });

    const userFirmaTask=useTask(function*(){
       const userData=yield getUserTask.perform();
       const firmaData=yield getFirmaTask.perform(userData);

       return firmaData;
      
    });

    userFirmaTask.perform();

    function userData(alan) {

      if (!getUserTask.isRunning) {
        const value = computed(() => store.state.UserModule.user).value;

        if (value != undefined || value != null) {
          // gunSonuTarih.value = "Gun Sonu - " + value.tarih;
         // console.log("VALUE... userData:" + value.login);
          return value[alan];
        }

        return "...";
      }
    }

    return {
      getUserTask,
      getFirmaTask,
      userFirmaTask,
      store,
      userData,
    };
  },
  data() {
    return {
      isLogin: null,
      userObj: null,
      layoutMode: "static",
      layoutColorMode: "dark",
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
      menu: [
        { label: "Ana Sayfa", icon: "pi pi-fw pi-home", to: "/" },
        {
          label: "Listeler",
          icon: "pi pi-fw pi-list",
          items: [
            // {
            //   label: "Haftalık",
            //   icon: "pi pi-fw pi-id-card",
            //   // to: "/formlayout",
            //    items:[
            //     {
            //       label: "Gun Sonu",
            //       icon: "pi pi-fw pi-circle-off",
            //       to: "/gunsonulistele",

            //     },
            //     {
            //       label: "Masraf",
            //       icon: "pi pi-fw pi-circle-off",
            //       to: "/empty",
            //     },
            //     {
            //       label: "Banka/Elden",
            //       icon: "pi pi-fw pi-circle-off",
            //       to: "/empty",
            //     }
            //   ]
            // },
            { 
              label: "Aylık", 
              icon: "pi pi-fw pi-moon", 
              to: "/gunsonulistele"
              // to: "/input" ,
              // items:[
              //   {
              //     label: "Gun Sonu",
              //     icon: "pi pi-fw pi-circle-off",
              //     to: "/gunsonulistele",

              //   },
              //   {
              //     label: "Masraf",
              //     icon: "pi pi-fw pi-circle-off",
              //     to: "/empty",
              //   },
              //   {
              //     label: "Banka/Elden",
              //     icon: "pi pi-fw pi-circle-off",
              //     to: "/empty",
              //   },
              //   {
              //     label: "Misafir Sayısı",
              //     icon: "pi pi-fw pi-circle-off",
              //     to: "/empty",
              //   }
              // ]
            },
            {
              label: "Tarih Aralıklı",
              icon: "pi pi-fw pi-calendar-times",
              to: "/gunsonutarihlistele",

            },
            // {
            //   label: "Invalid State",
            //   icon: "pi pi-fw pi-exclamation-circle",
            //   to: "invalidstate",
            // },
            // { label: "Button", icon: "pi pi-fw pi-mobile", to: "/button" },
            // { label: "Table", icon: "pi pi-fw pi-table", to: "/table" },
            // { label: "List", icon: "pi pi-fw pi-list", to: "/list" },
            // { label: "Tree", icon: "pi pi-fw pi-share-alt", to: "/tree" },
            // { label: "Panel", icon: "pi pi-fw pi-tablet", to: "/panel" },
            // { label: "Overlay", icon: "pi pi-fw pi-clone", to: "/overlay" },
            // { label: "Menu", icon: "pi pi-fw pi-bars", to: "/menu" },
            // { label: "Message", icon: "pi pi-fw pi-comment", to: "/messages" },
            // { label: "File", icon: "pi pi-fw pi-file", to: "/file" },
            // { label: "Chart", icon: "pi pi-fw pi-chart-bar", to: "/chart" },
            // { label: "Misc", icon: "pi pi-fw pi-circle-off", to: "/misc" },
          ],
        },
        
        {
          label: "Veri Analizi",
          icon: "pi pi-fw pi-clone",
          items: [
            { label: "Gün Sonu", icon: "pi pi-fw pi-user-edit", to: "/crud" },
            {
              label: "Temassız Kart",
              icon: "pi pi-fw pi-circle-off",
              to: "/empty",
            },
            {
              label: "Misafir Sayıları",
              icon: "pi pi-fw pi-circle-off",
              to: "/empty",
            },
            {
              label: "Masraflar",
              icon: "pi pi-fw pi-circle-off",
              to: "/empty",
            },
            {
              label: "Oyuncak Bazında",
              icon: "pi pi-fw pi-circle-off",
              to: "/empty",
            },
             {
              label: "Soft Alan",
              icon: "pi pi-fw pi-circle-off",
              items:[
                {
                  label: "Top Havuzu",
                  icon: "pi pi-fw pi-circle-off",
                  to: "/empty",

                },
                {
                  label: "Kum Havuzu",
                  icon: "pi pi-fw pi-circle-off",
                  to: "/empty",
                }
              ]
              
            },
          ],
        },
       
        {
          label: "Araçlar",
          icon: "pi pi-fw pi-globe",
          items: [
            {
              label: "Fiyat Güncelleme",
              icon: "pi pi-fw pi-desktop",
              to: "/display",
            },
            {
              label: "Promasyon Güncelleme",
              icon: "pi pi-fw pi-external-link",
              to: "/elevation",
            },
            {
              label: "Promasyon Ekleme",
              icon: "pi pi-fw pi-directions",
              to: "/flexbox",
            },
            {
              label: "Kasiyer Ekleme/Silme",
              icon: "pi pi-fw pi-search",
              to: "/icons",
            },
            {
              label: "Calendar",
              icon: "pi pi-fw pi-calendar-plus",
              to: "/calendar",
            },
            {
              label: "Timeline",
              icon: "pi pi-fw pi-calendar",
              to: "/timeline",
            },
            // { label: "Grid System", icon: "pi pi-fw pi-th-large", to: "/grid" },
            // {
            //   label: "Spacing",
            //   icon: "pi pi-fw pi-arrow-right",
            //   to: "/spacing",
            // },
            // {
            //   label: "Typography",
            //   icon: "pi pi-fw pi-align-center",
            //   to: "/typography",
            // },
            // { label: "Text", icon: "pi pi-fw pi-pencil", to: "/text" },
          ],
        },

        // {
        //   label: "Menu Hierarchy",
        //   icon: "pi pi-fw pi-search",
        //   items: [
        //     {
        //       label: "Submenu 1",
        //       icon: "pi pi-fw pi-bookmark",
        //       items: [
        //         {
        //           label: "Submenu 1.1",
        //           icon: "pi pi-fw pi-bookmark",
        //           items: [
        //             { label: "Submenu 1.1.1", icon: "pi pi-fw pi-bookmark" },
        //             { label: "Submenu 1.1.2", icon: "pi pi-fw pi-bookmark" },
        //             { label: "Submenu 1.1.3", icon: "pi pi-fw pi-bookmark" },
        //           ],
        //         },
        //         {
        //           label: "Submenu 1.2",
        //           icon: "pi pi-fw pi-bookmark",
        //           items: [
        //             { label: "Submenu 1.2.1", icon: "pi pi-fw pi-bookmark" },
        //             { label: "Submenu 1.2.2", icon: "pi pi-fw pi-bookmark" },
        //           ],
        //         },
        //       ],
        //     },
        //     {
        //       label: "Submenu 2",
        //       icon: "pi pi-fw pi-bookmark",
        //       items: [
        //         {
        //           label: "Submenu 2.1",
        //           icon: "pi pi-fw pi-bookmark",
        //           items: [
        //             { label: "Submenu 2.1.1", icon: "pi pi-fw pi-bookmark" },
        //             { label: "Submenu 2.1.2", icon: "pi pi-fw pi-bookmark" },
        //             { label: "Submenu 2.1.3", icon: "pi pi-fw pi-bookmark" },
        //           ],
        //         },
        //         {
        //           label: "Submenu 2.2",
        //           icon: "pi pi-fw pi-bookmark",
        //           items: [
        //             { label: "Submenu 2.2.1", icon: "pi pi-fw pi-bookmark" },
        //             { label: "Submenu 2.2.2", icon: "pi pi-fw pi-bookmark" },
        //           ],
        //         },
        //       ],
        //     },
        //   ],
        // },
        {
          label: "Personel Takip",
          icon: "pi pi-fw pi-users",
           to: "/empty",
          // command: () => {
          //   window.location = "#/documentation";
          // },
        },
        {
          label: "SSS",
          icon: "pi pi-fw pi-question",
           to: "/empty",
          // command: () => {
          //   window.location = "#/documentation";
          // },
        },
        // {
        //   label: "View Source",
        //   icon: "pi pi-fw pi-search",
        //   command: () => {
        //     window.location = "https://github.com/primefaces/sigma-vue";
        //   },
        // },
      ],
    };
  },
  watch: {
    $route() {
      this.menuActive = false;
      this.$toast.removeAllGroups();
    },
  },
  methods: {
    onWrapperClick() {
      if (!this.menuClick) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }

      this.menuClick = false;
    },
    onMenuToggle() {
      this.menuClick = true;

      if (this.isDesktop()) {
        if (this.layoutMode === "overlay") {
          if (this.mobileMenuActive === true) {
            this.overlayMenuActive = true;
          }

          this.overlayMenuActive = !this.overlayMenuActive;
          this.mobileMenuActive = false;
        } else if (this.layoutMode === "static") {
          this.staticMenuInactive = !this.staticMenuInactive;
        }
      } else {
        this.mobileMenuActive = !this.mobileMenuActive;
      }

      event.preventDefault();
    },
    onSidebarClick() {
      this.menuClick = true;
    },
    onMenuItemClick(event) {
      if (event.item && !event.item.items) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }
    },
    onLayoutChange(layoutMode) {
      this.layoutMode = layoutMode;
    },
    onLayoutColorChange(layoutColorMode) {
      this.layoutColorMode = layoutColorMode;
    },
    addClass(element, className) {
      if (element.classList) element.classList.add(className);
      else element.className += " " + className;
    },
    removeClass(element, className) {
      if (element.classList) element.classList.remove(className);
      else
        element.className = element.className.replace(
          new RegExp(
            "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
            "gi"
          ),
          " "
        );
    },
    isDesktop() {
      return window.innerWidth > 1024;
    },
    isSidebarVisible() {
      if (this.isDesktop()) {
        if (this.layoutMode === "static") return !this.staticMenuInactive;
        else if (this.layoutMode === "overlay") return this.overlayMenuActive;
        else return true;
      } else {
        return true;
      }
    },
    // lys function

    // async getUser() {
    //   this.loginServise = new LoginSevice();
    //   const data = await this.loginServise.getLoginData();
    //   this.userObj = JSON.parse(data);
    //   this.isLogin = this.userObj.login;

    //   this.$store.dispatch("UserModule/setUser");

    //   // console.log("user:" + this.userObj.login);
    // },
    // getGunSonuData() {
    //   let datetime = new Date();
    //   datetime.setDate(datetime.getDate() - 1);
    //   datetime = datetime.toLocaleString();
    //   let tar1 = datetime.split(" ")[0];
    //   const [year, month, day] = [...tar1.split(".")];
    //   tar1 = day + "-" + month + "-" + year; ////"yyyy-mm-dd HH:MM:ss"

    //   const sorgu = {
    //     tar1: tar1,
    //     tar2: tar1,
    //     user: this.userObj.firmaWebId,
    //   };

    //   this.$store.dispatch("DataModule/getGunSonu", sorgu).then((res) => {
    //     console.log("App GunSonu :" + res);
    //     return res;
    //   });
    // },
    // getStoreUser() {
    //   this.userObj = this.$store.getters.getuser;
    //   //this.user=JSON.parse(this.user);
    //   // return this.user.adSoyad;
    //   if (this.userObj !== null) {
    //     return this.userObj.adSoyad;
    //   }
    // },
  },
  loginServise: null,
  created() {
    this.userObj = null;
    this.isLogin = false;

    // this.getUser().then(()=>{
    // this.getGunSonuData();  //sonradan çalışarak gun sonunun değerini değiştiriyordu
    // });
  },
  computed: {
    containerClass() {
      return [
        "layout-wrapper",
        {
          "layout-overlay": this.layoutMode === "overlay",
          "layout-static": this.layoutMode === "static",
          "layout-static-sidebar-inactive":
            this.staticMenuInactive && this.layoutMode === "static",
          "layout-overlay-sidebar-active":
            this.overlayMenuActive && this.layoutMode === "overlay",
          "layout-mobile-sidebar-active": this.mobileMenuActive,
          "p-input-filled": this.$appState.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.config.ripple === false,
        },
      ];
    },
    sidebarClass() {
      return [
        "layout-sidebar",
        {
          "layout-sidebar-dark": this.layoutColorMode === "dark",
          "layout-sidebar-light": this.layoutColorMode === "light",
        },
      ];
    },
    logo() {
      return this.layoutColorMode === "dark"
        ? "assets/layout/images/logo-white.svg"
        : "assets/layout/images/logo.svg";
    },
  },
  beforeUpdate() {
    if (this.mobileMenuActive)
      this.addClass(document.body, "body-overflow-hidden");
    else this.removeClass(document.body, "body-overflow-hidden");
  },
  components: {
    AppTopBar: AppTopBar,
    AppProfile: AppProfile,
    AppMenu: AppMenu,
    // 'AppConfig': AppConfig,
    AppFooter: AppFooter,
    NoUserPage: NoUserPage,
  },
};
</script>

<style lang="scss">
@import "./App.scss";
</style>
