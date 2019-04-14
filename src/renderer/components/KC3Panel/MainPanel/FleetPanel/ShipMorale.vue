<template>
    <div>
        <img class="fleet_ship--status_morale" :class="shipMoraleState(shipId)" :title="shipMorale(shipId)">
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'ShipMorale',
    props: ['shipId'],
    computed: {
      ...mapGetters(['shipMoraleState', 'shipMorale'])
    }
  }
</script>
