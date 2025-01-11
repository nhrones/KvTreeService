
import { dbOptions } from "./deps.ts"

export const DEV = true
export const Host = "localhost"
export const Port = 9099

/** path to the sqlite db file */
//export const DBPath = "./dbService/data/db.db"
  
export const Options: dbOptions = {
   Schema: {
      name: 'users',
      sample: { name: "nick" }
   },
   Rows: 100,
   RowsPerPage: 10,
   Size: 100
}

/** The number of records to test with */
export const SIZE = 100000

/**
 * A cors permisive responce
 */
export const corsResponse = (body = '') => new Response ( body,
    {
        status: 200,
        headers: { 
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache",
            "Access-Control-Allow-Methods": "GET OPTIONS POST DELETE",
     },
    }
);
