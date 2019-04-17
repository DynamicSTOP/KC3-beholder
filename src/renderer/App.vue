<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
  import '@/sass/app.scss'

  const images = [
    'https://cdn.awwni.me/u875.jpg',
    'https://pbs.twimg.com/media/D4HMLpGUEAAFdEG.jpg',
    'https://pbs.twimg.com/media/D2_DhC6U4AEvMai.jpg',
    'https://pbs.twimg.com/media/D4MJZSOXsAA34ag.jpg'
  ]
  const timePerImage = 10
  export default {
    name: 'kc3-beholder',
    mounted () {
      let styleCss
      if (images.length === 0) {
        return
      } else if (images.length === 1) {
        styleCss = 'html {\n' +
          `  background: url(${images[0]}) no-repeat;\n` +
          '  background-size: cover;\n' +
          '}'
      } else {
        let style = '@keyframes htmlBG {\n'
        style += images.map((url, index) => `${100 / images.length * index}% {background: url(${url}) no-repeat;background-size: cover;}\n` +
          `${(100 / images.length * (index + 1)) - 0.001}%{background: url(${url}) no-repeat;\nbackground-size: cover;\n}`
        ).join('\n')
        style += '}\n'
        style += 'html {\n' +
          '  background-size: cover;\n' +
          '  animation-name: htmlBG;\n' +
          `  animation-duration: ${timePerImage * images.length}s;\n` +
          '  animation-iteration-count: infinite;\n' +
          '  animation-timing-function: linear;\n' +
          '  animation-direction: alternate;\n' +
          '}'
        styleCss = style
      }

      let style = document.createElement('style')
      style.appendChild(document.createTextNode(''))
      this.styleNode = style.childNodes[0]
      document.head.appendChild(style)
      this.styleNode.textContent = styleCss
    }

  }
</script>
