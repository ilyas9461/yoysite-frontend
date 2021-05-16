 import DataService from "../../service/DataService";
 const dataService=new DataService();

// initial state
const state = () => ({
  user: localStorage.getItem('user'),   //''
  firma:localStorage.getItem('firma'),
});

// mutations
const mutations = {
  SET_USER(state, user) {
    state.user = user;
    localStorage.setItem('user',user);
    //console.log("mutation:" + JSON.stringify(user));
  },
  SET_FIRMA(state, firmaData) {
    state.firma = firmaData;
    localStorage.setItem('firma',firmaData);
    //console.log("mutation:" + JSON.stringify(firmaData));
  }
};

// getters
const getters = {
  getUser: (state) => {
    let objUser=state.user;
    //return JSON.stringify(objUser);
    return objUser;
  },
};

/// actions
const actions = {

  // async setUser({commit}) {
  //   const loginServise = new LoginSevice();
  //   let dataJson = await loginServise.getLoginData();
  //   dataJson = JSON.parse(dataJson);

  //   commit('SET_USER', dataJson);
  //   //console.log("actions USER:" + JSON.stringify(dataJson));

  // },
  userReset({commit}) {
    commit('SET_USER', null);
    dataService.deleteLocalStorageData();
  },
  setUserData({commit},data){
    //console.log('USER DATA : ',data);
    commit('SET_USER', data);
  },
  setFirmaData({commit},data){
    //console.log('STORE USER: FIRMA DATA : ',data);
    commit('SET_FIRMA', data);
  }

  // setUser({commit},user) {
  //   commit('SET_USER', user);
  // }
};

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true,
};