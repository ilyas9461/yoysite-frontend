<template>
  <div class="p-grid crud-demo">
    <div class="p-col-12">
      <div class="card">
        <Toast />
        <Toolbar class="p-mb-4">
          <template v-slot:left>
            <!-- <Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" /> -->
            <Dropdown
              class="p-mr-2"
              v-model="selectedIsletme"
              :options="itemsDropDownIsletme"
              optionLabel="name"
              placeholder="İşletme"
            />
            <SplitButton
              label="Bu AY"
              icon="pi pi-list"
              :model="itemsSplitButon"
              class="p-button-secondary "
            ></SplitButton>
          </template>

          <template v-slot:right>
            <FileUpload
              mode="basic"
              accept="image/*"
              :maxFileSize="1000000"
              label="Import"
              chooseLabel="Import"
              class="p-mr-2 p-d-inline-block"
            />
            <Button
              label="Export"
              icon="pi pi-upload"
              class="p-button-help"
              @click="exportCSV($event)"
            />
          </template>
        </Toolbar>
        <DataTable
          :value="gunSonuData"
          selectionMode="single"
          :paginator="true"
          :rows="15"
          responsiveLayout="scroll"
          :rowHover="true"
          v-if="!getAylikGunSonuTask.isRunning"
        >
          <template #loading>
            Loading records, please wait...
          </template>
          <template #empty>
            No records found
          </template>
          <template #header>
            <div class="table-header p-d-flex p-flex-column p-flex-md-row p-jc-md-between">
              <h5 class="p-mb-2 p-m-md-0 p-as-md-center">... Ayı Gun Sonu Listesi</h5>
            </div>
          </template>
          <Column
            field="toplam_satis"
            header="Satış"
            headerStyle="font-weight:bold;"
          >
          </Column>
          <Column
            field="toplam_islem"
            header="İşlem"
            headerStyle="font-weight:bold; "
          >
          </Column>
          <Column
            field="toplam_ciro"
            header="Ciro"
            headerStyle="font-weight:bold; "
          >
          </Column>
          <Column
            field="nakit_para_tutar"
            header="Kasa Nakit"
            headerStyle="font-weight:bold; "
          >
          </Column>
          <Column
            field="kredi_karti_tutar"
            header="KKartı"
            headerStyle="font-weight:bold; "
          >
          </Column>
          <Column
            field="banka_tutar"
            header="Banka/Elden"
            headerStyle="font-weight:bold; "
          >
          </Column>
          <Column
            field="masraf_tutar"
            header="Masraf"
            headerStyle="font-weight:bold; "
          >
          </Column>
          <Column
            field="gunluk_kasa"
            header="Gunluk Kasa"
            headerStyle="font-weight:bold; "
          >
          </Column>
          <Column
            field="devreden_miktar"
            header="Devir"
            headerStyle="font-weight:bold; "
          >
          </Column>
          <Column
            field="fark"
            header="Fark"
            headerStyle="font-weight:bold; "
          >
          </Column>
          <Column
            field="tarih"
            header="Tarih"
            headerStyle="font-weight:bold; "
          >
          </Column>
          <Column
            field="kasiyer_devreden"
            header="Kasiyer"
            headerStyle="font-weight:bold; "
          >
          </Column>
          <Column
            field="varsa_not"
            header="Not"
            headerStyle="font-weight:bold; "
          >
          </Column>
        </DataTable>
        <div>
          Aylık Toplam :
        </div>

      </div>

    </div>
  </div>

</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useTask } from "vue-concurrency";
import DataService from "../service/DataService";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const toast = useToast();
    const itemsSplitButon = ref([
      {
        label: "Ocak",
        // icon: 'pi pi-refresh',
        command: () => {
          toast.add({
            severity: "success",
            summary: "Ocak Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000
          });
        }
      },
      {
        label: "Şubat",
        // icon: 'pi pi-times',
        command: () => {
          toast.add({
            severity: "success",
            summary: "Şubat Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000
          });
        }
      },
      {
        label: "Mart",
        command: () => {
          toast.add({
            severity: "success",
            summary: "Mart Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000
          });
        }
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
            summary: "Nisan Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000
          });
        }
      },
      {
        label: "Mayıs",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: "Mayıs Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000
          });
        }
      },
      {
        label: "Haziran",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: "Haziran Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000
          });
        }
      },
      {
        label: "Temmuz",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: "Temmuz Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000
          });
        }
      },
      {
        label: "Ağustos",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: "Ağustos Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000
          });
        }
      },
      {
        label: "Eylül",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: "Eylül Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000
          });
        }
      },
      {
        label: "Ekim",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: "Ekim Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000
          });
        }
      },
      {
        label: "Kasım",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: "Kasım Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000
          });
        }
      },
      {
        label: "Aralık",
        // icon: 'pi pi-upload',
        //to: '/fileupload'
        command: () => {
          toast.add({
            severity: "success",
            summary: "Aralık Ayı",
            detail: "Veri oluşturuluyor",
            life: 3000
          });
        }
      }
    ]);
    const selectedIsletme = ref();
    const itemsDropDownIsletme = ref([
      { name: "1-..." },
      { name: "2-..." },
      { name: "3-..." },
      { name: "4-.." },
      { name: "5-..." }
    ]);

    onMounted(() => {
      //gunSonuData.value = gunSonu().data;
    });
    const dataService = new DataService();
    const gunSonuData = ref();

    function getUserFirmaId() {
      const storeUser = computed(() => store.state.UserModule.user).value;
      // console.log(" getUserFirmaId() : ", storeUser);
      if (storeUser.firmaWebId !== null) return storeUser.firmaWebId;
    }

    function ayTarihOlustur() {
      let datetime = new Date();

      datetime = datetime.toLocaleString();
      console.log(datetime); //17.05.2021 11:20:04
      let tar1 = datetime.split(" ")[0];
      let [day, month, year] = [...tar1.split(".")];

      tar1 = year + "-" + month + "-" + "01"; ////"yyyy-mm-dd HH:MM:ss"
      let tar2 = day;
      let ay = (Number(month) + 1).toString();
      if (ay <= "9") ay = "0" + ay;

      tar2 = year + "-" + ay + "-" + "01";

      let userFirmaId = getUserFirmaId(); // '46'
      //console.log("local firma Id :", userFirmaId);

      const sorgu = {
        tar1: tar1,
        tar2: tar2,
        user: userFirmaId //'46',
      };
      console.log(' Local :',localStorage.getItem("firma"));
      //console.log("getAylikGunSonuTask sorgu:", sorgu, year);
      return sorgu;
    }
    ayTarihOlustur();

    const getAylikGunSonuTask = useTask(function*() {
      const sorgu = ayTarihOlustur();
      const result = yield dataService.getAylikGunSonu(sorgu);

      //   store.dispatch("DataModule/setGunSonu", JSON.parse(result.data)).then(() => {});

      // gunSonu.value = JSON.parse(result.data);
      // console.log("Task :" + result);
      gunSonuData.value = JSON.parse(result);
      //return JSON.parse(result);
    });

    getAylikGunSonuTask.perform();

    return {
      toast,
      itemsSplitButon,
      selectedIsletme,
      itemsDropDownIsletme,
      gunSonuData,
      getAylikGunSonuTask
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
</style>
