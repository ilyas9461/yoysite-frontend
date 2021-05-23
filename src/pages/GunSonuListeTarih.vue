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
              :filename="selectedIsletme.name"
              :sheetname="'Sayfa1'"
            >
            </vue-excel-xlsx>
          </template>
        </Toolbar>
        <!-- gunSonuData[gunSonuDataIndex] -->
        <DataTable
          ref="dt"
          :value="gunSonuTableData"
          selectionMode="single"
          :paginator="true"
          :rows="10"
          responsiveLayout="scroll"
          :rowHover="true"
          :exportFilename="selectedIsletme.name"
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
            <div
              class="table-header p-d-flex p-flex-column p-flex-md-row p-jc-md-between"
            >
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
        <!-- toplamlar -->
        <div class="card">
          <DataTable
            :value="aylikGunSonuToplam()"
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
              <div
                class="table-header p-d-flex p-flex-column p-flex-md-row p-jc-md-between"
              >
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
                    <label for="dateformat1" class="p-ml-2 p-text-bold">Tarih 1 :</label>
                    <Calendar
                      id="dateformat1"
                      v-model="tarih1"
                      dateFormat="yy-mm-dd"
                      placeholder="Tarih 1"
                      class="p-ml-2"
                    />
                  </div>
                  <div class="p-field p-col-12 ">
                     <label for="dateformat2" class="p-ml-2 p-text-bold">Tarih 2 :</label>
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
                      @change="onChange()"
                      style="font-weight:bold;width:100%"
                    />
                  </div>
                  <div class="p-col-12 p-mt-3">
                    <Dropdown
                      v-model="selectedIsletme"
                      :options="itemsDropDownIsletme"
                      optionLabel="name"
                      placeholder="İşletme"
                      @change="onChange()"
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

            <Button icon="pi pi-check" label="Tamam" @click="baslikOlustur" />
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
            <Button
              icon="pi pi-times"
              label="İptal"
              class="p-button-secondary"
              style="margin-left: .5em"
              @click="closeNew"
            />

            <Button icon="pi pi-check" label="Tamam" @click="saveProduct" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watchEffect } from "vue";
import { useToast } from "primevue/usetoast";
import { useTask } from "vue-concurrency";
import DataService from "../service/DataService";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const toast = useToast();
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
      "Aralık",
    ];
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
          toast.add({
            severity: "success",
            summary: "Excel ==> .xlsx",
            detail: "Tablo verisi indiriliyor",
            life: 3000,
          });
          excelComp.value.exportExcel();
        },
      },
      {
        label: "EXCEL-csv",
        icon: "pi pi-file-excel",
        command: () => {
          toast.add({
            severity: "success",
            summary: "Excel ==> .csv ",
            detail: "Tablo verisi indiriliyor",
            life: 3000,
          });
          exportCSV();
        },
      },
      {
        label: "PDF",
        icon: "pi pi-file-pdf",
        command: () => {
          toast.add({
            severity: "success",
            summary: "Pdf oluşturuldu",
            detail: "Tablo verisi indiriliyor ???",
            life: 3000,
          });
          //exportCSV();
        },
      },
    ]);
    const itemsSplitButon = ref([
      {
        label: "Ocak",
        // icon: 'pi pi-refresh',
        command: () => {
          toast.add({
            severity: "success",
            summary: aylar[0] + " Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000,
          });
          baslikAy.value = aylar[0];
          sorgu = ayTarihOlustur(0);
          getAylikGunSonuTask.perform();
        },
      },
      {
        label: "Şubat",
        // icon: 'pi pi-times',
        command: () => {
          toast.add({
            severity: "success",
            summary: aylar[1] + " Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000,
          });
          baslikAy.value = aylar[1];
          sorgu = ayTarihOlustur(1);
          getAylikGunSonuTask.perform();
        },
      },
      {
        label: "Mart",
        command: () => {
          toast.add({
            severity: "success",
            summary: aylar[2] + " Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000,
          });
          baslikAy.value = aylar[2];
          sorgu = ayTarihOlustur(2);
          getAylikGunSonuTask.perform();
        },
        // icon: 'pi pi-external-link',
        // command: () => {
        // 	window.location.href = 'https://vuejs.org/'
        // }
      },
      {
        label: "Nisan",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: aylar[3] + " Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000,
          });
          baslikAy.value = aylar[3];
          sorgu = ayTarihOlustur(3);
          getAylikGunSonuTask.perform();
        },
      },
      {
        label: "Mayıs",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: aylar[4] + " Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000,
          });
          baslikAy.value = aylar[4];
          sorgu = ayTarihOlustur(4);
          getAylikGunSonuTask.perform();
        },
      },
      {
        label: "Haziran",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: aylar[5] + " Ayı",
            detail: "Tablo verileri indiriliyor...",
            life: 3000,
          });
          baslikAy.value = aylar[5];
          sorgu = ayTarihOlustur(5);
          getAylikGunSonuTask.perform();
        },
      },
      {
        label: "Temmuz",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: aylar[6] + " Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000,
          });
          baslikAy.value = aylar[6];
          sorgu = ayTarihOlustur(6);
          getAylikGunSonuTask.perform();
        },
      },
      {
        label: "Ağustos",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: aylar[7] + " Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000,
          });
          baslikAy.value = aylar[7];
          sorgu = ayTarihOlustur(7);
          getAylikGunSonuTask.perform();
        },
      },
      {
        label: "Eylül",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: aylar[8] + " Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000,
          });
          baslikAy.value = aylar[8];
          sorgu = ayTarihOlustur(8);
          getAylikGunSonuTask.perform();
        },
      },
      {
        label: "Ekim",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: aylar[9] + " Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000,
          });
          baslikAy.value = aylar[9];
          sorgu = ayTarihOlustur(9);
          getAylikGunSonuTask.perform();
        },
      },
      {
        label: "Kasım",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: aylar[10] + " Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000,
          });
          baslikAy.value = aylar[10];
          sorgu = ayTarihOlustur(10);
          getAylikGunSonuTask.perform();
        },
      },
      {
        label: "Aralık",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: aylar[11] + " Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000,
          });
          baslikAy.value = aylar[11];
          sorgu = ayTarihOlustur(11);
          getAylikGunSonuTask.perform();
        },
      },
    ]);
    const selectedIsletme = ref({ name: "..." });
    const itemsDropDownIsletme = ref([]);
    const selectedIslem = ref({ name: "..." });
    const itemsDropDownIslem = ref([
      { name: "Gun Sonu" },
      { name: "Masraf" },
      { name: "Banka Elden" },
    ]);

    const dataTableColumns = [
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
      { field: "varsa_not", header: "Not", label: "Not" },
    ];

    const dataService = new DataService();
    const gunSonuData = ref();
    let gunSonuDataIndex = ref(0);
    const gunSonuTableData = ref();
    const openDialog = ref(false);
    const openDialogChart = ref(false);
    const multiAxisData = ref({
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Dataset 1",
          fill: false,
          borderColor: "#42A5F5",
          yAxisID: "y-axis-1",
          data: [65, 59, 80, 81, 56, 55, 10],
        },
        {
          label: "Dataset 2",
          fill: false,
          borderColor: "#00bb7e",
          yAxisID: "y-axis-2",
          data: [28, 48, 40, 19, 86, 27, 90],
        },
      ],
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
            id: "y-axis-1",
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              drawOnChartArea: false,
            },
          },
        ],
      },
    });

    const dt = ref();
    const exportCSV = () => {
      dt.value.exportCSV();
      //console.log("export dt value: ", dt);
    };

    onMounted(() => {
      //gunSonuData.value = gunSonu().data;
    });

    watchEffect(() => {
      // console.log(tarih1.value);
    });

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
      storeUser.forEach((element) => {
        firmaAdi.push(element.firma_adi);
      });

      //console.log(" FirmaAdi : ", firmaAdi);

      if (storeUser.firma_adi !== null)
        // return storeUser[0].firma_adi;
        return firmaAdi;
    }

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
      //console.log("local firma Id :", userFirmaId);

      let isletmeAdi = getUserFirmaAdi();
      itemsDropDownIsletme.value = [];
      isletmeAdi.forEach((isletme) => {
        let obj = { name: isletme };
        itemsDropDownIsletme.value.push(obj);
      });
      // itemsDropDownIsletme.value = [{ name: isletmeAdi }];
      //selectedIsletme.value = itemsDropDownIsletme.value[0];
      // console.log( "selectedIsletme.value=",itemsDropDownIsletme.value[0].name);

      const sorgu = {
        tar1: tar1,
        tar2: tar2,
        user: userFirmaId, //'46',
      };
      //console.log('liste Local :',localStorage.getItem("firma"));
      //console.log("getAylikGunSonuTask sorgu:", sorgu, year);
      return sorgu;
    }

    function onChange() {
      //drop down change
      gunSonuDataIndex = itemsDropDownIsletme.value.findIndex(
        (x) => x.name === selectedIsletme.value.name
      );
      //console.log("chnsge value, index:",selectedIsletme.value.name, gunSonuDataIndex);
      gunSonuTableData.value = gunSonuData.value[gunSonuDataIndex];
    }

    let sorgu = ayTarihOlustur(new Date().getMonth());

    const getAylikGunSonuTask = useTask(function*() {
      const result = yield dataService.getAylikGunSonu(sorgu);
      //console.log("Task :",result);

      gunSonuData.value = JSON.parse(result);
      console.log("Task :" + gunSonuData.value[0]);

      if (gunSonuData.value === null || gunSonuData.value === undefined) {
        console.log("Hata : " + "veri yok");
      }

      gunSonuTableData.value = gunSonuData.value[0];

      //return JSON.parse(result);
    });

    function aylikGunSonuToplam() {
      let toplam = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let x = 0;
      let tar1, tar2;
      try {
        gunSonuTableData.value.forEach((gunSonu) => {
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
          x++;
        });

        tar1 = gunSonuTableData.value[0].tarih.split(" ");
        tar2 = gunSonuTableData.value[x - 1].tarih.split(" ");
        tar1 = tar1[0].split("-");
        tar2 = tar2[0].split("-");

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

            tarih: tar1[0] + "." + tar1[1] + "." + tar1[2] + "-" + tar2[2],

            id: 14,
            firma_web_id: "",
            islem_tur: "GUN SONU",
            kasiyer_devralan: "...",
            kasiyer_devreden: "...",
            picc_stok: "",
            varsa_not: "...",
            web_kayit: 1,
          },
        ];

        //console.log("toplama :", retVal);

        return retVal;
      } catch (error) {
        console.log("Hata : ", error);
        return null;
      }

      //console.log(tar1, tar2);
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
      if ((tarih1.value !== "..." && tarih2.value !== "...") && (tar2.getTime()>tar1.getTime())) {
        

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

          tarih1.value="...";
          tarih2.value = "...";
          selectedIsletme.value=[];
          selectedIslem.value=[];

          closeNew();
        } else {
          toast.add({
            severity: "error",
            summary: "Eksik veri girişi...",
            detail: "Eksik alan...",
            life: 3000,
          });
        }
      } else {
        toast.add({
          severity: "error",
          summary: "Eksik veya yanlış giriş...",
          detail: "Eksik alan veya 'Tarih 2 > Tarih 1' olmalı.",
          life: 3000,
        });
      }

      // console.log('Baslik :', baslik);
    };

    getAylikGunSonuTask.perform();

    return {
      toast,
      itemsSplitButon,
      selectedIsletme,
      itemsDropDownIsletme,
      gunSonuData,
      gunSonuTableData,
      gunSonuDataIndex,
      getAylikGunSonuTask,
      baslikAy,
      getUserFirmaAdi,
      exportCSV,
      dt,
      dataTableColumns,
      excelComp,
      itemsExportSplitButton,
      onChange,
      sorgu,
      aylikGunSonuToplam,
      openDialog,
      openNew,
      closeNew,
      selectedIslem,
      itemsDropDownIslem,
      openDialogChart,
      openChart,
      closeChart,
      multiAxisData,
      multiAxisOptions,
      tarih1,
      tarih2,
      baslikOlustur,
      baslik,
    };
  }, //setup
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
