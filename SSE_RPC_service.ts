import { RPC_Channel_Name } from "./server.ts"
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
 * This stream implements Calls to a single Remote KvDB Procedure 'GETALL' (SSE-RPC)   
 * The persistent stream returns values to the connected clients EventSource   
 * 
 * NOTE: This is a stripped-down version of a full `Kv-CRUD`, `File-IO`, and `Relay` RPC-Service.       
 */
export function buildClientStream(): Response {
   /** each client gets its own BroadcastChannel instance */
   const rpcChannel = new BroadcastChannel(RPC_Channel_Name);
   /** create a persistent stream for each client connection */ 
   const stream = new ReadableStream({
      start: (controller) => {
         // listen for any RPC event messages
         rpcChannel.onmessage = async (e) => {
            const { txID, procedure } = e.data
            let thisError: string | null = null
            let thisResult: string | null = null

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

            /** Build & stream the RPC reply */
            const reply = JSON.stringify({
               txID: txID,
               error: thisError,
               result: thisResult
            })
            controller.enqueue('data: ' + reply + '\n\n');
         }
      },

      cancel() {
         rpcChannel.close();
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