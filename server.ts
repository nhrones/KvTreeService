import { buildClientStream } from "./SSE_RPC_service.ts"
export const RPC_Channel_Name = "RPC"
export const DEV = !!Deno.env.get("DEV")

/**
 *  Serve and handle all http requests
 */
Deno.serve({ port: 9099 },
   async (request: Request): Promise<Response> => {
      const { pathname } = new URL(request.url);
      // if this is a Registration request, register our new SSE-RPC-client
      if (pathname.includes("RpcRegistration")) {
         return buildClientStream() // returns an SSE stream
      }
      // POST requests always contain `Remote Procedure Calls`   
      else if (request.method === 'POST') {
         // extract the request payload
         const data = await request.json();
         // inform any registered SSE-RPC-clients about this RPC request
         // we use a BroadcastChannel to bridge regions and/or isolates
         const bc = new BroadcastChannel(RPC_Channel_Name);
         bc.postMessage(data);
         bc.close();
         // just acknowledge this POST request
         return new Response("", {
            status: 200,
            headers: {
               "Access-Control-Allow-Origin": "*",
               "Cache-Control": "no-cache",
               "Access-Control-Allow-Methods": "GET OPTIONS POST DELETE",
            }
         })
      } 
      // unknown request
      else {
         const errMsg = `Error: Request was not a valid RPC request! (405)`
         console.error(errMsg)
         return Promise.resolve(new Response(errMsg, { status: 405 }))
      }
   }
)
