<template>
    <div class="admiral">
        <div class="admiral--name">
            <div class="admiral--rank">{{ rank }}</div>
            <div class="admiral--playername" :class="{censor:uiCensor}"
                 @click="$store.dispatch('UI_TOGGLE_CENSOR')">{{ uiCensor ? "nope.jpg" : hqNickname }}</div>
        </div>
        <div class="admiral--hq_exp_bar" :style="expBar"></div>
        <div class="admiral--hq_fields">
            <div class="admiral--hq">HQ {{ hqLevel }}</div>
            <div class="admiral--hq_diff_points">{{ points }}</div>
        </div>
        <div class="admiral--comment">{{ hqComment }}</div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import levels from '@/helpers/hq_exp'
  export default {
    name: 'Admiral',
    computed: {
      ...mapGetters(['hqRankId', 'hqComment', 'hqLevel', 'hqRankPoints',
        'hqNickname', 'uiCensor', 'hqExp']),
      points () {
        return this.hqRankPoints > 0 ? `+${this.hqRankPoints.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}` : '0'
      },
      expBar () {
        if (this.hqLevel === 120) {
          return `--gradient: transparent;`
        }
        const currentlvlexp = levels[this.hqLevel]
        const nextlvlexp = levels[this.hqLevel + 1]
        const grindexp = nextlvlexp - currentlvlexp
        const currentdiff = this.hqExp - currentlvlexp
        const start = parseInt((currentdiff / grindexp) * 100.0)
        let end = 100
        if (start < 90) end = start + 10
        return `--gradient: linear-gradient(to right, green ${start}%, rgba(250, 0, 0, 0.5) ${end}%);`
      },
      rank () {
        return [
          '',
          'Marshal Adm.',
          'Admiral',
          'Vice-Admiral',
          'Rear-Admiral',
          'Captain',
          'Commander',
          'Novice Cdr.',
          'Lt. Cdr.',
          'Lieutenant',
          'Novice Lt.'
        ][this.hqRankId]
      }
    }
  }
</script>
