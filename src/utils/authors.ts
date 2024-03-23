import { AxiosResponse } from 'axios';
import fs from 'fs';
import { Authors, GroupBy, SortByWork } from 'src/types/author';
import { AuthorFilterParameters } from 'src/types/authorFilterParameters';
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
 * @param {AuthorFilterParameters} filter - The `filter` parameter is an object that represents the filter parameters.
 * @param {GroupBy} group_by - The `group_by` parameter is a string that represents the field to group by.
 * @param {SortByWork} sortBy - The `sortBy` parameter is an object that represents the sort parameters.
 * @returns {string} a string that represents the URL.
 */
export function buildAuthorsUrl(
  baseUrl: string,
  search?: string,
  searchField?: string,
  filter?: AuthorFilterParameters,
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
  return `${baseUrl}/authors?${filterParams}${SearchParams}${GroupByParams}${SortParams}`;
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

  let response: AxiosResponse<Authors> = await GET(new_url);

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
 * @param {AxiosResponse<Authors>} initialResponse - The `initialResponse` parameter is an object that represents the initial response.
 * @param {string} toJson - The `toJson` parameter is a string that represents the JSON file name.
 * @param {string} toCsv - The `toCsv` parameter is a string that represents the CSV file name.
 * @returns an object that represents the works.
 */
export async function handleMultipleAuthorsPages(
  startPage: number,
  endPage: number,
  url: string,
  initialResponse: AxiosResponse<Authors>,
  toJson?: string,
  toCsv?: string,
) {
  const authors = initialResponse.data;
  let cursor = authors.meta.next_cursor;
  url = url.split('&cursor')[0];
  for (let i = startPage + 1; i <= endPage; i++) {
    const response: AxiosResponse<Authors> = await GET(
      `${url}&cursor=${cursor}`,
    );
    if (response.status === 200) {
      authors.results = authors.results.concat(response.data.results);
      cursor = response.data.meta.next_cursor;
    } else throw new Error(`Error ${response.status}: ${response.statusText}`);
    if (i === endPage) {
      authors.meta.next_cursor = cursor;
      authors.meta.page = endPage;
    }
  }
  if (toJson)
    fs.writeFileSync(`${toJson}.json`, JSON.stringify(authors, null, 2));
  if (toCsv) convertToCSV(authors.results, toCsv);

  return authors;
}

/**
 * The function `handleAllPages` handles all pages.
 * @param {string} url - The `url` parameter is a string that represents the URL.
 * @param {AxiosResponse<Authors>} initialResponse - The `initialResponse` parameter is an object that represents the initial response.
 * @param {string} toJson - The `toJson` parameter is a string that represents the JSON file name.
 * @param {string} toCsv - The `toCsv` parameter is a string that represents the CSV file name.
 * @returns an object that represents the works.
 */
export async function handleAllAuthorsPages(
  url: string,
  initialResponse: AxiosResponse<Authors>,
  toJson?: string,
  toCsv?: string,
) {
  const totalPages = calculatePages(200, initialResponse.data.meta.count);
  const authors = initialResponse.data;
  let cursor = authors.meta.next_cursor;
  console.log('total number of pages ', totalPages);
  console.log('page', 1, 'response', initialResponse.status);
  for (let i = 2; i <= totalPages; i++) {
    const response: AxiosResponse<Authors> = await GET(
      `${url}&cursor=${cursor}`,
    );
    console.log('page', i, 'response', response.status);
    if (response.status === 200) {
      authors.results = authors.results.concat(response.data.results);
      cursor = response.data.meta.next_cursor;
    } else throw new Error(`Error ${response.status}: ${response.statusText}`);
    if (i === totalPages) {
      authors.meta.next_cursor = cursor;
      authors.meta.page = totalPages;
    }
  }

  if (toJson)
    fs.writeFileSync(`${toJson}.json`, JSON.stringify(authors, null, 2));
  if (toCsv) {
    convertToCSV(authors.results, toCsv);
  }
  return authors;
}

/**
 * The function `filterBuilder` builds the filter string.
 * @param {AuthorFilterParameters} filter - The `filter` parameter is an object that represents the filter parameters.
 * @returns a string that represents the filter string.
 */
function filterBuilder(filter: AuthorFilterParameters) {
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
