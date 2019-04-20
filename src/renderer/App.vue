<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
  import '@/sass/app.scss'
  //
  // updating through pure css will take up to 5% cpu...
  const images = [
    'https://cdn.awwni.me/u875.jpg',
    'https://pbs.twimg.com/media/D4HMLpGUEAAFdEG.jpg',
    'https://pbs.twimg.com/media/D2_DhC6U4AEvMai.jpg',
    'https://pbs.twimg.com/media/D4MJZSOXsAA34ag.jpg'
  ]
  const timePerImage = 10
  let imageIndex = 0

  function updateBg () {
    document.body.parentNode.style = `--bg-img-path: url(${images[imageIndex]}) no-repeat;`
    imageIndex++
    if (imageIndex >= images.length) {
      imageIndex = 0
    }
  }

  export default {
    name: 'kc3-beholder',
    mounted () {
      let styleCss
      if (images.length === 0) {
        return
      } else if (images.length === 1) {
        styleCss = `html { background: url(${images[0]}); background-size: cover;}`
      } else {
        styleCss = `html { background: var(--bg-img-path); background-size: cover; }`
      }

      let style = document.createElement('style')
      style.appendChild(document.createTextNode(''))
      this.styleNode = style.childNodes[0]
      document.head.appendChild(style)
      this.styleNode.textContent = styleCss

      setInterval(updateBg, timePerImage * 1000)
      updateBg()
    }

  }
</script>
