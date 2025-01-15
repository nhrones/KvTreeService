// deno-lint-ignore-file no-explicit-any

export type Callback = (error: any, result: any) => void

/** 
 * Named Procedure types    
 * Each procedure-type \<name\> is unique    
 * Each procedure-type registers a payload-type 
 * This payload-type is type-checked when coding procedure-calls
 */
export type TypedProcedures = {

   /** DELETE  */
   DELETE: {
      key: JsonArray
   },

   /** GET */
   GET:{
      key: JsonArray
   },

   /** GETALL */
   GETALL: Record<string | number | symbol, never>,

   /** SET */
   SET: {
      key: JsonArray
      value: JsonValue
   }
}

export type ObjectLiteral = {
   [key: string]: any;
}

export type DbRpcPackage = {
   procedure: 'DELETE' | 'GET' | 'GETALL' | 'SET',
   key: string,
   value?: string
}

export type TranactionID = number

export type RpcParams = JsonArray | JsonObject;

/** Responce object from Remote Procedure call */
export interface RpcResponse {
   /** unique tranaction ID */
   txID: TranactionID;
   /** an error value or null if no error */
   error: JsonValue | null;
   /** a  result value or null if has error */
   result: JsonValue | null;
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [member: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
