import { FilterParameters } from 'src/types/filterParameters';
import { GroupBy, SortByWork } from '../types/work';
import { AxiosResponse } from 'axios';
import { Works } from '../types/work';
import { GET } from './http';
import { convertToCSV } from './exportCSV';
import fs from 'fs';

export function calculatePages(pageSize: number, total: number): number {
  const totalPages = Math.ceil(total / pageSize);
  return totalPages;
}
export function validateParameters(retriveAllPages?: boolean, startPage?: number, endPage?: number, searchField?: string) {
  if (retriveAllPages && (startPage || endPage)) throw new Error('startPage and endPage are not allowed with retriveAllPages');
  if (searchField && !['abstract', 'title', 'title_and_abstract', 'display_name', 'fulltext'].includes(searchField))
    throw new Error(`Invalid search field: ${searchField}`);
}

export function appendCursorToUrl(url: string, perPage?: number, cursor?: string, retriveAllPages?: boolean) {
  url = perPage ? `${url}&per_page=${perPage}` : url;
  url = cursor && !retriveAllPages ? `${url}&cursor=${cursor}` : `${url}&cursor=*`;
  return url;
}

export function buildUrl(baseUrl: string, search?: string, searchField?: string, filter?: FilterParameters, group_by?: GroupBy, sortBy?: SortByWork) {
  let filterParams = '';
  let SearchParams = '';
  let GroupByParams = '';
  let SortParams = '';
  if (filter) filterParams = filterBuilder(filter);
  if (group_by) GroupByParams = `&group_by=${group_by}`;
  if (sortBy) SortParams = sortBy.order === 'desc' ? `&sort=${sortBy.field}:${sortBy.order}` : `&sort=${sortBy.field}`;

  if (search && searchField) filterParams += filter ? `,${searchField}.search:${search}` : `${searchField}.search:${search}`;
  if (search && !searchField) SearchParams = `&search=${search}`;
  if (searchField || filter) filterParams = `&filter=${filterParams}`;
  return `${baseUrl}/works?${filterParams}${SearchParams}${GroupByParams}${SortParams}`;
}

export function appendPaginationToUrl(url: string, perPage?: number, page?: number, retriveAllPages?: boolean) {
  url = perPage ? `${url}&per_page=${perPage}` : url;
  url = page && !retriveAllPages ? `${url}&page=${page}` : url;
  return url;
}

export function getPaths(obj: { [x: string]: any }, path: string[] = [], result: { [key: string]: any } = {}) {
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

export async function getCursorByPage(page: number = 1, url: string, perPage: number = 25): Promise<string> {
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
    if (work.abstract_inverted_index) work.abstract = convertAbstractArrayToString(work.abstract_inverted_index);
    delete work.abstract_inverted_index;
    return work;
  });
  if (toJson) fs.writeFileSync(`${toJson}.json`, JSON.stringify(works, null, 2));
  if (toCsv) convertToCSV(works.results, toCsv);

  return works;
}

export async function handleAllPages(url: string, initialResponse: AxiosResponse<Works>, toJson?: string, toCsv?: string) {
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
    if (work.abstract_inverted_index) work.abstract = convertAbstractArrayToString(work.abstract_inverted_index);
    delete work.abstract_inverted_index;
    return work;
  });
  if (toJson) fs.writeFileSync(`${toJson}.json`, JSON.stringify(works, null, 2));
  if (toCsv) {
    convertToCSV(works.results, toCsv);
  }
  return works;
}

function filterBuilder(filter: FilterParameters) {
  let filterString = '';
  const filterObject = getPaths(filter);

  for (const key in filterObject) {
    filterString = `${filterString}${key}:${filterObject[key]},`;
  }
  filterString = filterString.slice(0, -1);
  return filterString;
}

export function convertAbstractArrayToString(abstract: { [key: string]: number[] }): string {
  const entries = Object.entries(abstract).flatMap(([key, value]) => value.map((v) => ({ key, value: v })));

  // Sort the array of objects by the value property
  const sortedEntries = entries.sort((a, b) => a.value - b.value);

  // Extract the key from each sorted object
  const keys = sortedEntries.map((entry) => entry.key);

  // Join these keys into a single string separated by spaces
  return keys.join(' ');
}
