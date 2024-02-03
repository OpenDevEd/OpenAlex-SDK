import { AxiosResponse } from 'axios';
import fs from 'fs';
import { Works } from '../types/workTypes';
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

export function buildUrl(baseUrl: string, search?: string, searchField?: string) {
  let url = `${baseUrl}/works`;
  if (search && searchField) url = `${baseUrl}/works?filter=${searchField}.search:${search}`;
  if (search && !searchField) url = `${baseUrl}/works?search=${search}`;
  return url;
}

export function appendPaginationToUrl(url: string, perPage?: number, page?: number, retriveAllPages?: boolean) {
  url = perPage ? `${url}&per_page=${perPage}` : url;
  url = page && !retriveAllPages ? `${url}&page=${page}` : url;
  return url;
}

export async function handleMultiplePages(startPage: number, endPage: number, url: string, initialResponse: AxiosResponse<Works>, fileName?: string) {
  const works = initialResponse.data;
  url = url.split('&page')[0];
  for (let i = startPage + 1; i <= endPage; i++) {
    const response: AxiosResponse<Works> = await GET(`${url}&page=${i}`);
    console.log('page', i, 'response', response.status);
    if (response.status === 200) works.results = works.results.concat(response.data.results);
    else throw new Error(`Error ${response.status}: ${response.statusText}`);
    if (i === endPage) works.meta.page = endPage;
  }
  if (fileName) fs.writeFileSync(`${fileName}.json`, JSON.stringify(works, null, 2));
  return works;
}

export async function handleAllPages(url: string, initialResponse: AxiosResponse<Works>, fileName?: string) {
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
  if (fileName) fs.writeFileSync(`${fileName}.json`, JSON.stringify(works, null, 2));
  return works;
}
