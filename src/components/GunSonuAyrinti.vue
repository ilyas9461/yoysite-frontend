<template>
  <div class="card" v-if="!getSonGunSonuDetayTask.isRunning">
    <DataView
      :value="gunSonuData"
      :layout="layout"
      :paginator="true"
      :rows="10"
    >
      <template #header>
        <div class="p-grid p-nogutter header">
          <div class="p-col-9" style="text-align: left">
            <div class="p-d-flex p-mb-1 p-text-bold">
              <div class="view-header p-mr-1" v-if=" propsTip">Gun Sonu: {{ firmaData() }}</div>
              <div class="view-header p-mr-1" v-else>Günlük Durum: {{ firmaData() }}</div>
              <div class="view-header p-mr-1">{{ kasiyer }}</div>
              <div class="view-header p-mr-1">{{ gunSonuTarih }}</div>
            </div>
          </div>
          <div class="p-col-3" style="text-align: right">
            <DataViewLayoutOptions v-model="layout" />
          </div>
        </div>
      </template>

      <template #list="slotProps">
        <div class="p-col-12">
          <div :class="rowClasslistColor(slotProps.data.name)">
            <div class="product-list-detail">
              <div :class="cursorPointer(slotProps.data.name)" @click="onClick">
                {{ slotProps.data.name }}
                <!-- @click="onClick(slotProps.data.name)"  -->
              </div>
              <!-- style="cursor: pointer" -->
            </div>
            <div class="product-list-action">
              <span class="product-price">{{ slotProps.data.deger }} TL</span>
            </div>
          </div>
        </div>
      </template>

      <template #grid="slotProps">
        <div class="p-col-12 p-md-4">
          <div :class="rowClassGridColor(slotProps.data.name)">
            <div class="product-grid-item-content">
              <div
                class="product-name"
                :class="cursorPointer(slotProps.data.name)"
                @click="onClick"
              >
                {{ slotProps.data.name }}
              </div>
            </div>
            <div class="product-grid-item-bottom">
              <span class="product-price">{{ slotProps.data.deger }} TL</span>
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <div style="font-weight: bold; font-size: 20px">
          No records found...
        </div>
      </template>
    </DataView>
    <template>
      <Toast />

      <OverlayPanel
        ref="op"
        appendTo="body"
        :showCloseIcon="true"
        id="overlay_panel"
        :breakpoints="{ '960px': '75vw' }"
        style="width: 50%"
      >
        <GunSonuAyrintiDetay :ayrinti="ayrinti" :data="ayrintiData" />
      </OverlayPanel>
    </template>
  </div>
  <div v-else class="card" style="text-align:center">
    <span class="pi pi-spin pi-spinner" style="fontSize: 2.5rem"></span> 
    <span style="fontSize: 1.5rem"> Yükleniyor...</span>
  </div>
</template>

<script>
import GunSonuAyrintiDetay from "./GunSonuAyrintiDetay.vue";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useTask } from "vue-concurrency";
import DataService from "../service/DataService";

export default {
  components: { GunSonuAyrintiDetay },
  props: {
    index: { type: String, default: "0" },
    tip: { type: String, default: localStorage.getItem('GunSonuTip')},
  },
  setup(props) {
    console.log("Ayrinti index :", props.index, props.tip);

    const store = useStore();
    const gunSonuTarih = ref("Gun Sonu");
    const kasiyer = ref("");
    const gunSonuData = ref();
    const layout = ref("list"); //grid list
    const ayrinti = ref("");
    const ayrintiData = ref();
    const gunSonuCiroAyrinti = ref();
    const gunSonuMasrafAyrinti = ref();
    const gunSonuBankaEldenAyrinti = ref();
    const propsTip=ref();
        // const toast = useToast();
    const op = ref();

    onMounted(() => {
      gunSonuData.value = gunSonu().data;
    });

    function onClick(event) {
      const rowName = event.target.textContent;
      if (
        rowName === "Masraf" ||
        rowName === "Günlük Ciro" ||
        rowName === "Banka/Elden"
      ) {
        op.value.toggle(event);

        ayrinti.value = rowName;

        if (rowName === "Günlük Ciro")
          ayrintiData.value = gunSonuCiroAyrinti.value;
        if (rowName === "Masraf")
          ayrintiData.value = gunSonuMasrafAyrinti.value;
        if (rowName === "Banka/Elden")
          ayrintiData.value = gunSonuBankaEldenAyrinti.value;

        //console.log("Row Name : ", rowName);
        //console.log(op.value);
      }
    }
    function cursorPointer(rowName) {
      return [
        {
          "cursor-pointer":
            rowName === "Masraf" ||
            rowName === "Günlük Ciro" ||
            rowName === "Banka/Elden",
        },
      ];
    }

    function rowClasslistColor(rowName) {
      return [
        {
          "row-list-color":
            rowName === "Günlük Ciro" ||
            rowName === "Kasa" ||
            rowName === "Fark",
          "product-list-item":
            rowName !== "Günlük Ciro" &&
            rowName !== "Kasa" &&
            rowName !== "Fark",
        },
      ];
    }
    function rowClassGridColor(rowName) {
      return [
        {
          "row-grid-color card":
            rowName === "Günlük Ciro" ||
            rowName === "Kasa" ||
            rowName === "Fark",
          "product-grid-item card":
            rowName !== "Günlük Ciro" &&
            rowName !== "Kasa" &&
            rowName !== "Fark",
        },
      ];
    }
    function firmaData() {
      const data = [];
      const valueIndex = Number(props.index);
      try {
        data.value = computed(() => store.state.UserModule.firma).value;
        if (data.value !== null) {
          //console.log("getFirmaData : ", JSON.parse(data.value.data));
          return JSON.parse(data.value.data)[valueIndex].firma_adi;
        } else return "YOYOY";
      } catch (error) {
        console.log("dash board firma", error);
      }
    }

    function gunSonu() {
      //const value = computed(() => store.state.DataModule.sonGunSonu).value;
      let objGunSonu = {};
      const valueIndex = localStorage.getItem("ayrintiIndex"); //Number(props.index);
      let value = JSON.parse(localStorage.getItem("sonGunSonu"));
      value = JSON.parse(value);

      const rowName = [
        "Toplam Satış",
        "Toplam İşlem",
        "Günlük Ciro",
        "Kasa Nakit Para",
        "Kredi Kartı",
        "Masraf",
        "Banka/Elden",
        "Kasa",
        "Devreden",
        "Fark",
        "Kasiyer",
      ];

      console.log("AYRINTI VALUE...:", value); // +valueIndex,(localGunSonu));
      // console.log(value, rowName[Number(valueIndex)]);

      if (value !== undefined || value !== null) {
        if (props.tip === "SonGunSonu") {
          gunSonuTarih.value = value[valueIndex].sonGunSonu.tarih;
          kasiyer.value = value[valueIndex].sonGunSonu.kasiyer_devreden;
          objGunSonu = {
            data: [
              {
                name: rowName[0],
                deger: value[valueIndex].sonGunSonu.toplam_satis,
              },
              {
                name: rowName[1],
                deger: value[valueIndex].sonGunSonu.toplam_islem,
              },
              {
                name: rowName[2],
                deger: value[valueIndex].sonGunSonu.toplam_ciro,
              },
              {
                name: rowName[3],
                deger: value[valueIndex].sonGunSonu.nakit_para_tutar,
              },
              {
                name: rowName[4],
                deger: value[valueIndex].sonGunSonu.kredi_karti_tutar,
              },
              {
                name: rowName[5],
                deger: value[valueIndex].sonGunSonu.masraf_tutar,
              },
              {
                name: rowName[6],
                deger: value[valueIndex].sonGunSonu.banka_tutar,
              },
              {
                name: rowName[7],
                deger: value[valueIndex].sonGunSonu.gunluk_kasa,
              },
              {
                name: rowName[8],
                deger: value[valueIndex].sonGunSonu.devreden_miktar,
              },
              { name: rowName[9], deger: value[valueIndex].sonGunSonu.fark },
            ],
          };
        }
        if (props.tip === "AnlikGunSonu") {
          let time=new Date().toLocaleTimeString();

          gunSonuTarih.value = value[valueIndex].anlikGunSonu.tarih + " "+ time;
          kasiyer.value = value[valueIndex].anlikGunSonu.kasiyer;
          objGunSonu = {
            data: [
              {
                name: rowName[0],
                deger: value[valueIndex].anlikGunSonu.toplam_satis,
              },
              {
                name: rowName[1],
                deger: value[valueIndex].anlikGunSonu.toplam_islem,
              },
              {
                name: rowName[2],
                deger: value[valueIndex].anlikGunSonu.toplam_ciro,
              },
              {
                name: rowName[3],
                deger: value[valueIndex].anlikGunSonu.nakit_para_tutar,
              },
              {
                name: rowName[4],
                deger: value[valueIndex].anlikGunSonu.kredi_karti_tutar,
              },
              {
                name: rowName[5],
                deger: value[valueIndex].anlikGunSonu.masraf_tutar,
              },
              {
                name: rowName[6],
                deger: value[valueIndex].anlikGunSonu.banka_tutar,
              },
              {
                name: rowName[7],
                deger: value[valueIndex].anlikGunSonu.gunluk_kasa,
              },
              // { name: rowName[8], deger: value[valueIndex].anlikGunSonu.tarih },
              // { name: rowName[9], deger: value[valueIndex].anlikGunSonu.kasiyer}
            ],
          };
        }

        return objGunSonu;
      }

      return "...";
    }

    function getUserFirmaId() {
      const storeUser = computed(() => store.state.UserModule.user).value;
      // console.log(" getUserFirmaId() : ", storeUser);
      if (storeUser.firmaWebId !== null) return storeUser.firmaWebId;
    }
    function getSonGunSonuTarih() {
      let gunSonu = computed(() => store.state.DataModule.sonGunSonu).value;

      if (gunSonu !== "") {
        return gunSonu[Number(props.index)].sonGunSonu.tarih;
      } else {
        gunSonu = JSON.parse(localStorage.getItem("sonGunSonu"));
        gunSonu = JSON.parse(gunSonu);
        return gunSonu[Number(props.index)].sonGunSonu.tarih;
      }
    }

    function anlikTarihSaat() {
      let datetime = new Date();
      datetime = datetime.toLocaleString(); //29.04.2021 09:25:17
      let tar1 = datetime.split(" ")[0];
      let zaman = datetime.split(" ")[1];

      const [year, month, day] = [...tar1.split(".")];
      tar1 = day + "-" + month + "-" + year; // bu şekilde : "yyyy-mm-dd HH:MM:ss" şeklinde oluyor...

      return tar1 + " " + zaman;
    }

    const dataService = new DataService();

    const getSonGunSonuDetayTask = useTask(function*() {
      let firma = getUserFirmaId().split(",")[Number(props.index)];

      let sorgu = {};

      if (props.tip === "SonGunSonu") {
        propsTip.value=true;
        sorgu = {
          tar: getSonGunSonuTarih(),
          user: firma, //'46',
        };
      }
      if (props.tip === "AnlikGunSonu") {
        propsTip.value=false;
        sorgu = {
          tar: anlikTarihSaat(),
          user: firma, //'46',
        };
      }

      console.log("sorgu : ", sorgu);

      let result = yield dataService.getGunlukCiroDetay(sorgu);
      console.log("getGunlukCiroDetay : ", result.data);
      gunSonuCiroAyrinti.value = result.data;

      result = yield dataService.getGunlukMasrafDetay(sorgu);
      //console.log('Masraf : ',result.data);
      gunSonuMasrafAyrinti.value = result;

      result = yield dataService.getGunlukBankaDetay(sorgu);
      //console.log('Banka : ',result.data);
      gunSonuBankaEldenAyrinti.value = result;
    });

    getSonGunSonuDetayTask.perform();

    // console.log(getUserFirmaId());
    // console.log(getSonGunSonuTarih());

    return {
      layout,
      gunSonu,
      gunSonuTarih,
      kasiyer,
      rowClasslistColor,
      rowClassGridColor,
      gunSonuData,
      firmaData,
      cursorPointer,
      onClick,
      op,
      ayrinti,
      getUserFirmaId,
      getSonGunSonuTarih,
      getSonGunSonuDetayTask,
      ayrintiData,
      anlikTarihSaat,
      propsTip,
      // toggle,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  background: #ffffff;
  padding: 1rem;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  margin-bottom: 0rem;
  margin-top: 0px;
}
.cursor-pointer {
  text-decoration-line: underline;
  cursor: pointer;
}
.view-header {
  color: rgb(66, 70, 80);
  font-weight: bold;
  font-size: 1.5rem;
  border: cadetblue solid 1px;
  padding: 5px;
}

::v-deep(.row-list-color) {
  display: flex;
  align-items: center;
  padding: 1rem;
  width: 100%;

  background-color: lightsteelblue;
  font-size: 1.5rem;
  font-weight: 700;
  color: black;

  img {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    margin-right: 2rem;
  }

  .product-list-detail {
    flex: 1 1 0;
  }
  .product-price {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    align-self: flex-end;
    color: black;
  }

  .product-list-action {
    display: flex;
    flex-direction: column;
  }
}

::v-deep(.product-list-item) {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  width: 100%;
  font-size: 1.2rem;
  font-weight: 700;

  img {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    margin-right: 2rem;
  }

  .product-list-detail {
    flex: 1 1 0;
    // background-color: lightgreen;
  }

  .product-price {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    align-self: flex-end;
    color: coral;
  }

  .product-list-action {
    display: flex;
    flex-direction: column;
  }
}

::v-deep(.row-grid-color) {
  margin: 0.5rem;
  border: 1px solid #dee2e6;
  font-size: 1.5rem;
  font-weight: 700;

  background-color: lightsteelblue;
  color: black;

  .product-grid-item-top,
  .product-grid-item-bottom {
    // display: flex;
    align-items: right;
    // justify-content: space-between;
    text-align: right;
  }

  img {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    margin: 2rem 0;
  }

  .product-grid-item-content {
    text-align: center;
  }

  .product-price {
    font-size: 1.5rem;
    font-weight: bold;
    color: black;
  }
}

::v-deep(.product-grid-item) {
  margin: 0.5rem;
  border: 1px solid #dee2e6;
  font-size: 1.5rem;
  font-weight: 700;

  .product-grid-item-top,
  .product-grid-item-bottom {
    // display: flex;
    align-items: right;
    // justify-content: space-between;
    text-align: right;
  }

  img {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    margin: 2rem 0;
  }

  .product-grid-item-content {
    text-align: center;
  }

  .product-price {
    font-size: 1.5rem;
    font-weight: 600;
    color: coral;
  }
}
.product-list-item {
  padding: 0.25rem;
}

@media screen and (max-width: 576px) {
  .view-header {
    font-size: 1.1rem;
    padding: 1px;
    margin: 1px;
  }
  .product-list-item {
    flex-direction: column;
    align-items: center;

    img {
      margin: 2rem 0;
    }

    .product-list-detail {
      text-align: center;
    }

    .product-price {
      align-self: center;
    }

    .product-list-action {
      display: flex;
      flex-direction: column;
    }

    .product-list-action {
      margin-top: 1rem;
      flex-direction: row;
      justify-content: flex-end;
      align-items: right;
      text-align: left;
      width: 100%;
    }
  }
}
</style>
