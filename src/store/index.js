import {  createStore} from 'vuex';
// import LoginSevice from "../service/LoginService";
import  UserModule from "./modules/UserModule";
import  DataModule from "./modules/DataModule";

export default createStore({
  modules: {
    UserModule,
    DataModule
  },

});




