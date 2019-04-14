console.log('Hello from service worker')
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1')
  )
})

self.addEventListener('fetch', function (event) {
  if (event.request.url.match('//localhost') || event.request.url.match('//127.0.0.1') || event.request.url.match('file://')) {
    return
  }
  event.respondWith(caches.match(event.request).then(function (response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone()

        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone)
        })
        return response
      })
    }
  }))
})
