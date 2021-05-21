<template>
  <div v-if="!getSonGunSonuTask.isRunning">
    <Fieldset
      v-for="(firma, index) in gunSonu"
      :key="index"
      :legend="firmaData[index].firma_adi"
      :toggleable="true"
      :collapsed="fieldSetCollapse"
    >
      <Fieldset :legend="anlikTarihSaat()" :toggleable="true">
        <div class="p-grid p-fluid dashboard">
          <div class="p-col-12 p-lg-4">
            <div class="card summary">
              <span class="title">Ciro :</span>
              <span class="detail">
                <Button
                 @click="onClickAnlikGunSonuAyrinti(index)"
                  icon="pi pi-ellipsis-h"
                  class="p-button-rounded p-button-secondary p-button-outlined"
                />
              </span>
              <span class="count visitors">{{ firma.anlikGunSonu.toplam_ciro }} TL</span>
            </div>
          </div>
          <div class="p-col-12 p-lg-4">
            <div class="card summary">
              <span class="title">Masraflar </span>
              <span class="detail">
                <Button
                  @click="onClickAnlikGunSonuAyrinti(index)"
                  icon="pi pi-ellipsis-h"
                  class="p-button-rounded p-button-secondary p-button-outlined"
                />
              </span>
              <span class="count purchases">{{ firma.anlikGunSonu.masraf_tutar}} TL</span>
            </div>
          </div>
          <div class="p-col-12 p-lg-4">
            <div class="card summary">
              <span class="title">Kasa</span>
              <span class="detail"
                ><Button
                  @click="onClickAnlikGunSonuAyrinti(index)"
                  icon="pi pi-ellipsis-h"
                  class="p-button-rounded p-button-secondary p-button-outlined"
              /></span>
              <span class="count revenue">{{ firma.anlikGunSonu.gunluk_kasa}} TL</span>
            </div>
          </div>
        </div>
      </Fieldset>
      <!-- GUN SONU -->
      <Fieldset :legend="'Son Gün Sonu : '+firma.sonGunSonu.tarih" :toggleable="true">
        <div class="p-grid p-fluid dashboard">
          <div class="p-col-12 p-lg-4">
            <div class="card summary">
              <span class="title">Ciro</span>
              <span class="detail"
                ><Button
                  @click="onClickAyrintiGunSonu(index)"
                  icon="pi pi-ellipsis-h"
                  class="p-button-rounded p-button-secondary p-button-outlined"
                />
              </span>
              <span class="count visitors">
                {{ firma.sonGunSonu.toplam_ciro }} TL
                <!-- {{ gunSonu("toplam_ciro") }} TL -->
              </span>
            </div>
          </div>
          <div class="p-col-12 p-lg-4">
            <div class="card summary">
              <span class="title">Masraflar </span>
              <span class="detail"
                ><Button
                  @click="onClickAyrintiGunSonu(index)"
                  icon="pi pi-ellipsis-h"
                  class="p-button-rounded p-button-secondary p-button-outlined"
                />
              </span>
              <span class="count purchases">
                <!-- {{ gunSonu("masraf_tutar") }} TL -->
                {{ firma.sonGunSonu.masraf_tutar }} TL
              </span>
            </div>
          </div>
          <div class="p-col-12 p-lg-4">
            <div class="card summary">
              <span class="title">Kasa</span>
              <span class="detail"
                ><Button
                  @click="onClickAyrintiGunSonu(index)"
                  icon="pi pi-ellipsis-h"
                  class="p-button-rounded p-button-secondary p-button-outlined"
                />
              </span>
              <span class="count revenue">
                <!-- {{ gunSonu("gunluk_kasa") }} TL -->
                {{ firma.sonGunSonu.gunluk_kasa }} TL
              </span>
            </div>
          </div>
        </div>
      </Fieldset>
    </Fieldset>
  </div>
  <div class="card" style="text-align:center" v-else>
    <span class="pi pi-spin pi-spinner" style="fontSize: 2.5rem"></span> 
    <span style="fontSize: 1.5rem"> Yükleniyor...</span>
  </div>
</template>

<script>
//import ProductService from "../service/ProductService";
//import { mapState } from "vuex";
import { useTask } from "vue-concurrency";
import { useStore } from "vuex";
import { ref, computed, onBeforeUpdate } from "vue"; //, onMounted
import DataService from "../service/DataService";
import router from "../router";

export default {
  setup() {
    const store = useStore();
    const gunSonu = ref(null);
    const firmaData = ref("YOY");
    const gunSonuTarih = ref("Gun Sonu");
    const fieldSetCollapse=ref(false)

    onBeforeUpdate(() => {
      gunSonu.value = gunSonuData();
      if(gunSonu.value.length>1) fieldSetCollapse.value=true;
      //getFirmaDataTask.perform();
      firmaData.value = getFirmaData();
    });


    const dataService = new DataService();

    const getSonGunSonuTask = useTask(function* () {
      
      // let datetime = new Date();
      // datetime.setDate(datetime.getDate() - 1);
      // datetime = datetime.toLocaleString();
      // let tar1 = datetime.split(" ")[0];
      // const [year, month, day] = [...tar1.split(".")];
      // tar1 = day + "-" + month + "-" + year; ////"yyyy-mm-dd HH:MM:ss"

      let userFirmaId = getUserFirmaId(); // '46'

      const sorgu = {
        tar1: null,
        tar2: null,
        user: userFirmaId, //'46',
      };

      //console.log("sorgu:", userFirmaId);

      const result = yield dataService.getSonGunSonu(sorgu);

      store.dispatch("DataModule/setGunSonu", JSON.parse(result.data)).then(() => {});

      // gunSonu.value = JSON.parse(result.data);
      //console.log("Task :" + JSON.parse(result.data));
      return JSON.parse(result.data);
    });

    getSonGunSonuTask.perform().drop;

    function anlikTarihSaat(){
      let datetime = new Date();
      datetime = datetime.toLocaleString();  //29.04.2021 09:25:17
      let tar1 = datetime.split(" ")[0];
      let zaman= datetime.split(" ")[1];

      const [year, month, day] = [...tar1.split(".")];
      tar1 = day + "-" + month + "-" + year;  // bu şekilde : "yyyy-mm-dd HH:MM:ss" şeklinde oluyor...

      
      return ('Günlük Durum : '+ tar1 +' '+zaman);

    }

    function gunSonuData() {
      if (!getSonGunSonuTask.isRunning) {
        const value = computed(() => store.state.DataModule.sonGunSonu).value;

      //  console.log("VALUE...:" + (value[0].sonGunSonu));

        if (value !== undefined || value !== null) {
         // gunSonuTarih.value = "Gun Sonu : " + value.sonGunSonu.tarih;
          return value;
        }
      }
      return "...";
    }

    function getUserFirmaId() {
      const storeUser = computed(() => store.state.UserModule.user).value;
      if (storeUser.firmaWebId !== null) return storeUser.firmaWebId;
      //return '46';
    }

    function getFirmaData() {
      const data = [];
      try {
        data.value = computed(() => store.state.UserModule.firma).value;
        //console.log("dash board firma Data:", data.data);

        if (data.value !== null) {
          //console.log("getFirmaData : ", JSON.parse(data.value.data));
          return JSON.parse(data.value.data);
        } else return "YOYOY";
      } catch (error) {
        console.log("dash board firma", error);
      }

      //return '46';
    }

    function onClickAyrintiGunSonu(index) {
      //console.log("index:" + index);
      localStorage.setItem('ayrintiIndex',index)
      localStorage.setItem('GunSonuTip','SonGunSonu');
      router.push({ name: "gunsonuayrinti", params: { index: index,tip:'SonGunSonu'}} );
    }

    function onClickAnlikGunSonuAyrinti(index){
      localStorage.setItem('ayrintiIndex',index)
      localStorage.setItem('GunSonuTip','AnlikGunSonu');
      router.push({ name: "gunsonuayrinti", params: { index: index,tip:'AnlikGunSonu'}});
    }

    return {
      gunSonu,
      getUserFirmaId,
      gunSonuData,
      getSonGunSonuTask,
      gunSonuTarih,
      onClickAyrintiGunSonu,
      onClickAnlikGunSonuAyrinti,
      getFirmaData,
      firmaData,
      anlikTarihSaat,
      fieldSetCollapse
      // getFirmaDataTask,
    };
  },
};
</script>

<style lang="scss" scoped>
p-fieldset-legend{
  font-size: 2rem;
}
 
</style>




