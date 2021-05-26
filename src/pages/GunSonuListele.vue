<template>
  <div class="p-grid crud-demo">
    <div class="p-col-12">
      <div class="card">
        <Toast />
        <Toolbar class="p-mb-4">
          <template v-slot:left>
            <Button
              label="Liste"
              icon="pi pi-plus"
              @click="toggle"
              aria:haspopup="true"
              aria-controls="overlay_panel"
              class="p-mr-2"
            />

            <OverlayPanel
              ref="op"
              appendTo="body"
              :showCloseIcon="false"
              id="overlay_panel"
              :breakpoints="{ '960px': '50vw' }"
              style="width:30%"
            >
              <div class="card">
                <div class="p-d-block">
                  <InputText
                    v-model.number="aylar[(Number(aySlider)/10)-1]"
                    class=" p-mt-3 p-ml-4"
                    style="font-weight:bold;"
                  />
                  <Slider
                    Slider
                    v-model="aySlider"
                    :step="10"
                    :min="10"
                    :max="120"
                    class=" p-mt-3 p-ml-4"
                  />
                  <!-- <SplitButton
                    :label="baslikAy"
                    icon="pi pi-list"
                    :model="itemsSplitButon"
                    class="p-button-secondary p-mt-3 p-ml-4 "
                  ></SplitButton> -->
                </div>
                <div class="p-d-block">
                  <Dropdown
                    class="p-mt-3  p-ml-4"
                    v-model="selectedIsletme"
                    :options="itemsDropDownIsletme"
                    optionLabel="name"
                    placeholder="İşletme"
                    @change="onChangeIsletme()"
                    style="font-weight:bold"
                  />
                </div>
                <div class="p-d-block">
                  <Dropdown
                    class="p-mt-3  p-ml-4"
                    v-model="selectedIslem"
                    :options="itemsDropDownIslem"
                    optionLabel="name"
                    placeholder="İşlem"
                    @change="onChangeIslem()"
                    style="font-weight:bold"
                  />
                </div>
              </div>
              <div class="p-d-flex btn-alan" >
                <div class="p-buttonset p-d-block p-mx-auto ">
                  <Button
                    label="Tamam"
                    icon="pi pi-check"
                    class="p-button-raised p-button-text p-button-plain p-text-bold p-mr-4 "
                    @click="onClickTamam()"
                  />
                  <Button
                    label="İptal"
                    icon="pi pi-times"
                    class="p-button-raised p-button-text p-button-plain p-text-bold"
                    @click="onClickTamam()"
                  />
                </div>
              </div>

            </OverlayPanel>
          </template>

          <template v-slot:right>
            <SplitButton
              label="Dışa Aktar"
              icon="pi pi-upload"
              :model="itemsExportSplitButton"
              class="p-button-secondary"
            ></SplitButton>
            <vue-excel-xlsx
              ref="excelComp"
              v-if="dt != null"
              :data="gunSonuTableData"
              :columns="dataTableColumns"
              :filename="selectedIsletme.name"
              :sheetname="'Sayfa1'"
            >
            </vue-excel-xlsx>
          </template>
        </Toolbar>
        <!-- gunSonuData[gunSonuDataIndex] -->
        <!-- :exportFilename="selectedIsletme.name" -->
        <DataTable
          ref="dt"
          :value="gunSonuTableData"
          selectionMode="single"
          :paginator="true"
          :rows="10"
          responsiveLayout="scroll"
          :rowHover="true"
          v-if="!getAylikGunSonuTask.isRunning"
          :loading="getAylikGunSonuTask.isRunning"
        >
          <template #loading>
            Yükleniyor ...
          </template>
          <template #empty>
            Kayit bulunamadi !
          </template>
          <template #header>
            <div class="table-header p-d-flex p-flex-column p-flex-md-row p-jc-md-between">
              <h5
                class="p-mb-2 p-m-md-0 p-as-md-center"
                style="font-weight:bold"
              >
                {{ selectedIsletme.name }} {{ baslikAy }} Ayı {{selectedIslem.name}} Listesi
              </h5>
            </div>
          </template>
          <Column
            v-for="col of dataTableColumns"
            :field="col.field"
            :header="col.header"
            :key="col.field"
            headerStyle="font-weight:bold;"
          ></Column>
        </DataTable>
        <!-- toplamlar -->
        <div class="card">
          <DataTable
            :value="listeToplam()"
            selectionMode="single"
            :rows="2"
            responsiveLayout="scroll"
            :rowHover="true"
            v-if="!getAylikGunSonuTask.isRunning"
            :loading="getAylikGunSonuTask.isRunning"
            style="width=100%"
          >
            <template #loading>
              Yükleniyor ...
            </template>
            <template #empty>
              Kayit bulunamadi !
            </template>
            <template #header>
              <div class="table-header p-d-flex p-flex-column p-flex-md-row p-jc-md-between">
                <h5
                  class="p-mb-2 p-m-md-0 p-as-md-center"
                  style="font-weight:bold"
                >
                  {{ selectedIsletme.name }} {{ baslikAy }} {{selectedIslem.name}} Aylık Toplamlar
                </h5>
              </div>
            </template>
            <Column
              v-for="col of dataTableColumns"
              :field="col.field"
              :header="col.header"
              :key="col.field"
              headerStyle="font-weight:bold;"
              style="font-weight:bold;"
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useTask } from "vue-concurrency";
import DataService from "../service/DataService";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const toast = useToast();

    const aySlider = ref((new Date().getMonth() + 1) * 10);
    const excelComp = ref();
    const baslikAy = ref();
    const ayIndex = ref(new Date().getMonth());
    const aylar = [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık"
    ];
    const itemsExportSplitButton = ref([
      {
        label: "EXCEL-xlsx",
        icon: "pi pi-file-excel",
        command: () => {
          toast.add({
            severity: "success",
            summary: "Excel ==> .xlsx",
            detail: "Tablo verisi indiriliyor",
            life: 3000
          });
          excelComp.value.exportExcel();
        }
      },
      {
        label: "EXCEL-csv",
        icon: "pi pi-file-excel",
        command: () => {
          toast.add({
            severity: "success",
            summary: "Excel ==> .csv ",
            detail: "Tablo verisi indiriliyor",
            life: 3000
          });
          exportCSV();
        }
      },
      {
        label: "PDF",
        icon: "pi pi-file-pdf",
        command: () => {
          toast.add({
            severity: "success",
            summary: "Pdf oluşturuldu",
            detail: "Tablo verisi indiriliyor ???",
            life: 3000
          });
          //exportCSV();
        }
      }
    ]);
    const itemsSplitButon = ref([
      {
        label: "Ocak",
        command: () => {
          baslikAy.value = aylar[0];
          ayIndex.value = 0;
        }
      },
      {
        label: "Şubat",
        command: () => {
          baslikAy.value = aylar[1];
          ayIndex.value = 1;
        }
      },
      {
        label: "Mart",
        command: () => {
          baslikAy.value = aylar[2];
          ayIndex.value = 2;
        }
      },
      {
        label: "Nisan",
        command: () => {
          baslikAy.value = aylar[3];
          ayIndex.value = 3;
        }
      },
      {
        label: "Mayıs",
        command: () => {
          baslikAy.value = aylar[4];
          ayIndex.value = 4;
        }
      },
      {
        label: "Haziran",
        command: () => {
          baslikAy.value = aylar[5];
          ayIndex.value = 5;
        }
      },
      {
        label: "Temmuz",
        command: () => {
          baslikAy.value = aylar[6];
          ayIndex.value = 6;
        }
      },
      {
        label: "Ağustos",
        command: () => {
          baslikAy.value = aylar[7];
          ayIndex.value = 7;
        }
      },
      {
        label: "Eylül",
        command: () => {
          baslikAy.value = aylar[8];
          ayIndex.value = 8;
        }
      },
      {
        label: "Ekim",
        command: () => {
          baslikAy.value = aylar[9];
          ayIndex.value = 9;
        }
      },
      {
        label: "Kasım",
        command: () => {
          toast.add({
            severity: "success",
            summary: aylar[10] + " Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000
          });
          baslikAy.value = aylar[10];
          ayIndex.value = 10;
        }
      },
      {
        label: "Aralık",
        command: () => {
          baslikAy.value = aylar[11];
          ayIndex.value = 11;
        }
      }
    ]);

    const selectedIsletme = ref();
    const itemsDropDownIsletme = ref([]);

    const selectedIslem = ref({ name: "Gun Sonu" });
    const itemsDropDownIslem = ref([
      { name: "Gun Sonu" },
      { name: "Masraf" },
      { name: "Banka Elden" }
    ]);

    const dataTableColumns = ref([]);
    const dataTableColumnsGunSonu = [
      { field: "toplam_satis", header: "Satış", label: "Satış" }, //label tabloyu excel e aktarırken sutun başlıkları için
      { field: "toplam_islem", header: "İşlem", label: "İşlem" },
      { field: "toplam_ciro", header: "Ciro", label: "Ciro" },
      { field: "nakit_para_tutar", header: "Kasa Nakit", label: "Kasa Nakit" },
      { field: "kredi_karti_tutar", header: "KKartı", label: "KKartı" },
      { field: "banka_tutar", header: "Banka/Elden", label: "Banka/Elden" },
      { field: "masraf_tutar", header: "Masraf", label: "Masraf" },
      { field: "gunluk_kasa", header: "Gunluk Kasa", label: "Gunluk Kasa" },
      { field: "devreden_miktar", header: "Devir", label: "Devir" },
      { field: "fark", header: "Fark", label: "Fark" },
      { field: "tarih", header: "Tarih", label: "Tarih" },
      { field: "kasiyer_devreden", header: "Kasiyer", label: "Kasiyer" },
      { field: "varsa_not", header: "Not", label: "Not" }
    ];
    const dataTableColumnsMasraf = [
      { field: "cikis_adi", header: "Çıkış Adı", label: "Çıkış Adı" }, //label tabloyu excel e aktarırken sutun başlıkları için
      { field: "cesit", header: "Çıkış Çeşidi", label: "Çıkış Çeşidi" },
      { field: "cikis_tutar", header: "Tutar", label: "Tutar" },
      { field: "tarih_zaman", header: "Tarih", label: "Tarih" },
      { field: "islem_not", header: "İşlem Not", label: "İşlem Not" }
    ];
    const dataTableColumnsBankaElden = [
      { field: "cikis_adi", header: "Çıkış Adı", label: "Çıkış Adı" }, //label tabloyu excel e aktarırken sutun başlıkları için
      { field: "cikis_tutar", header: "Tutar", label: "Tutar" },
      { field: "banka_adi", header: "Banka Adı", label: "Banka Adı" },
      { field: "tarih_zaman", header: "Tarih", label: "Tarih" },
      { field: "islem_not", header: "İşlem Not", label: "İşlem Not" }
    ];

    const overlayOn = ref(false);
    const op = ref();
    const toggle = event => {
      if (!overlayOn.value) {
        selectedIsletme.value = {};
        selectedIslem.value = {};
        overlayOn.value = true;
      }

      op.value.toggle(event);
    };

    const onClickTamam = () => {
      if (
        dataService.isEmptyObj(selectedIslem.value) ||
        dataService.isEmptyObj(selectedIsletme.value)
      ) {
        toast.add({
          severity: "info",
          summary: "Eksik Veri",
          detail: "Hatalı veya eksik veri girişi",
          life: 3000
        });
      } else {
        getAylikGunSonuTask.perform();
        toggle();
        overlayOn.value = false;
      }

      //  op.value.toggle(event);
    };

    const dataService = new DataService();
    const gunSonuData = ref();
    const gunSonuTableData = ref();

    let dropDownDataIndexIsletme = ref(0);
    let dropDownDataIndexIslem = ref(0);

    const dt = ref(); // elemanın ref özelliğinde belirtilir.
    const exportCSV = () => {
      dt.value.exportCSV();
      //console.log("export dt value: ", dt);
    };

    function getUserFirmaId() {
      const storeUser = computed(() => store.state.UserModule.user).value;
      //console.log(" getUserFirmaId() : ", storeUser);
      if (storeUser.firmaWebId !== null) return storeUser.firmaWebId;
    }
    function getUserFirmaAdi() {
      let firmaAdi = [];
      let storeUser = computed(() => store.state.UserModule.firma).value;
      storeUser = JSON.parse(storeUser.data);
      //console.log(" getUserFirmaAdi() : ", storeUser);
      //  console.log(" FirmaAdi : ", storeUser[0].firma_adi);
      storeUser.forEach(element => {
        firmaAdi.push(element.firma_adi);
      });

      //console.log(" FirmaAdi : ", firmaAdi);

      if (storeUser.firma_adi !== null)
        // return storeUser[0].firma_adi;
        return firmaAdi;
    }

    function onChangeIsletme() {
      //drop down change
      dropDownDataIndexIsletme = itemsDropDownIsletme.value.findIndex(
        isletme => isletme.name === selectedIsletme.value.name
      );
      selectedIsletme.value =
        itemsDropDownIsletme.value[dropDownDataIndexIsletme];
      // gunSonuTableData.value = gunSonuData.value[dropDownDataIndexIsletme];
    }
    function onChangeIslem() {
      dropDownDataIndexIslem = itemsDropDownIslem.value.findIndex(
        islem => islem.name === selectedIslem.value.name
      );

      selectedIslem.value = itemsDropDownIslem.value[dropDownDataIndexIslem];
      // console.log("change :", dropDownDataIndexIslem, selectedIslem.value);
    }

    let firstRun = ref(false);

    function ayTarihOlustur(ayArrIndex) {
      let datetime = new Date();

      datetime = datetime.toLocaleString();
      // console.log(datetime); //17.05.2021 11:20:04
      let tar1 = datetime.split(" ")[0];
      let [day, month, year] = [...tar1.split(".")];

      month = Number(ayArrIndex) + 1;
      tar1 = year + "-" + month + "-" + "01"; ////"yyyy-mm-dd HH:MM:ss"
      baslikAy.value = aylar[Number(month) - 1];

      let tar2 = day;
      let ay = (Number(month) + 1).toString();
      if (ay <= "9") ay = "0" + ay;

      tar2 = year + "-" + ay + "-" + "01";

      let userFirmaId = getUserFirmaId(); // '46'
      let firma = "";
      //console.log("local firma Id :", userFirmaId);

      let isletmeAdi = getUserFirmaAdi();

      itemsDropDownIsletme.value = [];
      isletmeAdi.forEach(isletme => {
        let obj = { name: isletme };
        itemsDropDownIsletme.value.push(obj);
      });
      // itemsDropDownIsletme.value = [{ name: isletmeAdi }];
      //selectedIsletme.value = itemsDropDownIsletme.value[0];
      if (!firstRun.value) {
        selectedIsletme.value = itemsDropDownIsletme.value[0];

        if (userFirmaId.length > 1) {
          firma = userFirmaId.split(",")[0];
        } else {
          firma = userFirmaId;
        }
        firstRun.value = true;
      } else {
        if (userFirmaId.length > 1) {
          firma = userFirmaId.split(",")[dropDownDataIndexIsletme];
        } else {
          firma = userFirmaId;
        }
      }
      // console.log( "selectedIsletme.value=",itemsDropDownIsletme.value[0].name);

      const sorgu = {
        tar1: tar1,
        tar2: tar2,
        firma: firma, //'46',
        islem: selectedIslem.value.name
      };
      //console.log('liste Local :',localStorage.getItem("firma"));
      //console.log("getAylikGunSonuTask sorgu:", sorgu, year);
      return sorgu;
    }

    let sorgu = {};

    const getAylikGunSonuTask = useTask(function*() {
      ayIndex.value = aySlider.value / 10 - 1;
      sorgu = ayTarihOlustur(ayIndex.value);

      dataTableColumns.value = [];
      switch (sorgu.islem) {
        case "Gun Sonu":
          dataTableColumns.value = dataTableColumnsGunSonu;
          break;
        case "Masraf":
          dataTableColumns.value = dataTableColumnsMasraf;
          break;
        case "Banka Elden":
          dataTableColumns.value = dataTableColumnsBankaElden;
          break;
      }

      const result = yield dataService.getTarihliListe(sorgu);

      //const result = yield dataService.getAylikGunSonu(sorgu);
      // console.log("Task :",sorgu,result);

      gunSonuData.value = JSON.parse(result);
      //console.log("Task :" + gunSonuData.value[0]);

      if (gunSonuData.value === null || gunSonuData.value === undefined) {
        console.log("Hata : " + "veri yok");
      }

      gunSonuTableData.value = gunSonuData.value;

      //return JSON.parse(result);
    });

    function gunSonuToplam() {
      let toplam = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let x = 0;
      let tar1, tar2;

      // multiAxisData.value.datasets[0].data = [];
      // multiAxisData.value.datasets[1].data = [];
      // multiAxisData.value.datasets[2].data = [];
      // chartXaxisLabel.value = [];

      try {
        gunSonuTableData.value.forEach(gunSonu => {
          toplam[0] += gunSonu.toplam_satis;
          toplam[1] += gunSonu.toplam_islem;
          toplam[2] += gunSonu.toplam_ciro;

          toplam[3] += gunSonu.nakit_para_tutar;
          toplam[4] += gunSonu.kredi_karti_tutar;
          toplam[5] += gunSonu.banka_tutar;

          toplam[6] += gunSonu.masraf_tutar;
          toplam[7] += gunSonu.gunluk_kasa;
          toplam[8] += gunSonu.devreden_miktar;

          toplam[9] += gunSonu.fark;

          // multiAxisData.value.datasets[0].data.push(gunSonu.toplam_ciro);
          // multiAxisData.value.datasets[1].data.push(gunSonu.masraf_tutar);
          // multiAxisData.value.datasets[2].data.push(gunSonu.banka_tutar);
          // chartXaxisLabel.value.push(gunSonu.tarih.split(" ")[0]);

          x++;
        });

        tar1 = gunSonuTableData.value[0].tarih;
        tar2 = gunSonuTableData.value[x - 1].tarih;
        let retVal = [
          {
            toplam_satis: toplam[0],
            toplam_islem: toplam[1],
            toplam_ciro: toplam[2],

            nakit_para_tutar: toplam[3],
            kredi_karti_tutar: toplam[4],
            banka_tutar: toplam[5],

            masraf_tutar: toplam[6],
            gunluk_kasa: toplam[7],
            devreden_miktar: toplam[8],

            fark: toplam[9],

            tarih: tar1 + " => " + tar2,

            id: 14,
            firma_web_id: "",
            islem_tur: "GUN SONU",
            kasiyer_devralan: "...",
            kasiyer_devreden: "...",
            picc_stok: "",
            varsa_not: "...",
            web_kayit: 1
          }
        ];

        // console.log("toplama :",  chartXaxisLabel.value);

        return retVal;
      } catch (error) {
        console.log("Hata : ", error);
        return null;
      }

      //console.log(tar1, tar2);
    }

    function masrafToplam() {
      let toplam = 0;
      let x = 0;
      let tar1, tar2;
      // multiAxisData.value.datasets[0].data = [];
      // multiAxisData.value.datasets[1].data = [];
      // multiAxisData.value.datasets[2].data = [];
      // chartXaxisLabel.value = [];
      try {
        gunSonuTableData.value.forEach(gunSonu => {
          toplam += gunSonu.cikis_tutar;

          // multiAxisData.value.datasets[1].data.push(gunSonu.cikis_tutar);
          // chartXaxisLabel.value.push(gunSonu.tarih_zaman.split(" ")[0]);

          x++;
        });
        tar1 = gunSonuTableData.value[0].tarih_zaman;
        tar2 = gunSonuTableData.value[x - 1].tarih_zaman;
        //tar1 = tar1[0].split("-");
        //tar2 = tar2[0].split("-");

        let retVal = [
          {
            cikis_adi: "...",
            cesit: "...",
            cikis_tutar: toplam,
            tarih_zaman: tar1 + " => " + tar2,
            islem_not: "..."
          }
        ];
        //console.log("toplama :", retVal);

        return retVal;
      } catch (error) {
        console.log("Hata : ", error);
        return null;
      }
    }

    function bankaEldenToplam() {
      let toplam = 0;
      let x = 0;
      let tar1, tar2;
      // multiAxisData.value.datasets[0].data = [];
      // multiAxisData.value.datasets[1].data = [];
      // multiAxisData.value.datasets[2].data = [];
      // chartXaxisLabel.value = [];

      try {
        gunSonuTableData.value.forEach(gunSonu => {
          toplam += gunSonu.cikis_tutar;

          // multiAxisData.value.datasets[2].data.push(gunSonu.cikis_tutar);
          // chartXaxisLabel.value.push(gunSonu.tarih_zaman.split(" ")[0]);
          x++;
        });
        tar1 = gunSonuTableData.value[0].tarih_zaman;
        tar2 = gunSonuTableData.value[x - 1].tarih_zaman;
        //tar1 = tar1[0].split("-");
        //tar2 = tar2[0].split("-");

        let retVal = [
          {
            cikis_adi: "...",
            cikis_tutar: toplam,
            banka_adi: "...",
            tarih_zaman: tar1 + " => " + tar2,
            islem_not: "..."
          }
        ];
        //console.log("toplama :", retVal);

        return retVal;
      } catch (error) {
        console.log("Hata : ", error);
        return null;
      }
    }

    function listeToplam() {
      switch (sorgu.islem) {
        case "Gun Sonu":
          return gunSonuToplam();
        case "Masraf":
          return masrafToplam();
        case "Banka Elden":
          return bankaEldenToplam();
        default:
          break;
      }
    }

    getAylikGunSonuTask.perform();

    return {
      toast,
      itemsSplitButon,
      selectedIsletme,
      itemsDropDownIsletme,
      gunSonuData,
      gunSonuTableData,
      dropDownDataIndexIsletme,
      dropDownDataIndexIslem,
      getAylikGunSonuTask,
      baslikAy,
      ayIndex,
      getUserFirmaAdi,
      exportCSV,
      dt,
      dataTableColumns,
      dataTableColumnsGunSonu,
      dataTableColumnsMasraf,
      dataTableColumnsBankaElden,
      excelComp,
      itemsExportSplitButton,
      onChangeIsletme,
      onChangeIslem,
      sorgu,
      selectedIslem,
      itemsDropDownIslem,
      op,
      toggle,
      listeToplam,
      aySlider,
      aylar,
      onClickTamam,
      firstRun,
      overlayOn
    };
  } //setup
};
</script>

<style scoped lang="scss">
.accordion-custom {
  i,
  span {
    vertical-align: middle;
  }

  span {
    margin: 0 0.5rem;
  }
}

.p-dropdown {
  width: 14rem;
}
.table-header {
  display: flex;
  justify-content: space-between;
}

.product-image {
  width: 100px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 150px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-badge {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;

  &.status-instock {
    background: #c8e6c9;
    color: #256029;
  }

  &.status-outofstock {
    background: #ffcdd2;
    color: #c63737;
  }

  &.status-lowstock {
    background: #feedaf;
    color: #8a5340;
  }
}

::v-deep(.p-toolbar) {
  flex-wrap: wrap;
  .p-button {
    margin-bottom: 0.25rem;
  }
}

.btn-alan{
  background-color:lightblue;
  padding: 8px;
}
</style>
