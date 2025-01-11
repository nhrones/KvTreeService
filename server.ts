//-----------------------------------------------------------
// get external dependencies
//-----------------------------------------------------------
import { registerClient } from "./deps.ts"
//-----------------------------------------------------------
// get internal dependencies
//-----------------------------------------------------------
import { DEV, corsResponse } from './context.ts'



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

         // extract the request packet
         const data = await request.json();

         // inform all interested parties about this RPC request
         const bc = new BroadcastChannel("sse-rpc");
         bc.postMessage(data);
         bc.close();

         // acknowledge the request
         return corsResponse()

      } else {
         const errMsg = `Error: Request was not a valid SSE request! (405)`
         console.error(errMsg)
         return Promise.resolve(new Response(errMsg, { status: 405 }))
      }

   }
)
