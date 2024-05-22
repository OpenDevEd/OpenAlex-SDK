import { AxiosResponse } from 'axios';
import { Authors, GroupByAuthor } from 'src/types/author';
import { AuthorFilterParameters } from 'src/types/authorFilterParameters';
import { GroupBySource } from 'src/types/source';
import { SourceFilterParameters } from 'src/types/sourceFilterParameters';
import { GroupByWorks, SortByWork, Works } from 'src/types/work';
import { WorkFilterParameters } from 'src/types/workFilterParameters';
import { GroupByInstitution } from '../types/institution';
import { InstitutionFilterParameters } from '../types/institutionFilterParameters';
import { GET } from './http';

/**
 * The function `buildUrl` builds the URL based on the search parameters.
 * @param {string} baseUrl - The `baseUrl` parameter is a string that represents the base URL.
 * @param {string} search - The `search` parameter is a string that represents the search query.
 * @param {string} searchField - The `searchField` parameter is a string that represents the field to search in.
 * @param {WorkFilterParameters | AuthorFilterParameters | SourceFilterParameters | InstitutionFilterParameters} filter - The `filter` parameter is an object that represents the filter parameters.
 * @param {GroupByWorks} group_by - The `group_by` parameter is a string that represents the field to group by.
 * @param {SortByWork} sortBy - The `sortBy` parameter is an object that represents the sort parameters.
 * @returns {string} a string that represents the URL.
 */
export function buildUrl(
  baseUrl: string,
  endPoints: 'works' | 'authors' | 'sources' | 'institutions',
  search?: string,
  searchField?: string,
  filter?:
    | WorkFilterParameters
    | AuthorFilterParameters
    | SourceFilterParameters
    | InstitutionFilterParameters,
  group_by?: GroupByWorks | GroupBySource | GroupByAuthor | GroupByInstitution,
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
  return `${baseUrl}/${endPoints}?${filterParams}${SearchParams}${GroupByParams}${SortParams}`;
}

function filterBuilder(
  filter:
    | WorkFilterParameters
    | AuthorFilterParameters
    | SourceFilterParameters
    | InstitutionFilterParameters,
) {
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

  let response: AxiosResponse<Works | Authors> = await GET(new_url);

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
