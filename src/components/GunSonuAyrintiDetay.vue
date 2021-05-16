<template>
  <div>
    <template v-if=" ayrintiAdi==='Günlük Ciro'">
      <DataTable
        :value="GunSonuDetayData.data"
        selectionMode="single"
        :paginator="false"
        :rows="10"
        responsiveLayout="scroll"
        :rowHover="true" 
      >
        <Column
          field="ad"
          header="Detay Adı"
          headerStyle="font-weight:bold;"
          bodyStyle="padding:0.35rem;"
        >
        </Column>
        <Column
          field="deger"
          header="Miktar"
          headerStyle="font-weight:bold; "
          bodyStyle="padding:0.5rem; font-weight:bold;"
        >
        </Column>
      </DataTable>
    </template>

    <template v-if=" ayrintiAdi==='Masraf'">
      <DataTable
        :value="GunSonuDetayData.data"
        selectionMode="single"
        :paginator="true"
        :rows="5"
        responsiveLayout="scroll"
      >
        <Column
          field="cikis_adi"
          header="Çıkış Adı"
          sortable
        >
        </Column>
        <!-- <Column
        field="tur"
          header="Çıkış Tür"
        >
        </Column> -->
        <Column
          field="cesit"
          header="Çıkış Çeşit"
          sortable
        >
        </Column>
        <Column
          field="cikis_tutar"
          header="Tutar"
          sortable
        >
        </Column>
        <Column
          field="islem_not"
          header="Not"
          sortable
        >
        </Column>

      </DataTable>

    </template>

    <template v-if=" ayrintiAdi==='Banka/Elden'">
      <DataTable
        :value="GunSonuDetayData.data"
        selectionMode="single"
        :paginator="true"
        :rows="5"
        responsiveLayout="scroll"
      >
        <Column
          field="cikis_adi"
          header="Çıkış Adi"
          sortable
        >
        </Column>
        <Column
          field="cikis_tutar"
          header="Miktar"
          sortable
        >
        </Column>
        <Column
          field="islem_yapan"
          header="İşlem Yapan"
          sortable
        >
        </Column>
        <Column
          field="islem_not"
          header="Not"
          sortable
        >
        </Column>

      </DataTable>

    </template>

  </div>

</template>

<script>
import { ref } from "vue"; //, onMounted, computed
// import { useStore } from "vuex";
export default {
  props: {
    data: { type: Object },
    ayrinti: { type: String, default: "" }
  },
  setup(props) {
    //console.log(props.ayrinti);
    const ayrintiAdi = ref(props.ayrinti);
    const GunSonuDetayData = ref(props.data);
    //console.log('Gun Sonu Ayrıntı detay:',props.data);
    return {
      ayrintiAdi,
      GunSonuDetayData,

    };
  }
};
</script>
<style>
gunluk-ciro {
  font-weight: bold;
  padding: 0.25rem;
}
</style>