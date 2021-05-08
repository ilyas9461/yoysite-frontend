import DataService from "../../service/DataService";

// initial state
const state = () => ({
  sonGunSonu:'',//localStorage.getItem('sonGunSonu'),
});

// mutations
const mutations = {
    SET_GUN_SONU(state, gunSonu) {
      state.sonGunSonu = gunSonu;
    // console.log("mutation:" + JSON.stringify(gunSonu));
      // localStorage.setItem('sonGunSonu',JSON.stringify(gunSonu));
    }
  };

// getters
const getters = {
  getUser: state => {
    return state.sonGunSonu;
  },
};

/// actions
const actions = {
  async getGunSonu({commit},sorgu) {

    const dataService = new DataService();
    let dataObj = await dataService.getGunSonu(sorgu);
    //dataJson = JSON.parse(dataJson);

    //console.log("actions:" + (dataJson.data));
    commit('SET_GUN_SONU', dataObj.data);  
    return dataObj.data;

  },
  setGunSonu({commit},data){
    commit('SET_GUN_SONU', data);  
    // localStorage.setItem('sonGunSonu',JSON.stringify(data));
    //console.log('setGunSonu...',data);
  }

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};