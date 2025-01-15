
/** load test data set */
export async function loadSample() {
   await clear()
   const db = await Deno.openKv()
   await db.set(["env", "cwd"], "./")
   await db.set(["env", "host"], "http://localhost")
   await db.set(["env", "port"], 9099)
   await db.set(["cfg", "target"], "./dist")
   await db.set(["cfg", "include"], "./src")
   await db.set(["cfg", "options"], { debug: true, useKv: true, dbFile: "./data/db.db" })
   await db.set(["users", "general", 1], { id: 1, first: "John", last: "Doe", age: 25, address: { street: '123 Main st.', city: 'Gotham', state: "CA", zip: 45927 } })
   await db.set(["users", "general", 2], { id: 2, first: "Jim", last: "Smith", age: 35, address: { street: '456 A st.', city: 'Fremont', state: "CA", zip: 45938 } })
   await db.set(["users", "general", 3], { id: 3, first: "Joe", last: "Smoe", age: 45, address: { street: '789 B st.', city: 'Hayward', state: "CA", zip: 45941 } })
   await db.set(["users", "admins", "super-user", 1], { id: 1, first: "Joe", last: "Smoe", age: 85})
   await db.set(["users", "admins", "super-user", 2], { id: 2, first: "John", last: "Smith", age: 25})
   await db.set(["users", "admins", "super-user", 3], { id: 3, first: "Tricky", last: "Nick", age: 52})
   await db.set(["users", "admins", "admin", 1], { id: 1, first: "Admin", last: "Admin", age: 60})
    db.close()
}

/** delete all rows from the db */
export async function clear() {
   const db = await Deno.openKv();
   getAllKeys()
      .then((keys) => {
         keys.forEach( (key) => {
            db.delete(key)
         })
      })
   db.close 
}

/**  bulk fetch - get record collections */
export async function getAllKeys() {
   const allKeys = []
   const db = await Deno.openKv();
   const entries = db.list({ prefix: [] })
   for await (const entry of entries) {
      console.log(entry.key)
      allKeys.push(entry.key)
   }
   db.close()
   return allKeys
}
