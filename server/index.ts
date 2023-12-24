import CredentialsProvider from "@auth/core/providers/credentials";
import { VikeAuth } from "vike-authjs";
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
    // app.use('/*', serveStatic({ root: './dist/client' }))
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
    c.res.headers.set('Content-Type', 'text/html; charset=utf-8')
    const body = await response.getBody()
    return c.html(body, response.statusCode)
})

  const Auth = VikeAuth({
    secret: "MY_SECRET",
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
        async authorize() {
          // Add logic here to look up the user from the credentials supplied
          const user = {
            id: "1",
            name: "J Smith",
            email: "jsmith@example.com",
          };

          // Any object returned will be saved in `user` property of the JWT
          // If you return null then an error will be displayed advising the user to check their details.
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          return user ?? null;
        },
      }),
    ],
  });

//   app.use('/static/*', serveStatic({ root: './' }))
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
