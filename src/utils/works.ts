import { AxiosResponse } from 'axios';
import fs from 'fs';
import { FilterParameters } from 'src/types/filterParameters';
import { GroupBy, SortByWork, Works } from '../types/work';
import { convertToCSV } from './exportCSV';
import { GET } from './http';

export function calculatePages(pageSize: number, total: number): number {
  const totalPages = Math.ceil(total / pageSize);
  return totalPages;
}
export function validateParameters(retriveAllPages?: boolean, startPage?: number, endPage?: number, searchField?: string) {
  if (retriveAllPages && (startPage || endPage)) throw new Error('startPage and endPage are not allowed with retriveAllPages');
  if (searchField && !['abstract', 'title', 'title_and_abstract', 'display_name', 'fulltext'].includes(searchField))
    throw new Error(`Invalid search field: ${searchField}`);
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

export async function handleMultiplePages(
  startPage: number,
  endPage: number,
  url: string,
  initialResponse: AxiosResponse<Works>,
  toJson?: string,
  toCsv?: string,
) {
  const works = initialResponse.data;
  url = url.split('&page')[0];
  for (let i = startPage + 1; i <= endPage; i++) {
    const response: AxiosResponse<Works> = await GET(`${url}&page=${i}`);
    if (response.status === 200) works.results = works.results.concat(response.data.results);
    else throw new Error(`Error ${response.status}: ${response.statusText}`);
    if (i === endPage) works.meta.page = endPage;
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

export async function handleAllPages(url: string, initialResponse: AxiosResponse<Works>, toJson?: string, toCsv?: string) {
  const totalPages = calculatePages(200, initialResponse.data.meta.count);
  const works = initialResponse.data;
  console.log('total number of pages ', totalPages);
  console.log('page', 1, 'response', initialResponse.status);
  for (let i = 2; i <= totalPages; i++) {
    const response: AxiosResponse<Works> = await GET(`${url}&page=${i}`);
    console.log('page', i, 'response', response.status);
    if (response.status === 200) works.results = works.results.concat(response.data.results);
    else throw new Error(`Error ${response.status}: ${response.statusText}`);
    if (i === totalPages) works.meta.page = totalPages;
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
