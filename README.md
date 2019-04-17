# kc3-beholder

> Standalone viewer based on KC3

---

#### Links:  

[NodeJs](https://nodejs.org/en/)  
[VueJs](https://vuejs.org/)  
[KC3](https://github.com/KC3Kai/KC3Kai) - base idea, icons  
[WhoCallsTheFleet](https://github.com/TeamFleet/WhoCallsTheFleet) - ship\gears data  
[SVGRepo](https://www.svgrepo.com/) svg icons  
[Figma](https://www.figma.com/file/gP6XStywHgz0uR1mQ10lGPFP/kc3-panel?node-id=0%3A1) mock-up  
[Trello](https://trello.com/b/wBuV47Ki/kc-panel) ideas board
  
This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

---

#### Build Setup

``` bash
# 1. install dependencies
npm install

# 2. create .env (use .env.example)

# 3. (re)generate data
npm run generateData

# 4. serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

Current versions connects to existing chrome process with running game.
In order to do so you will need to start chrome with such flag `--remote-debugging-port=9222`.

A little bit more advanced situation:  
Yes, it can connect to chrome even on different pc, but you will have to also add `--remote-debugging-address` (which i haven't tested and it might not work).
Alternatively you can make a tunnel with ssh or putty ~~or even redirect incoming connections to chrome port~~.  
**Keep in mind that redirecting ports without any security knowledge in that area is equal to just placing your pc with running chrome in public. DO NOT! NOT! DO NOT LET THAT PORT BE OPEN TO INTERNET!!!**. Chrome listens to localhost for a reason. And this reason called **security**. You've been warned.
