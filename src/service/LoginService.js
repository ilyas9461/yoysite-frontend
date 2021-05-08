import axios from 'axios';

//const URL='http://localhost:3000';
//const URL = 'http://192.168.1.124:3000';
const URL='/api';  ////vue.config.js dosyasındaki devServer,  proxy ayarlarında belirtilmiştir.

let token = localStorage.getItem('token');

const apiClient = axios.create({
   baseURL: URL,
   withCredentials: false, // This is the default
   headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'token': `${token}`,
   }
});

export default class LoginSevice {

   isEmptyObj(obj) {
      for (var i in obj) return false;
      return true;
   }
   async getLoginData() {
      let user;
      try {
         const response = await axios.get(URL + '/user/logined'); // Giriş yapan kullanıcı için üretilen token alınıyor.
         // console.log('Login Service getLoginData(): ' + response.data);

         if (this.isEmptyObj(JSON.parse(response.data))) {
            //console.log('Data yokk..');
            token = localStorage.getItem('token');
         } else
            token = response.data;
         // console.log('getLoginData(): ',JSON.parse(token));

         localStorage.setItem('token', token); // token yerel depoya kaydediliyor.
         // console.log(localStorage.getItem('token'));//string olarak kaydoluyor. JSOn.parse ile çevrilmeli.

         user = await axios.get(URL + '/user/userdata', { //tokendeki kullanıcı verileri alınıyor.
            headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
               'token': token,
            }
         }).catch(function (error) {
            if (error.response) {
            //   console.log('Error User: ',error.response.data);
            //   console.log(error.response.status);
              console.log(error.response.headers);
              
            }
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('sonGunSonu');
            localStorage.removeItem('firma');
             // window.location.href = "http://localhost:3000/";
            window.location.href =URL;

          });



         localStorage.setItem('user', user.data); //user yerel depoya kaydediliyor
         //console.log('getLoginData(): ', user);
         return user.data; //response.data;

      } catch (error) {
         this.logoutUser(user.data);
      }

   }

   async getFirmaData(firmaWebId) {

      const jsonData = {
         data: firmaWebId
      };
      // console.log('loginServis getFirmaDAta :',JSON.stringify(jsonData));
      const res = await apiClient.post('/user/firma', JSON.stringify(jsonData), {
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // 'token':(localStorage.getItem('token')),
         }
      }).catch(function (error) {
         if (error.response) {
         //   console.log('Error User: ',error.response.data);
         //   console.log(error.response.status);
           console.log(error.response.headers);
           
         }
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         localStorage.removeItem('sonGunSonu');
         localStorage.removeItem('firma');
          // window.location.href = "http://localhost:3000/";
         window.location.href = URL;

       });


      //console.log('loginServis getFirmaDAta :',JSON.stringify(res));
      localStorage.setItem('firma', res);
      return res;

   }

   logoutUser(user) {

      const jsonData = JSON.stringify(user);

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('sonGunSonu');
      localStorage.removeItem('firma');
      console.log('LOGOUT :', jsonData);
      const res = apiClient.post('/user/logout', JSON.stringify(jsonData));
      // window.location.href = "http://localhost:3000/";
      window.location.href =URL;
      return res;
   }

}