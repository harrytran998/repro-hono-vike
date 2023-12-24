import { renderPage } from "vike/server";
// import { serveStatic } from 'hono/cloudflare-workers'

import { showRoutes } from 'hono/dev';


import { Hono } from 'hono';

const app = new Hono<{
  Bindings: {
    NAME: string
    ASSETS: { fetch: typeof fetch }
  }
}>()
const isProduction = false
  if (isProduction) {
    // app.use("/", fromNodeMiddleware(serveStatic(`${root}/dist/client`)));
    // BUG __STATIC.... app.use('/*', serveStatic({ root: './dist/client' }))
  } else {
    
  }

  app.use("*", async (c, next) => {
    const pageContextInit = {
      urlOriginal: c.req.url,
    };
    const pageContext = await renderPage(pageContextInit);
    const response = pageContext.httpResponse;  
    if (!response) return;
    
    for (const [k, v] of response.headers) {
      c.res.headers.set(k, v)
    }
    const body = await response.getBody()
    return c.html(body, response.statusCode)
})

// app.use('/static/*', serveStatic({ root: './' }))
// app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))

  // Custom Not Found Message
app.notFound((c) => {
  return c.text('Custom 404 Not Found', 404)
})

// Error handling
app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})

showRoutes(app)

export default app
