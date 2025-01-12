
import { DEV } from "./server.ts"
//import {loadSample} from './utils.ts'

/** 
 * SSE stream headers 
 */
const StreamHeaders = {
   "content-type": "text/event-stream",
   "Access-Control-Allow-Origin": "*",
   "Cache-Control": "no-cache"
}
/** 
 * Subscribes a client to a Server Sent Event stream    
 * This stream supports remote DB transaction procedures (SSE-RPC)     
 * @param (Request) req - the original http request object    
 */
export function registerClient(req: Request): Response {

   if (DEV) console.info('Started SSE Stream! - ', req.url)

   /** 
    * each client gets its own BroadcastChannel instance
    */
   const thisChannel = new BroadcastChannel("sse-rpc");


   const stream = new ReadableStream({
      start: (controller) => {

         // listening for RPC or mutation-event messages
         thisChannel.onmessage = async (e) => {
            const { txID, procedure, params } = e.data
            if (DEV) console.log(`sse got - txID: ${txID}, procedure: ${procedure}, params: ${JSON.stringify(params)}`)

            let thisError: string | null = null
            let thisResult = null

            // calling Snapshot procedures
            switch (procedure) {
               /** Return all records */
               case 'GETALL': {
                  //await loadSample() // used to enter initial sample data
                  const result = await getAll()
                  thisResult = JSON.stringify(result) 
                  break;
               }
               /** default fall through */
               default: {
                  console.log('handling - default')
                  thisError = 'Unknown procedure called!';
                  thisResult = null
                  break;
               }
            }

            /** Build & stream SSE reply */
            const reply = JSON.stringify({
               txID: txID,
               error: thisError,
               result: thisResult
            })
            controller.enqueue('data: ' + reply + '\n\n');
         }
      },

      cancel() {
         thisChannel.close();
      }
   })

   return new Response(
      stream.pipeThrough(
         new TextEncoderStream()),
      { headers: StreamHeaders }
   )
}

/**
 *  bulk fetch - get all records
 */
async function getAll() {
   const shadowCache = new Map()
   const db = await Deno.openKv();
   const entries = db.list({ prefix: [] })
   for await (const entry of entries) {
      shadowCache.set(entry.key, entry.value)
   }
   db.close()
   return Array.from(shadowCache.entries())
}