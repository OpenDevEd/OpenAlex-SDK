import { GroupByAuthor } from 'src/types/author';
import { AuthorFilterParameters } from 'src/types/authorFilterParameters';
import { GroupBySource } from 'src/types/source';
import { SourceFilterParameters } from 'src/types/sourceFilterParameters';
import { GroupByWorks, SortByWork } from 'src/types/work';
import { WorkFilterParameters } from 'src/types/workFilterParameters';

/**
 * The function `buildUrl` builds the URL based on the search parameters.
 * @param {string} baseUrl - The `baseUrl` parameter is a string that represents the base URL.
 * @param {string} search - The `search` parameter is a string that represents the search query.
 * @param {string} searchField - The `searchField` parameter is a string that represents the field to search in.
 * @param {WorkFilterParameters | AuthorFilterParameters | SourceFilterParameters} filter - The `filter` parameter is an object that represents the filter parameters.
 * @param {GroupByWorks} group_by - The `group_by` parameter is a string that represents the field to group by.
 * @param {SortByWork} sortBy - The `sortBy` parameter is an object that represents the sort parameters.
 * @returns {string} a string that represents the URL.
 */
export function buildUrl(
  baseUrl: string,
  endPoints: 'works' | 'authors' | 'sources',
  search?: string,
  searchField?: string,
  filter?:
    | WorkFilterParameters
    | AuthorFilterParameters
    | SourceFilterParameters,
  group_by?: GroupByWorks | GroupBySource | GroupByAuthor,
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
    | SourceFilterParameters,
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
  console.log(filterString);
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
