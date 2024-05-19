import { AxiosResponse } from 'axios';
import fs from 'fs';
import { Sources } from 'src/types/source';
import { convertToCSV } from './exportCSV';
import { calculatePages } from './helpers';
import { GET } from './http';

/**
 * The function `validateParameters` validates the search parameters.
 * @param {boolean} retriveAllPages - The `retriveAllPages` parameter is a boolean that represents whether to retrieve all pages.
 * @param {number} startPage - The `startPage` parameter is a number that represents the start page number.
 * @param {number} endPage - The `endPage` parameter is a number that represents the end page number.
 * @param {string} searchField - The `searchField` parameter is a string that represents the field to search in.
 * @throws {Error} - Throws an error if the parameters are invalid.
 */
export function validateAuthorParameters(
  retriveAllPages?: boolean,
  startPage?: number,
  endPage?: number,
  searchField?: string,
) {
  if (retriveAllPages && (startPage || endPage))
    throw new Error(
      'startPage and endPage are not allowed with retriveAllPages',
    );
  if (searchField && !['display_name'].includes(searchField))
    throw new Error(`Invalid search field: ${searchField}`);
}

/**
 * The function `handleMultiplePages` handles multiple pages.
 * @param {number} startPage - The `startPage` parameter is a number that represents the start page number.
 * @param {number} endPage - The `endPage` parameter is a number that represents the end page number.
 * @param {string} url - The `url` parameter is a string that represents the URL.
 * @param {AxiosResponse<Sources>} initialResponse - The `initialResponse` parameter is an object that represents the initial response.
 * @param {string} toJson - The `toJson` parameter is a string that represents the JSON file name.
 * @param {string} toCsv - The `toCsv` parameter is a string that represents the CSV file name.
 * @returns an object that represents the authors.
 */
export async function handleMultipleSourcesPages(
  startPage: number,
  endPage: number,
  url: string,
  initialResponse: AxiosResponse<Sources>,
  toJson?: string,
  toCsv?: string,
) {
  const sources = initialResponse.data;
  let cursor = sources.meta.next_cursor;
  url = url.split('&cursor')[0];
  for (let i = startPage + 1; i <= endPage; i++) {
    const response: AxiosResponse<Sources> = await GET(
      `${url}&cursor=${cursor}`,
    );
    if (response.status === 200) {
      sources.results = sources.results.concat(response.data.results);
      cursor = response.data.meta.next_cursor;
    } else throw new Error(`Error ${response.status}: ${response.statusText}`);
    if (i === endPage) {
      sources.meta.next_cursor = cursor;
      sources.meta.page = endPage;
    }
  }
  if (toJson)
    fs.writeFileSync(`${toJson}.json`, JSON.stringify(sources, null, 2));
  if (toCsv) convertToCSV(sources.results, toCsv);

  return sources;
}
/**
 * The function `handleAllPages` handles all pages.
 * @param {string} url - The `url` parameter is a string that represents the URL.
 * @param {AxiosResponse<Sources>} initialResponse - The `initialResponse` parameter is an object that represents the initial response.
 * @param {string} toJson - The `toJson` parameter is a string that represents the JSON file name.
 * @param {string} toCsv - The `toCsv` parameter is a string that represents the CSV file name.
 * @returns an object that represents the works.
 */
export async function handleAllSourcesPages(
  url: string,
  initialResponse: AxiosResponse<Sources>,
  toJson?: string,
  toCsv?: string,
) {
  const totalPages = calculatePages(200, initialResponse.data.meta.count);
  const sources = initialResponse.data;
  let cursor = sources.meta.next_cursor;
  console.log('total number of pages ', totalPages);
  console.log('page', 1, 'response', initialResponse.status);
  for (let i = 2; i <= totalPages; i++) {
    const response: AxiosResponse<Sources> = await GET(`${url}${cursor}`);
    console.log('page', i, 'response', response.status);
    if (response.status === 200) {
      sources.results = sources.results.concat(response.data.results);
      cursor = response.data.meta.next_cursor;
    } else throw new Error(`Error ${response.status}: ${response.statusText}`);
    if (i === totalPages) {
      sources.meta.next_cursor = cursor;
      sources.meta.page = totalPages;
    }
  }
  if (toJson)
    fs.writeFileSync(`${toJson}.json`, JSON.stringify(sources, null, 2));
  if (toCsv) {
    convertToCSV(sources.results, toCsv);
  }
  return sources;
}
