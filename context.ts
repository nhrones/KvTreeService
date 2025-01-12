export const DEV = true

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

