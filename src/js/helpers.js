import { TIMEOUT_SEC } from "./config.js";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Process request from user or process request to upload
 * @param {string} url Required for both POST and GET
 * @param {object} uploadData This only needed when want to post out new data into API (POST) | This requires API KEY
 * @returns {json} data
 */
//REFACTOR
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/*
//Fetch data and convert into JSON
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

//[NOTE] instead of console log(error), we throw error instead since the async function in the loadRecipe could not recognize this as rejection instead a fulfilled promise, therefore, need to throw err to reject promise

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
