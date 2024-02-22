import { AxiosResponse } from 'axios';
import { Works } from '../types/work';
import { GET } from './http';
import { calculatePages, convertAbstractArrayToString } from './works';
import { convertToCSV } from './exportCSV';
import fs from 'fs';

export function appendCursorToUrl(url: string, perPage?: number, cursor?: string, retriveAllPages?: boolean) {
  url = perPage ? `${url}&per_page=${perPage}` : url;
  url = cursor && !retriveAllPages ? `${url}&cursor=${cursor}` : `${url}&cursor=*`;
  return url;
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

export async function handleMultiplePagesc(
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
    if (i === endPage) works.meta.next_cursor = cursor;
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

export async function handleAllPagesc(url: string, initialResponse: AxiosResponse<Works>, toJson?: string, toCsv?: string) {
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
    if (i === totalPages) works.meta.next_cursor = cursor;
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
