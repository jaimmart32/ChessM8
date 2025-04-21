// import { User } from './classes/User.js'

const TIMEOUT = 10000

/**
 * @extends {Error}
 * @property {Response} response
 */
export class HttpError extends Error {
  response
  /**
   * @param {Response} response
   */
  constructor(response) {
    super(`HTTP error ${response.status}`);
    this.response = response
  }
}

/**
 * Makes a fetch call and returns the json response. If the response status is not 2xx,
 * it throws an HttpError. If the response is an html file, it returns the text response
 * instead of json.
 * @param {string} url - The url to fetch.
 * @param {RequestInit} [options] - The options to use for the fetch call.
 * @returns {Promise<any>} The response json or text.
 * @throws {HttpError} If the response status is not 2xx.
 */
export async function simpleFetch (url, options) {
  const result = await fetch(url, options);
  if (!result.ok) {
    throw new HttpError(result);
  }
  let isJsonResponse = result.headers.get('Content-Type')?.includes('application/json');

  if (isJsonResponse) {
    return (await result.json());
  }
  return (await result.text());
}

/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {any} [data]
 * @returns {Promise<Array<User>>}
 */
export async function getAPIData(apiURL, method = 'GET', data) {
  let apiData

  try {
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Access-Control-Allow-Origin', '*')
    if (data) {
      headers.append('Content-Length', String(JSON.stringify(data).length))
    }
    // Añadimos la cabecera Authorization si el usuario esta logueado
    // if (isUserLoggedIn()) {
    //   const userData = getDataFromSessionStorage()
    //   headers.append('Authorization', `Bearer ${userData?.user?.token}`)
    // }
    apiData = await simpleFetch(apiURL, {
      // Si la petición tarda demasiado, la abortamos
      signal: AbortSignal.timeout(TIMEOUT),
      method: method,
      body: data ?? undefined,
      headers: headers
    });
  } catch (/** @type {any | HttpError} */err) {
    // En caso de error, controlamos según el tipo de error
    if (err.name === 'AbortError') {
      console.error('Fetch abortado');
    }
    if (err instanceof HttpError) {
      if (err.response.status === 404) {
        console.error('Not found');
      }
      if (err.response.status === 500) {
        console.error('Internal server error');
      }
    }
  }

  return apiData
}