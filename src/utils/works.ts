import { AxiosResponse } from 'axios';
import fs from 'fs';
import { FilterParameters } from 'src/types/filterParameters';
import { GroupBy, SortByWork, Works } from '../types/work';
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
 * @param {boolean} retriveAllPages - The `retriveAllPages` parameter is a boolean that represents whether to retrieve all pages.
 * @param {number} startPage - The `startPage` parameter is a number that represents the start page number.
 * @param {number} endPage - The `endPage` parameter is a number that represents the end page number.
 * @param {string} searchField - The `searchField` parameter is a string that represents the field to search in.
 * @throws {Error} - Throws an error if the parameters are invalid.
 */
export function validateParameters(
  retriveAllPages?: boolean,
  startPage?: number,
  endPage?: number,
  searchField?: string,
) {
  if (retriveAllPages && (startPage || endPage))
    throw new Error(
      'startPage and endPage are not allowed with retriveAllPages',
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
 * @param {boolean} retriveAllPages - The `retriveAllPages` parameter is a boolean that represents whether to retrieve all pages.
 * @returns {string} a string that represents the URL with the cursor appended.
 */
export function appendCursorToUrl(
  url: string,
  perPage?: number,
  cursor?: string,
  retriveAllPages?: boolean,
): string {
  url = perPage ? `${url}&per_page=${perPage}` : url;
  url =
    cursor && !retriveAllPages ? `${url}&cursor=${cursor}` : `${url}&cursor=*`;
  return url;
}

/**
 * The function `buildUrl` builds the URL based on the search parameters.
 * @param {string} baseUrl - The `baseUrl` parameter is a string that represents the base URL.
 * @param {string} search - The `search` parameter is a string that represents the search query.
 * @param {string} searchField - The `searchField` parameter is a string that represents the field to search in.
 * @param {FilterParameters} filter - The `filter` parameter is an object that represents the filter parameters.
 * @param {GroupBy} group_by - The `group_by` parameter is a string that represents the field to group by.
 * @param {SortByWork} sortBy - The `sortBy` parameter is an object that represents the sort parameters.
 * @returns {string} a string that represents the URL.
 */
export function buildUrl(
  baseUrl: string,
  search?: string,
  searchField?: string,
  filter?: FilterParameters,
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
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      getPaths(obj[key], newPath, result);
    } else {
      result[newPath.join('.')] = obj[key];
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
  page: number = 1,
  url: string,
  perPage: number = 25,
): Promise<string> {
  if (page === 1) return '*';

  let remainingPages = (page - 1) * perPage;
  let cursorPage = remainingPages;

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
  works.results = works.results.map((work) => {
    if (work.abstract_inverted_index)
      work.abstract = convertAbstractArrayToString(
        work.abstract_inverted_index,
      );
    delete work.abstract_inverted_index;
    return work;
  });
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
) {
  const totalPages = calculatePages(200, initialResponse.data.meta.count);
  const works = initialResponse.data;
  let cursor = works.meta.next_cursor;
  console.log('total number of pages ', totalPages);
  console.log('page', 1, 'response', initialResponse.status);
  for (let i = 2; i <= totalPages; i++) {
    const response: AxiosResponse<Works> = await GET(`${url}&cursor=${cursor}`);
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
  works.results = works.results.map((work) => {
    if (work.abstract_inverted_index)
      work.abstract = convertAbstractArrayToString(
        work.abstract_inverted_index,
      );
    delete work.abstract_inverted_index;
    return work;
  });
  if (toJson)
    fs.writeFileSync(`${toJson}.json`, JSON.stringify(works, null, 2));
  if (toCsv) {
    convertToCSV(works.results, toCsv);
  }
  return works;
}

/**
 * The function `filterBuilder` builds the filter string.
 * @param {FilterParameters} filter - The `filter` parameter is an object that represents the filter parameters.
 * @returns a string that represents the filter string.
 */
function filterBuilder(filter: FilterParameters) {
  let filterString = '';
  const filterObject = getPaths(filter);

  for (const key in filterObject) {
    filterString = `${filterString}${key}:${filterObject[key]},`;
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
