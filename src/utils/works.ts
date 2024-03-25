import { AxiosResponse } from 'axios';
import fs from 'fs';
import { WorkFilterParameters } from 'src/types/workFilterParameters';
import { GroupBy, SortByWork, Work, Works } from '../types/work';
import { convertToCSV } from './exportCSV';
import { GET } from './http';

/**
 * The function `calculatePages` calculates the total number of pages based on the total number of works and the number of works per page.
 * @param {number} pageSize - The `pageSize` parameter is a number that represents the number of works per page.
 * @param {number} total - The `total` parameter is a number that represents the total number of works.
 * @returns {number} a number that represents the total number of pages.
 */
export function calculatePages(pageSize: number, total: number): number {
  const totalPages = Math.ceil(total / pageSize);
  return totalPages;
}

/**
 * The function `validateParameters` validates the search parameters.
 * @param {boolean} retrieveAllPages - The `retrieveAllPages` parameter is a boolean that represents whether to retrieve all pages.
 * @param {number} startPage - The `startPage` parameter is a number that represents the start page number.
 * @param {number} endPage - The `endPage` parameter is a number that represents the end page number.
 * @param {string} searchField - The `searchField` parameter is a string that represents the field to search in.
 * @throws {Error} - Throws an error if the parameters are invalid.
 */
export function validateParameters(
  retrieveAllPages?: boolean,
  startPage?: number,
  endPage?: number,
  searchField?: string,
) {
  if (retrieveAllPages && (startPage || endPage))
    throw new Error(
      'startPage and endPage are not allowed with retrieveAllPages',
    );
  if (
    searchField &&
    ![
      'abstract',
      'title',
      'title_and_abstract',
      'display_name',
      'fulltext',
    ].includes(searchField)
  )
    throw new Error(`Invalid search field: ${searchField}`);
}

/**
 * The function `appendCursorToUrl` appends the cursor to the URL.
 * @param {string} url - The `url` parameter is a string that represents the URL.
 * @param {number} perPage - The `perPage` parameter is a number that represents the number of works per page.
 * @param {string} cursor - The `cursor` parameter is a string that represents the cursor.
 * @param {boolean} retrieveAllPages - The `retrieveAllPages` parameter is a boolean that represents whether to retrieve all pages.
 * @returns {string} a string that represents the URL with the cursor appended.
 */
export function appendCursorToUrl(
  url: string,
  perPage?: number,
  cursor?: string,
  retrieveAllPages?: boolean,
): string {
  url = perPage ? `${url}&per_page=${perPage}` : url;
  url =
    cursor && !retrieveAllPages ? `${url}&cursor=${cursor}` : `${url}&cursor=*`;
  return url;
}

/**
 * The function `buildUrl` builds the URL based on the search parameters.
 * @param {string} baseUrl - The `baseUrl` parameter is a string that represents the base URL.
 * @param {string} search - The `search` parameter is a string that represents the search query.
 * @param {string} searchField - The `searchField` parameter is a string that represents the field to search in.
 * @param {WorkFilterParameters} filter - The `filter` parameter is an object that represents the filter parameters.
 * @param {GroupBy} group_by - The `group_by` parameter is a string that represents the field to group by.
 * @param {SortByWork} sortBy - The `sortBy` parameter is an object that represents the sort parameters.
 * @returns {string} a string that represents the URL.
 */
export function buildUrl(
  baseUrl: string,
  search?: string,
  searchField?: string,
  filter?: WorkFilterParameters,
  group_by?: GroupBy,
  sortBy?: SortByWork,
): string {
  let filterParams = '';
  let SearchParams = '';
  let GroupByParams = '';
  let SortParams = '';
  if (filter) filterParams = filterBuilder(filter);
  if (group_by) GroupByParams = `&group_by=${group_by}`;
  if (sortBy)
    SortParams =
      sortBy.order === 'desc'
        ? `&sort=${sortBy.field}:${sortBy.order}`
        : `&sort=${sortBy.field}`;

  if (search && searchField)
    filterParams += filter
      ? `,${searchField}.search:${search}`
      : `${searchField}.search:${search}`;
  if (search && !searchField) SearchParams = `&search=${search}`;
  if (searchField || filter) filterParams = `&filter=${filterParams}`;
  return `${baseUrl}/works?${filterParams}${SearchParams}${GroupByParams}${SortParams}`;
}

/**
 * The function `getPaths` gets the paths of an object.
 * @param {object} obj - The `obj` parameter is an object.
 * @param {string[]} path - The `path` parameter is an array of strings.
 * @param {object} result - The `result` parameter is an object.
 * @returns an object that represents the paths.
 * @example
 * const obj = {
 *  a: {
 *    b: {
 *    c: 1,
 *    d: 2,
 *   },
 *  e: 3,
 * };
 * const paths = getPaths(obj);
 * console.log(paths);
 * // Output: { 'a.b.c': 1, 'a.b.d': 2, 'a.e': 3 }
 */
export function getPaths(
  obj: { [x: string]: any },
  path: string[] = [],
  result: { [key: string]: any } = {},
) {
  for (const key in obj) {
    const newPath = [...path, key];
    if (Array.isArray(obj[key])) {
      obj[key].forEach((item: any) => {
        if (typeof item === 'object' && item !== null) {
          getPaths(item, newPath, result);
        } else {
          const joinedPath = newPath.join('.');
          if (!result[joinedPath]) {
            result[joinedPath] = [];
          }
          result[joinedPath].push(item);
        }
      });
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      getPaths(obj[key], newPath, result);
    } else {
      const joinedPath = newPath.join('.');
      if (!result[joinedPath]) {
        result[joinedPath] = [];
      }
      result[joinedPath].push(obj[key]);
    }
  }
  return result;
}

/**
 * The function `getCursorByPage` take a page number and a URL and returns the cursor.
 * @param {number} page - The `page` parameter is a number that represents the page number.
 * @param {string} url - The `url` parameter is a string that represents the URL.
 * @param {number} perPage - The `perPage` parameter is a number that represents the number of works per page.
 * @returns a string that represents the cursor.
 */
export async function getCursorByPage(
  url: string,
  page: number = 1,
  perPage: number = 25,
): Promise<string> {
  if (page === 1) return '*';

  let remainingPages = (page - 1) * perPage;
  let cursorPage;

  if (remainingPages <= 200) {
    cursorPage = remainingPages;
    remainingPages = 0;
  } else {
    cursorPage = 200;
    remainingPages = remainingPages - 200;
  }

  let new_url = appendCursorToUrl(url, cursorPage, '*', false);

  let response: AxiosResponse<Works> = await GET(new_url);

  if (response.status !== 200) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  let cursor = response.data.meta.next_cursor;

  while (remainingPages > 0) {
    if (remainingPages <= 200) {
      cursorPage = remainingPages;
      remainingPages = 0;
    } else {
      cursorPage = 200;
      remainingPages = remainingPages - 200;
    }

    new_url = appendCursorToUrl(url, cursorPage, cursor, false);

    response = await GET(new_url);
    if (response.status === 200) {
      cursor = response.data.meta.next_cursor;
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
  return cursor;
}

/**
 * The function `handleMultiplePages` handles multiple pages.
 * @param {number} startPage - The `startPage` parameter is a number that represents the start page number.
 * @param {number} endPage - The `endPage` parameter is a number that represents the end page number.
 * @param {string} url - The `url` parameter is a string that represents the URL.
 * @param {AxiosResponse<Works>} initialResponse - The `initialResponse` parameter is an object that represents the initial response.
 * @param {string} toJson - The `toJson` parameter is a string that represents the JSON file name.
 * @param {string} toCsv - The `toCsv` parameter is a string that represents the CSV file name.
 * @returns an object that represents the works.
 */
export async function handleMultiplePages(
  startPage: number,
  endPage: number,
  url: string,
  initialResponse: AxiosResponse<Works>,
  toJson?: string,
  toCsv?: string,
  AbstractArrayToString?: boolean,
) {
  const works = initialResponse.data;
  let cursor = works.meta.next_cursor;
  url = url.split('&cursor')[0];
  for (let i = startPage + 1; i <= endPage; i++) {
    const response: AxiosResponse<Works> = await GET(`${url}&cursor=${cursor}`);
    if (response.status === 200) {
      works.results = works.results.concat(response.data.results);
      cursor = response.data.meta.next_cursor;
    } else throw new Error(`Error ${response.status}: ${response.statusText}`);
    if (i === endPage) {
      works.meta.next_cursor = cursor;
      works.meta.page = endPage;
    }
  }
  if (AbstractArrayToString) {
    works.results = works.results.map((work) => {
      if (work.abstract_inverted_index)
        work.abstract = convertAbstractArrayToString(
          work.abstract_inverted_index,
        );
      delete work.abstract_inverted_index;
      return work;
    });
  }
  if (toJson)
    fs.writeFileSync(`${toJson}.json`, JSON.stringify(works, null, 2));
  if (toCsv) convertToCSV(works.results, toCsv);

  return works;
}

/**
 * The function `handleAllPages` handles all pages.
 * @param {string} url - The `url` parameter is a string that represents the URL.
 * @param {AxiosResponse<Works>} initialResponse - The `initialResponse` parameter is an object that represents the initial response.
 * @param {string} toJson - The `toJson` parameter is a string that represents the JSON file name.
 * @param {string} toCsv - The `toCsv` parameter is a string that represents the CSV file name.
 * @returns an object that represents the works.
 */
export async function handleAllPages(
  url: string,
  initialResponse: AxiosResponse<Works>,
  toJson?: string,
  toCsv?: string,
  AbstractArrayToString?: boolean,
) {
  const totalPages = calculatePages(200, initialResponse.data.meta.count);
  const works = initialResponse.data;
  let cursor = works.meta.next_cursor;
  console.log('total number of pages ', totalPages);
  console.log('page', 1, 'response', initialResponse.status);
  for (let i = 2; i <= totalPages; i++) {
    const response: AxiosResponse<Works> = await GET(`${url}${cursor}`);
    console.log('page', i, 'response', response.status);
    if (response.status === 200) {
      works.results = works.results.concat(response.data.results);
      cursor = response.data.meta.next_cursor;
    } else throw new Error(`Error ${response.status}: ${response.statusText}`);
    if (i === totalPages) {
      works.meta.next_cursor = cursor;
      works.meta.page = totalPages;
    }
  }
  if (AbstractArrayToString) {
    works.results = works.results.map((work) => {
      if (work.abstract_inverted_index)
        work.abstract = convertAbstractArrayToString(
          work.abstract_inverted_index,
        );
      delete work.abstract_inverted_index;
      return work;
    });
  }
  if (toJson)
    fs.writeFileSync(`${toJson}.json`, JSON.stringify(works, null, 2));
  if (toCsv) {
    convertToCSV(works.results, toCsv);
  }
  return works;
}
export async function handleAllPagesInChunks(
  url: string,
  initialResponse: AxiosResponse<Works>,
  toJson?: string,
  toCsv?: string,
  AbstractArrayToString?: boolean,
  chunkSize: number = 1000,
) {
  const totalPages = calculatePages(200, initialResponse.data.meta.count);
  const works = initialResponse.data;
  let cursor = works.meta.next_cursor;
  console.log('total number of pages ', totalPages);
  console.log('page', 1, 'response', initialResponse.status);
  let chunk: Work[] = [];
  chunk.push(...works.results);
  let start = 0;
  let end;
  for (let i = 1; i <= totalPages - 1; i++) {
    const response: AxiosResponse<Works> = await GET(`${url}${cursor}`);
    console.log('page', i, 'response', response.status);
    if (response.status === 200) {
      chunk.push(...response.data.results);
      cursor = response.data.meta.next_cursor; // Update the cursor here
      if (chunk.length >= chunkSize || i === totalPages - 1) {
        if (AbstractArrayToString) {
          chunk = chunk.map((work) => {
            if (work.abstract_inverted_index)
              work.abstract = convertAbstractArrayToString(
                work.abstract_inverted_index,
              );
            delete work.abstract_inverted_index;
            return work;
          });
        }
        if (toJson) {
          if (!fs.existsSync(toJson)) {
            fs.mkdirSync(toJson);
          }

          end = start + chunk.length;
          const startFormatted = formatNumber(
            Number((start + 1).toString().padStart(7, '0')),
          );
          const endFormatted = formatNumber(
            Number(end.toString().padStart(7, '0')),
          );

          fs.writeFileSync(
            `${toJson}/${toJson}_${startFormatted}-${endFormatted}.json`,
            JSON.stringify(chunk, null, 2),
          );
          start = end;
        }
        if (toCsv) {
          if (!fs.existsSync(toCsv)) {
            fs.mkdirSync(toCsv);
          }
          end = start + chunk.length;
          const startFormatted = formatNumber(
            Number((start + 1).toString().padStart(7, '0')),
          );
          const endFormatted = formatNumber(
            Number(end.toString().padStart(7, '0')),
          );
          convertToCSV(
            chunk,
            `${toCsv}/${toCsv}_${startFormatted}-${endFormatted}.csv`,
          );
          start = end;
        }
        chunk = [];
      }
    } else throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return works;
}
function formatNumber(num: number): string {
  // Pad the number to 7 digits
  const paddedNum = num.toString().padStart(7, '0');

  // Format the padded number with commas as thousands separators
  const parts = paddedNum.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
}
/**
 * The function `filterBuilder` builds the filter string.
 * @param {WorkFilterParameters} filter - The `filter` parameter is an object that represents the filter parameters.
 * @returns a string that represents the filter string.
 */
function filterBuilder(filter: WorkFilterParameters) {
  let filterString = '';
  const filterObject = getPaths(filter);

  for (const key in filterObject) {
    if (Array.isArray(filterObject[key])) {
      filterString = `${filterString}${key}:${filterObject[key].join('|')},`;
    } else {
      filterString = `${filterString}${key}:${filterObject[key]},`;
    }
  }
  filterString = filterString.slice(0, -1);
  return filterString;
}

/**
 * The function `convertAbstractArrayToString` converts an abstract array to a string.
 * @param {object} abstract - The `abstract` parameter is an object that represents the abstract array.
 * @returns a string that represents the abstract array as a string.
 */
export function convertAbstractArrayToString(abstract: {
  [key: string]: number[];
}): string {
  const entries = Object.entries(abstract).flatMap(([key, value]) =>
    value.map((v) => ({ key, value: v })),
  );

  // Sort the array of objects by the value property
  const sortedEntries = entries.sort((a, b) => a.value - b.value);

  // Extract the key from each sorted object
  const keys = sortedEntries.map((entry) => entry.key);

  // Join these keys into a single string separated by spaces
  return keys.join(' ');
}
