const debug = true
const networkParser = {
  parse (store, message) {
    const url = message.data.url
    const match = url.match(/https?:\/\/[^/]*(.*)/)
    if (match === null) {
      return console.error('ERROR MATCHING URL ' + url + ' ' + JSON.stringify(message))
    }
    if (debug) {
      console.log(match[1], message)
    }
    switch (match[1]) {
      case '/kcsapi/api_get_member/questlist':
        // runs on quest list open
        // after quest check \ quest uncheck
        store.dispatch('UI_SWITCH_PANEL', 'quests')
        store.dispatch('PARSE_QUESTS_LIST', message.data)
        console.log(`parse quest list`)
        break
      case '/kcsapi/api_port/port':
        console.log(`parse in port`)
        store.dispatch('HQ_PARSE_PORT_DATA', message.data.responseBody.api_data)
        store.dispatch('UI_SWITCH_PANEL', 'fleet')
        break
      case '/kcsapi/api_req_map/next':
        console.log('sortieNext', message)
        break
      case '/kcsapi/api_req_hokyu/charge':
        console.log(`parse refuel`)
        console.log('shipFueled', message)
        break
      case '/kcsapi/api_req_sortie/battleresult':
        console.log(`parse battle result`)
        console.log('battleResult', message)
        break
      case '/kcsapi/api_req_sortie/battle':
        console.log(`parse battle data`)
        console.log('battleData', message)
        break
      case '/kcsapi/api_get_member/ship3':
        // after remodell
        console.log(`parse ship update and equip groups (after equip)`)
        console.log('shipEquipLists', message)
        break
      case '/kcsapi/api_get_member/ndock':
        // after repair started
        console.log(`parse in repair dock screen`)
        console.log('dockScreen', message)
        break
      case '/kcsapi/api_get_member/mapinfo':
        console.log(`parse sortie info`)
        console.log('sortieTabOpen', message)
        break
      case '/kcsapi/api_req_map/start':
        console.log(`parse start sortie`)
        store.dispatch('UI_SWITCH_PANEL', 'battle')
        break
      case '/kcsapi/api_get_member/ship_deck':
        console.log(`parse ship deck update (in battle)`)
        store.dispatch('HQ_PARSE_DECK_BATTLE_UPDATE', message.data.responseBody.api_data.api_ship_data)
        break
      case '/kcsapi/api_get_member/slot_item':
        // after remodell
        console.log(`parse dock return slot item list`)
        store.dispatch('HQ_PARSE_GEAR_DATA', message.data.responseBody.api_data)
        break
      case '/kcsapi/api_get_member/unsetslot':
        console.log(`parse dock return slot item unset`)
        break
      case '/kcsapi/api_get_member/useitem':
        console.log(`parse dock return use item`)
        break
      case '/kcsapi/api_req_quest/clearitemget':
        store.dispatch('QUEST_COMPLETE', message.data)
        console.log(`parse quest complete | item get`)
        break
      case '/kcsapi/api_req_quest/start':
        // generally page will updated itself triggering /kcsapi/api_get_member/questlist
        // so no need to dispatch anything
        console.log(`parse quest selected`)
        break
      case '/kcsapi/api_req_quest/stop':
        store.dispatch('QUEST_UNSELECTED', message.data)
        console.log(`parse quest unselected`)
        break
      case '/kcsapi/api_req_nyukyo/start':
        console.log(`parse repair ship started`)
        console.log('RepairShipStarted')
        break
      case '/kcsapi/api_req_kousyou/getship':
        console.log(`parse get crafted ship`)
        break
      case '/kcsapi/api_get_member/preset_deck':
        console.log(`parse into ship deck screen`)
        console.log('deckScreen', message)
        break
      case '/kcsapi/api_req_furniture/change':
        console.log(`parse set up furniture screen leave`)
        break
      case '/kcsapi/api_req_hensei/combined':
        console.log(`parse fleet combine`)
        console.log('fleetCombined', message)
        // console.log('combinedBattleResult', message)
        break

      case '/kcsapi/api_req_combined_battle/midnight_battle':
        console.log(`combined night battle`)
        console.log('nightBattleCombinedData', message)
        break

      case '/kcsapi/api_req_combined_battle/battleresult':
        console.log(`combined result`)
        console.log('combinedBattleResult', message)
        break

      case '/kcsapi/api_get_member/payitem':
        console.log(`parse payshop open`)
        break
      case '/kcsapi/api_get_member/picture_book':
        console.log(`parse image library open or switched`)
        break
      case '/kcsapi/api_get_member/record':
        console.log(`parse player info page open`)
        break
      case '/kcsapi/api_req_ranking/mxltvkpyuklh':
        console.log(`parse requested player rank table`)
        break
      case '/kcsapi/api_req_kousyou/createship':
        console.log(`parse ship building started`)
        break
      case '/kcsapi/api_req_kousyou/createitem':
        console.log(`parse item creating`)
        break
      case '/kcsapi/api_get_member/kdock':
        console.log(`parse craft dock status?`)
        break
      case '/kcsapi/api_get_member/material':
        // after quest complete
        // after ship create
        // after remodell
        console.log(`parse material updates?`)
        break
      case '/kcsapi/api_req_hensei/change':
        // removed all ships besides flag
        console.log(`parse switched ship in deck`)
        console.log('SwitchedShipInDeck', message)
        break
      case '/kcsapi/api_req_member/set_oss_condition':
        console.log(`deck filters updated`)
        break
      case '/kcsapi/api_req_hensei/preset_select':
        console.log(`parse switched ship from preset`)
        break
      case '/kcsapi/api_req_kousyou/remodel_slotlist':
        console.log(`parse entered akashi docks`)
        break
      case '/kcsapi/api_req_kousyou/remodel_slotlist_detail':
        console.log(`parse akashi remodel details requested`)
        break
      case '/kcsapi/api_req_kousyou/remodel_slot':
        console.log(`parse akashi remodel item`)
        break
      case '/kcsapi/api_req_kaisou/unsetslot_all':
        console.log(`parse unset all items in equip window`)
        break
      case '/kcsapi/api_req_kaisou/slotset':
        console.log(`parse set/unset single slot`)
        break
      case '/kcsapi/api_req_kousyou/destroyship':
        console.log(`parse ship scrap`)
        break
      case '/kcsapi/api_req_kaisou/powerup':
        console.log(`parse ship improvement`)
        break
      case '/kcscontents/news/post.html':
        // GET
        console.log(`parse news update`)
        break
      case '/kcsapi/api_get_member/practice':
        console.log(`parse general pvp info on enemies`)
        break
      case '/kcsapi/api_req_member/get_practice_enemyinfo':
        console.log(`parse detailed pvp info`)
        break
      case '/kcsapi/api_get_member/mission':
        console.log(`parse expedition tab open`)
        console.log('expeditionTabOpen', message)
        break
      case '/kcsapi/api_req_mission/result':
        console.log(`parse expedition result`)
        break
      case '/kcsapi/api_req_mission/start':
        console.log('expeditionSent', message)
        console.log(`parse expedition start`)
        break
      case '/kcsapi/api_get_member/deck':
        console.log(`parse deck update after expedition started`)
        break
      case '/kcsapi/api_req_hensei/preset_register':
        console.log(`parse add/update fleet preset`)
        break
      case '/kcsapi/api_req_hensei/preset_delete':
        console.log(`parese remove fleet preset`)
        break
      case '/kcsapi/api_req_kaisou/slot_deprive':
        console.log(`parse take equip from other ship`)
        break
      case '/kcsapi/api_req_kaisou/lock':
        console.log(`parese equip lock/unlock`)
        break
      case '/kcsapi/api_req_hensei/lock':
        console.log(`parese ship lock/unlock`)
        break

      case '/kcsapi/api_req_practice/battle':
        store.dispatch('UI_SWITCH_PANEL', 'battle')
        console.log('PVPDayBattleData', message)
        break

      case '/kcsapi/api_req_practice/midnight_battle':
        console.log(`parse pvp yasen `)
        console.log('PVPNightBattleData', message)
        break

      case '/kcsapi/api_req_practice/battle_result':
        console.log(`parse pvp result `)
        console.log('PVPBattleResult', message)
        break

      case '/kcsapi/api_req_battle_midnight/battle':
        console.log(`parse sortie yasen`)
        console.log('nightBattleData', message)
        break
      case '/kcsapi/api_req_combined_battle/ec_midnight_battle':
        console.log(`Midnight combined battle`)
        console.log('nightBattleCombinedData', message)
        break

      case '/kcsapi/api_req_combined_battle/each_battle':
        console.log(`both combined battle`)
        console.log('bothCombinedBattleData', message)
        break

      case '/kcsapi/api_req_combined_battle/goback_port':
        console.log(`damaged ship retreat`)
        break

      case '/kcsapi/api_req_air_corps/supply':
        console.log(`parse resupply lbas`)
        break

      case '/kcsapi/api_req_battle_midnight/sp_midnight':
        console.log(`parse night battle (from start)`)
        console.log('nightBattleSPData', message)
        break

      case '/kcsapi/api_req_sortie/airbattle':
        console.log(`parse air battle node`)
        console.log('airBattleData', message)
        break

      case '/kcsapi/api_req_combined_battle/ld_airbattle':
        console.log(`parse air battle node (combined)`)
        console.log('airBattleCombinedData', message)
        break

      case '/kcsapi/api_req_combined_battle/battle':
        console.log(`combined battle`)
        console.log('combinedBattleData', message)
        break

      case '/kcsapi/api_req_sortie/ld_airbattle':
        console.log(`Air battle`)
        break

      case '/kcsapi/api_req_combined_battle/ec_battle':
        console.log(`Combined enemy fleet`)
        break

      case '/kcsapi/api_req_nyukyo/speedchange':
        console.log(`parse used repair bucket`)
        break

      case '/kcsapi/api_req_air_corps/set_plane':
        console.log(`parse set lbas plane`)
        break

      case '/kcsapi/api_req_map/start_air_base':
        console.log(`parse set lbas targets`)
        break

      case '/kcsapi/api_req_air_corps/set_action':
        console.log(`parse set lbas action`)
        break

      case '/kcsapi/api_start2/getData':
        console.log(`parse game start2`)
        console.log('startData', message)
        break

      case '/kcsapi/api_start2':
        // old start data. unused
        console.log(`parse game start`)
        console.log('startData', message)
        break

      case '/kcsapi/api_req_kousyou/destroyitem2':
        console.log(`parse item destroy`)
        console.log('destroyItem', message)
        break

      case '/kcsapi/api_get_member/require_info':
        console.log(`parse get info on start (docks\\equips)`)
        console.log('startRequireInfo', message)
        break

      case '/kcsapi/api_req_member/get_incentive':
        console.log(`parse get incentive? start`)
        break

      case '/kcsapi/api_req_kaisou/remodeling':
        console.log(`parse ship remodel`)
        break

      case '/kcsapi/api_req_mission/return_instruction':
        console.log(`cancelled expedition`)
        break

      case '/kcsapi/api_req_member/itemuse':
        console.log(`used item(shop)`)
        break

      case '/kcsapi/api_get_member/basic':
        console.log(`updated data after item use`)
        break

      case '/kcsapi/api_req_furniture/buy':
        console.log(`bought new item`)
        break

      case '/kcsapi/api_get_member/furniture':
        console.log(`gought new furniture`)
        break

      case '/kcsapi/api_dmm_payment/paycheck':
        console.log(`buing from dmm shop`)
        break

      case '/kcsapi/api_req_member/payitemuse':
        console.log(`using pay item`)
        break

      case '/kcsapi/api_req_map/select_eventmap_rank':
        console.log(`select event difficulty`)
        break

      case '/kcsapi/api_req_kousyou/createship_speedchange':
        console.log(`using torch`)
        break

      case '/kcsapi/api_req_kaisou/slotset_ex':
        console.log(`extra slot equip changed`)
        break

      case '/kcsapi/api_get_member/sortie_conditions':
        console.log(`Check winrate \\ event tags`)
        break

      default:
        if (url.startsWith('http://www.dmm.com') ||
          url.startsWith('http://platform.twitter.com/') ||
          url.startsWith('http://ajax.googleapis.com') ||
          url.startsWith('http://www.googleadservices.com') ||
          url.startsWith('http://b92.yahoo.co.jp') ||
          url.startsWith('http://rt.gsspat.jp') ||
          url.startsWith('http://tg.socdm.com') ||
          url.startsWith('http://spdmg-backend2.i-mobile.co.jp') ||
          url.startsWith('https://www.dmm.com') ||
          url.startsWith('https://display.dmm.com') ||
          url.startsWith('https://trac.i3.dmm.com') ||
          url.startsWith('https://seal.verisign.com') ||
          url.startsWith('http://img.ak.impact-ad.jp') ||
          url.startsWith('http://dex.advg.jp') ||
          url.startsWith('http://cd.ladsp.com/') ||
          url.startsWith('https://b92.yahoo.co.jp/') ||
          url.startsWith('http://cache.send.microad.jp/') ||
          url.startsWith('http://px.ladsp.com/') ||
          url.startsWith('http://cd.ladsp.com/') ||
          url.startsWith('https://t.adclr.jp/') ||
          url.startsWith('https://cd-ladsp-com.s3.amazonaws.com/') ||
          url.startsWith('https://genieedmp.com/') ||
          url.startsWith('http://j.zucks.net.zimg.jp/') ||
          url.startsWith('https://rt.gsspat.jp/') ||
          url.startsWith('http://dsp.logly.co.jp/') ||
          url.startsWith('https://bid.g.doubleclick.net/') ||
          url.startsWith('http://adn-j.sp.gmossp-sp.jp/') ||
          url.startsWith('https://s.adroll.com/') ||
          url.startsWith('https://ums.adtech.de/') ||
          url.startsWith('https://trc.taboola.com/') ||
          url.startsWith('https://simage2.pubmatic.com/')
        ) {
          return
        }

        console.log(`recorded new unknown`)
        console.log(message.method, url)
        break
    }
  }
}
export default networkParser
