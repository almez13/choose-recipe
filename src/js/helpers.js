import { TIMEOUT_SEC } from "./config";

//put here helpers functions which we reuse over and over in the project
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData ? fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadData),
    }) : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();  
    if(!res.ok) throw new Error(`${data.message}, ${res.status}`);
    return data;
  } catch(err) {
    //rethrow an error
    throw err;
  }
};

/*
//GET from API
export const getJSON = async function(url) {
  try {
    //race between tetch and reject promies in case of bad conection
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();    
    if(!res.ok) throw new Error(`${data.message}, ${res.status}`);
    return data;
  } catch(err) {
    //rethrow an error
    throw err;
  }
};

//POST to API
export const sendJSON = async function(url, uploadData) {
  try {
    //create object to send
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadData),

    });
    //race between tetch and reject promies in case of bad conection
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();    
    if(!res.ok) throw new Error(`${data.message}, ${res.status}`);
    return data;
  } catch(err) {
    //rethrow an error
    throw err;
  }
};
*/