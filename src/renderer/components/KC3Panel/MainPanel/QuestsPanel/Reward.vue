<template>
    <div class="quest--reward">
        <div v-if="reward.useitem" class="quest--reward-image" ><img :src="useitemSrc(reward.useitem)"></div>
        <div v-if="reward.gear" class="quest--reward-image gear" :title="gearTitle(reward.gear)" >
            <img :src="gearTypeSrc(reward.gear)"></div>
        <div v-if="reward.ranking_points" class="quest--reward-amount" title="Ranking Points">{{ reward.ranking_points }}RP</div>
        <div v-if="reward.amount" class="quest--reward-amount">{{ reward.amount }}</div>
        
    </div>
</template>

<script>
  import WCTFItems from '@/generated/items'

  export default {
    name: 'Reward',
    props: ['reward'],
    methods: {
      useitemSrc (itemId) {
        return require(`@/assets/img/useitems/${itemId}.png`)
      },
      gearTypeSrc (gearId) {
        return require(`@/assets/img/itemtypes/${WCTFItems[gearId].types[3] || 0}.png`)
      },
      gearTitle (gearId) {
        return `[${gearId}] ${WCTFItems[gearId].name}`
      }
    }
  }
</script>
