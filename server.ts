
import { registerClient } from "./dbTransactions.ts"
export const DEV = true


/**
 *  Serve and handle all http requests
 */
Deno.serve({ port: 9099 },
   async (request: Request): Promise<Response> => {

      // Get and adjust the requested path name
      const { pathname } = new URL(request.url);
      console.log('Requesting - ' + pathname)
      // if this is a Registration request, register our new RPC-client
      if (pathname.includes("RpcRegistration")) {
         if (DEV) console.log('got RpcRegistration request!')
         return registerClient(request)

      } // POST requests = (Remote Procedure Calls)    
      else if (request.method === 'POST') {
         if (DEV) console.log('handling POST request!')

         // extract the request payload
         const data = await request.json();

         // inform all interested parties about this RPC request
         const bc = new BroadcastChannel("sse-rpc");
         bc.postMessage(data);
         bc.close();

         // acknowledge this POST request
         return new Response("",
            {
               status: 200,
               headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Cache-Control": "no-cache",
                  "Access-Control-Allow-Methods": "GET OPTIONS POST DELETE",
               },
            })

      } else {
         const errMsg = `Error: Request was not a valid RPC request! (405)`
         console.error(errMsg)
         return Promise.resolve(new Response(errMsg, { status: 405 }))
      }

   }
)
