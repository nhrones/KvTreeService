// deno-lint-ignore-file no-explicit-any
export type Callback = (error: any, result: any) => void

/**
 *  User Type
 */
export type UserType = {
   id: number,
   first: string,
   last: string,
   age: number,
   version: string
}

export type RpcReturnType = {
   querySet: ObjectLiteral[]
   totalPages: number,
   currentPage: number
}

/** 
 * Named Procedure types    
 * Each procedure-type \<name\> is unique    
 * Each procedure-type registers a payload-type 
 * This payload-type is type-checked when coding procedure-calls
 */
export type TypedProcedures = {

   /** DELETE event */
   DELETE: {
      collection: string
      id: number
   },

   /** ORDER */
   ORDER: {
      column: string,
      direction: string
   },

   /** FILTER */
   FILTER: {
      columnName: string,
      value: string
   },

   /** GETMANY */
   GETMANY: {
      collection: string,
      size: number
   },

   /** PAGINATE event */
   PAGINATE: {
      collection: string
      rowsPerPage: number
      currentPage: number
   },

   /** SET event */
   SET: {
      collection: string
      id: number
      value: UserType
      currentPage: number
      rowsPerPage: number
   }
}

export type ObjectLiteral = {
   [key: string]: any;
}

export type DbRpcPackage = {
   procedure: 'GET' | 'PUT',
   key: string,
   value?: string
}

//=========================================================
//                         RPC
// ========================================================

/** queryParameters */
export type QueryParams = {
   filterColumn: string, 
   filterValue: string,
   orderColumn: string, 
   direction: string
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
