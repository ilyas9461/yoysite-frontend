import axios from "axios";

const URL='http://157.230.229.168:3000'; //digital ocean ubuntu server
//const URL='http://localhost:3000';

//const URL = "http://192.168.1.124:3000";
//const URL='/api';  //vue.config.js dosyasındaki devServer,  proxy ayarlarında belirtilmiştir.

// const apiClient = axios.create({
//   baseURL: URL,
//   withCredentials: false, // This is the default
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//     token: localStorage.getItem("token"), //string gönderilir alındığı yerde JSON.parse ile çevrilmeli.
//   },
// });

export default class DataService {

  isEmptyObj(obj) {
    for (var i in obj) return false;
    return true;
  }

  deleteLocalStorageData(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sonGunSonu');
    localStorage.removeItem('firma');
  }

  authHeader() {
    let token = (localStorage.getItem("token"));
    //console.log("authHeader() :", token);
    let header = {
      Accept: "application/json",
      "Content-Type": "application/json",
      token: token, //string gönderilir alındığı yerde JSON.parse ile çevrilmeli.
    };
    return header;
  }

  async getAylikGunSonu(dataUser){
    const jsonData = JSON.stringify(dataUser);
    // const res = await apiClient.post('/gunsonu/songunsonu', jsonData);
    const res = await axios.post(URL + "/gunsonu", jsonData, {
      headers: this.authHeader(),
    }).catch(function (error) {
      if (error.response) {
        //   console.log('Error User: ',error.response.data);
        //   console.log(error.response.status);
        console.log(error.response.headers);
      }
      this.deleteLocalStorageData();
      // window.location.href = "http://localhost:3000/";
      window.location.href = URL;

    });


    localStorage.setItem('AylikGunSonu', JSON.stringify(res.data));

    // console.log('DaTA Srevis:', JSON.parse(localStorage.getItem('sonGunSonu')));

    return res; //dönen veri  object tir.
  }

  // const sorgu = {
  //   tar1: tar1,
  //   tar2: tar1,
  //   user: userFirmaId, //'46',
  // };

  async getSonGunSonu(dataUser) {
    const jsonData = JSON.stringify(dataUser);
    // const res = await apiClient.post('/gunsonu/songunsonu', jsonData);
    const res = await axios.post(URL + "/gunsonu/songunsonu", jsonData, {
      headers: this.authHeader(),
    }).catch(function (error) {
      if (error.response) {
        //   console.log('Error User: ',error.response.data);
        //   console.log(error.response.status);
        console.log(error.response.headers);
      }
      this.deleteLocalStorageData();
      // window.location.href = "http://localhost:3000/";
      window.location.href = URL;

    });


    localStorage.setItem('sonGunSonu', JSON.stringify(res.data));

    // console.log('DaTA Srevis:', JSON.parse(localStorage.getItem('sonGunSonu')));

    return res; //dönen veri  object tir.
  }

  /** dataUser : fomatı*/

  // const sorgu={
  //     tar: getSonGunSonuTarih(),
  //     user: getUserFirmaId(), //'46',
  //};

  async getGunlukCiroDetay(dataUser) {
    //console.log('DaTA Srevis:', dataUser);
    const jsonData = JSON.stringify(dataUser);
    const res = await axios.post(URL + "/gunsonu/gunlukcirodetay", jsonData, {
      headers: this.authHeader(),
    }).catch(function (error) {
      if (error.response) {
        //   console.log('Error User: ',error.response.data);
        //   console.log(error.response.status);
        console.log(error.response.headers);

      }
      this.deleteLocalStorageData();
      // window.location.href = "http://localhost:3000/";
      window.location.href = URL;

    });
    // console.log('DaTA Srevis:', res);
    return res; //dönen veri  object tir.
  }

  async getGunlukMasrafDetay(dataUser) {
    const jsonData = JSON.stringify(dataUser);
    const res = await axios.post(URL + "/gunsonu/gunlukmasrafdetay", jsonData, {
      headers: this.authHeader(),
    }).catch(function (error) {
      if (error.response) {
        //   console.log('Error User: ',error.response.data);
        //   console.log(error.response.status);
        console.log(error.response.headers);

      }
      this.deleteLocalStorageData();
      // window.location.href = "http://localhost:3000/";
      window.location.href = URL;

    });
    // console.log('DaTA Srevis:', res);
    return res; //dönen veri  object tir.
  }
  async getGunlukBankaDetay(dataUser) {
    const jsonData = JSON.stringify(dataUser);
    const res = await axios.post(URL + "/gunsonu/gunlukbankadetay", jsonData, {
      headers: this.authHeader(),
    }).catch(function (error) {
      if (error.response) {
        //   console.log('Error User: ',error.response.data);
        //   console.log(error.response.status);
        console.log(error.response.headers);

      }
      this.deleteLocalStorageData();
      // window.location.href = "http://localhost:3000/";
      window.location.href = URL;

    });
    // console.log('DaTA Srevis:', res);
    return res; //dönen veri  object tir.
  }
}