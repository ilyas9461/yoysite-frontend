<template>
  <div class="p-grid crud-demo">
    <div class="p-col-12">
      <div class="card">
        <Toast />
        <Toolbar class="p-mb-4">
          <template v-slot:left>
            <!-- <Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" /> -->
            <Button
              label="Yeni"
              icon="pi pi-plus"
              class="p-button-success p-mr-2"
              @click="openNew"
            />
            <Button
              label="Grafik"
              icon="pi pi-chart-line"
              class="p-button-primary p-mr-2"
              @click="openChart"
            />
          </template>

          <template v-slot:right>
            <SplitButton
              label="Aktar"
              icon="pi pi-upload"
              :model="itemsExportSplitButton"
              class="p-button-secondary"
            ></SplitButton>
            <vue-excel-xlsx
              ref="excelComp"
              v-if="dt != null"
              :data="gunSonuTableData"
              :columns="dataTableColumns"
              :filename="baslik"
              :sheetname="'Sayfa1'"
            >
            </vue-excel-xlsx>
          </template>
        </Toolbar>
        <div v-if="isdataTableData">
          <div>
            <DataTable
              ref="dt"
              :value="gunSonuTableData"
              selectionMode="single"
              :paginator="true"
              :rows="10"
              responsiveLayout="scroll"
              :rowHover="true"
              :exportFilename="baslik"
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
                    {{ baslik }} Listesi
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
          </div>
          <!-- toplamlar -->
          <div class="card">
            <DataTable
              :value="listeToplam()"
              selectionMode="single"
              :rows="2"
              responsiveLayout="scroll"
              :rowHover="true"
              :loading="getAylikGunSonuTask.isRunning"
              style="width=100%"
            >
              <!-- v-if="!getAylikGunSonuTask.isRunning" -->
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
                    {{ baslik }} Listesi Toplamlar
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

        <!-- form dialog -->
        <Dialog
          v-model:visible="openDialog"
          :style="{ width: '450px' }"
          :modal="true"
          class="dialog-lys"
        >
          <template #header>
            <h3 style="font-weight:500">Tarih Alan Seçimi</h3>
          </template>
          <Card>
            <template #content>
              <div class="card p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12 p-md-4">
                  <img
                    src="..\..\public\assets\layout\images\calendar-week-icon.png"
                    :alt="takvim"
                    class="product-image"
                  />
                </div>
                <div class="p-field p-col-12 p-md-8">
                  <div class="p-field p-col-12 ">
                    <label
                      for="dateformat1"
                      class="p-ml-2 p-text-bold"
                    >Tarih 1 :</label>
                    <Calendar
                      id="dateformat1"
                      v-model="tarih1"
                      dateFormat="yy-mm-dd"
                      placeholder="Tarih 1"
                      class="p-ml-2"
                    />
                  </div>
                  <div class="p-field p-col-12 ">
                    <label
                      for="dateformat2"
                      class="p-ml-2 p-text-bold"
                    >Tarih 2 :</label>
                    <Calendar
                      id="dateformat2"
                      v-model="tarih2"
                      dateFormat="yy-mm-dd"
                      placeholder="Tarih 2"
                      class="p-ml-2"
                    />
                  </div>
                </div>

                <div class="p-field p-col-12 p-md-12">
                  <div class="p-col-12 p-mt-3">
                    <Dropdown
                      v-model="selectedIslem"
                      :options="itemsDropDownIslem"
                      optionLabel="name"
                      placeholder="İşlem Seç"
                      @change="onChangeIslem()"
                      style="font-weight:bold;width:100%"
                    />
                  </div>
                  <div class="p-col-12 p-mt-3">
                    <Dropdown
                      v-model="selectedIsletme"
                      :options="itemsDropDownIsletme"
                      optionLabel="name"
                      placeholder="İşletme"
                      @change="onChangeIsletme()"
                      style="font-weight:bold;width:100%"
                      required
                    />
                  </div>
                </div>
              </div>
            </template>
          </Card>
          <template #footer>
            <Button
              icon="pi pi-times"
              label="İptal"
              class="p-button-secondary"
              style="margin-left: .5em"
              @click="closeNew"
            />

            <Button
              icon="pi pi-check"
              label="Tamam"
              @click="getAylikGunSonuTask.perform()"
            />
          </template>
        </Dialog>

        <!-- Grafik dialog -->
        <Dialog
          v-model:visible="openDialogChart"
          :style="{ width: '75%' }"
          :modal="true"
          class="dialog-lys"
        >
          <template #header>
            <h3 style="font-weight:500">Grafik</h3>
          </template>

          <h5>Multi Axis</h5>
          <Chart
            type="line"
            :data="multiAxisData"
            :options="multiAxisOptions"
          />

          <template #footer>
            <!-- <Button
              icon="pi pi-times"
              label="İptal"
              class="p-button-secondary"
              style="margin-left: .5em"
              @click="closeNew"
            />

            <Button
              icon="pi pi-check"
              label="Tamam"
              @click="saveProduct"
            /> -->
          </template>
        </Dialog>
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

    const excelComp = ref();

    const baslikAy = ref();
    const tarih1 = ref("...");
    const tarih2 = ref("...");
    const baslik = ref("...");
    const itemsExportSplitButton = ref([
      {
        label: "EXCEL-xlsx",
        icon: "pi pi-file-excel",
        command: () => {
          if (gunSonuTableData.value.length !== 0) {
            toast.add({
              severity: "success",
              summary: "Excel ==> .xlsx",
              detail: "Tablo verisi indiriliyor",
              life: 3000
            });
            excelComp.value.exportExcel(); //komponentin 'ref' özelliğinde tanımlı olmalı
          }
        }
      },
      {
        label: "EXCEL-csv",
        icon: "pi pi-file-excel",
        command: () => {
          if (gunSonuTableData.value.length !== 0) {
            toast.add({
              severity: "success",
              summary: "Excel ==> .csv ",
              detail: "Tablo verisi indiriliyor",
              life: 3000
            });
            exportCSV();
          }
        }
      },
      {
        label: "PDF",
        icon: "pi pi-file-pdf",
        command: () => {
          if (gunSonuTableData.value.length !== 0) {
            toast.add({
              severity: "success",
              summary: "Pdf oluşturuldu",
              detail: "Tablo verisi indiriliyor ???",
              life: 3000
            });
            //exportCSV();
          }
        }
      }
    ]);
    const selectedIsletme = ref({ name: "..." });
    const itemsDropDownIsletme = ref([]);
    const selectedIslem = ref({ name: "..." });
    const itemsDropDownIslem = ref([
      { name: "Gun Sonu" },
      { name: "Masraf" },
      { name: "Banka Elden" }
    ]);

    const isdataTableData = ref(false);

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

    const dataService = new DataService();
    const gunSonuData = ref();
    let selectedDropDownIsletmeIndex = ref(0);
    let selectedDropDownIslemIndex = ref(0);
    const gunSonuTableData = ref([]);
    const openDialog = ref(false);

    const openDialogChart = ref(false);
    const chartXaxisLabel = ref([]);
    const multiAxisData = ref({
      labels: chartXaxisLabel, //["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          // 0. index
          label: "Ciro",
          fill: false,
          borderColor: "#42A5F5",
          yAxisID: "y-axis-1",
          data: [] //[65, 59, 80, 81, 56, 55, 10]
        },
        {
          // 1. index
          label: "Masraf",
          fill: false,
          borderColor: "#00bb7e",
          yAxisID: "y-axis-2",
          data: [] //[28, 48, 40, 19, 86, 27, 90]
        },
        {
          label: "Banka Elden",
          fill: false,
          borderColor: "#000000",
          yAxisID: "y-axis-3",
          data: [] //[0, 4, 5, 19, 45, 14, 50]
        }
      ]
    });
    const multiAxisOptions = ref({
      responsive: true,
      hoverMode: "index",
      stacked: false,
      scales: {
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1"
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              drawOnChartArea: false
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-3",
            gridLines: {
              drawOnChartArea: false
            }
          }
        ]
      }
    });

    const dt = ref();
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
      selectedDropDownIsletmeIndex = itemsDropDownIsletme.value.findIndex(
        firma => firma.name === selectedIsletme.value.name
      );
      //console.log("chnsge value, index:",selectedIsletme.value.name, gunSonuDataIndex);
      //gunSonuTableData.value = gunSonuData.value[gunSonuDataIndex];
    }
    function onChangeIslem() {
      selectedDropDownIslemIndex = itemsDropDownIslem.value.findIndex(
        islem => islem.name === selectedIslem.value.name
      );
    }

    const openNew = () => {
      openDialog.value = true;
    };
    const closeNew = () => {
      openDialog.value = false;
    };
    const openChart = () => {
      openDialogChart.value = true;
    };
    const closeChart = () => {
      openDialogChart.value = false;
    };
    const baslikOlustur = () => {
      let tar1 = new Date(tarih1.value);
      let tar2 = new Date(tarih2.value);
      if (
        tarih1.value !== "..." &&
        tarih2.value !== "..." &&
        tar2.getTime() > tar1.getTime()
      ) {
        tar1 = tar1.toLocaleString().split(" ")[0];
        tar2 = tar2.toLocaleString().split(" ")[0];

        if (
          selectedIsletme.value.name !== undefined &&
          selectedIslem.value.name !== undefined
        ) {
          baslik.value =
            selectedIsletme.value.name +
            " " +
            tar1 +
            "-" +
            tar2 +
            " " +
            selectedIslem.value.name;

          tarih1.value = "...";
          tarih2.value = "...";
          selectedIsletme.value = [];
          selectedIslem.value = [];

          let userFirmaId = getUserFirmaId().split(",")[
            selectedDropDownIsletmeIndex
          ]; // '46'
          //console.log("firma : ", userFirmaId);
          let [day, month, year] = [...tar1.split(".")];
          tar1 = year + "-" + month + "-" + day;
          [day, month, year] = [...tar2.split(".")];
          tar2 = year + "-" + month + "-" + day;
          let islem = itemsDropDownIslem.value[selectedDropDownIslemIndex].name;

          let sorguListe = {
            firma: userFirmaId,
            tar1: tar1,
            tar2: tar2,
            islem: islem
          };
          // console.log("sorgu Liste :", sorguListe);
          closeNew();
          return sorguListe;
        } else {
          toast.add({
            severity: "error",
            summary: "Eksik veri girişi...",
            detail: "Eksik alan...",
            life: 3000
          });
        }
      } else {
        toast.add({
          severity: "error",
          summary: "Eksik veya yanlış giriş...",
          detail: "Eksik alan veya 'Tarih 2 > Tarih 1' olmalı.",
          life: 3000
        });
      }

      // console.log('Baslik :', baslik);
    };

    function getIstemeAdi() {
      let isletmeAdi = getUserFirmaAdi();
      itemsDropDownIsletme.value = [];
      isletmeAdi.forEach(isletme => {
        let obj = { name: isletme };
        itemsDropDownIsletme.value.push(obj);
      });
    }
    
   function gunSonuToplam() {
      let toplam = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let x = 0;
      let tar1, tar2;

      multiAxisData.value.datasets[0].data = [];
      multiAxisData.value.datasets[1].data = [];
      multiAxisData.value.datasets[2].data = [];
      chartXaxisLabel.value = [];

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

          multiAxisData.value.datasets[0].data.push(gunSonu.toplam_ciro);
          multiAxisData.value.datasets[1].data.push(gunSonu.masraf_tutar);
          multiAxisData.value.datasets[2].data.push(gunSonu.banka_tutar);
          chartXaxisLabel.value.push(gunSonu.tarih.split(" ")[0]);
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
      multiAxisData.value.datasets[0].data = [];
      multiAxisData.value.datasets[1].data = [];
      multiAxisData.value.datasets[2].data = [];
      chartXaxisLabel.value = [];
      try {
        gunSonuTableData.value.forEach(gunSonu => {
          toplam += gunSonu.cikis_tutar;
          multiAxisData.value.datasets[1].data.push(gunSonu.cikis_tutar);
          chartXaxisLabel.value.push(gunSonu.tarih_zaman.split(" ")[0]);

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
      multiAxisData.value.datasets[0].data = [];
      multiAxisData.value.datasets[1].data = [];
      multiAxisData.value.datasets[2].data = [];
      chartXaxisLabel.value = [];

      try {
        gunSonuTableData.value.forEach(gunSonu => {
          toplam += gunSonu.cikis_tutar;

          multiAxisData.value.datasets[2].data.push(gunSonu.cikis_tutar);
          chartXaxisLabel.value.push(gunSonu.tarih_zaman.split(" ")[0]);
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

    getIstemeAdi();

    let sorgu = {};

    const getAylikGunSonuTask = useTask(function*() {
      
      sorgu = baslikOlustur();

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
      //console.log("Task :",result);

      gunSonuData.value = JSON.parse(result);

      //console.log("Task :" + gunSonuData.value);

      // if (gunSonuData.value === null || gunSonuData.value === undefined) {
      //   console.log("Hata : " + "veri yok");
      // }

      gunSonuTableData.value = gunSonuData.value;

      isdataTableData.value = true;

      //return JSON.parse(result);
    });

    // getAylikGunSonuTask.perform();

    return {
      toast,
      selectedIsletme,
      itemsDropDownIsletme,
      selectedDropDownIsletmeIndex,
      selectedDropDownIslemIndex,
      gunSonuData,
      gunSonuTableData,
      getAylikGunSonuTask,
      baslikAy,
      getUserFirmaAdi,
      exportCSV,
      dt,
      isdataTableData,
      dataTableColumns,
      dataTableColumnsGunSonu,
      dataTableColumnsMasraf,
      dataTableColumnsBankaElden,
      excelComp,
      itemsExportSplitButton,
      onChangeIsletme,
      onChangeIslem,
      sorgu,
      listeToplam,
      openDialog,
      openNew,
      closeNew,
      selectedIslem,
      itemsDropDownIslem,
      openDialogChart,
      openChart,
      closeChart,
      chartXaxisLabel,
      multiAxisData,
      multiAxisOptions,
      tarih1,
      tarih2,
      baslikOlustur,
      baslik,
      getIstemeAdi
    };
  } //setup
};
</script>

<style scoped lang="scss">
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
  width: 100px;
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
</style>
