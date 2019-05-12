<template>
    <div class="resources">
        <div class="resources--line">
            <div>{{ shipCount || "X" }}/{{ hqMaxShips || "X" }}<img src="~@/assets/img/ui/ships.svg"></div>
            <div>{{ gearCount || "X" }}/{{ hqMaxGears || "X" }}<img src="~@/assets/img/ui/gears.svg"></div>
            <div>{{ hqBuckets || "X" }}<img src="~@/assets/img/ui/buckets.png"></div>
        </div>
        <div class="resources--line">
            <div><img src="~@/assets/img/ui/fuel.png">{{ hqFuel || "X" }}</div>
            <div><img src="~@/assets/img/ui/steel.png">{{ hqSteel || "X" }}</div>
        </div>
        <div class="resources--line">
            <div><img src="~@/assets/img/ui/ammo.png">{{ hqAmmo || "X" }}</div>
            <div><img src="~@/assets/img/ui/bauxite.png">{{ hqBauxite || "X" }}</div>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'Resources',
    computed: {
      ...mapGetters(['hqBuckets', 'hqFuel', 'hqSteel', 'hqBauxite', 'hqAmmo',
        'shipCount', 'hqMaxShips', 'hqMaxGears', 'gearCount'])
    }
  }
</script>