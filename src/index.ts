// Empty file to make the 'types' directory a module.
import { AxiosResponse } from 'axios';

import fs from 'fs';
import { ExternalIdsAuthor } from './types/author';
import { ExternalIdsWork, SearchParameters, Work, Works } from './types/work';
import { GET } from './utils/http';
import { appendPaginationToUrl, buildUrl, handleAllPages, handleMultiplePages, validateParameters } from './utils/works';

export default class OpenAlex {
  email: string | null;
  apiKey: string | null;
  url: string = 'https://api.openalex.org';
  maxRetries: number = 3;
  retryDelay: number = 1000;
  retryHttpCodes: number[] = [429, 500, 502, 503, 504];

  constructor(email: string | null = null, apiKey: string | null = null) {
    this.email = email;
    this.apiKey = apiKey;
  }

  /**
   * The function `work` retrieves a specific work by its ID and returns it as a Promise.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of a
   * work. It is used to retrieve a specific work from the server.
   * @returns {Promise<Work>}a Promise that resolves to a Work object.
   */
  async work(id: string, externalIds: ExternalIdsWork): Promise<Work> {
    let url = '';
    if (externalIds) url = `${this.url}/works/${externalIds}:${id}`;
    else url = `${this.url}/works/${id}`;
    const response: AxiosResponse<Work> = await GET(url);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  async works(searchParameters: SearchParameters = { perPage: 25, page: 1, retriveAllPages: false }): Promise<Works> {
    const { retriveAllPages, searchField, search, toJson, startPage, endPage, filter, groupBy: group_by, sortBy } = searchParameters;
    let { perPage, page } = searchParameters;

    validateParameters(retriveAllPages, startPage, endPage, searchField);

    let url = buildUrl(this.url, search, searchField, filter, group_by, sortBy);

    if (retriveAllPages) {
      perPage = 200;
      page = 1;
    }

    if (startPage && endPage) {
      page = startPage;
    }

    url = appendPaginationToUrl(url, perPage, page, retriveAllPages);

    const response: AxiosResponse<Works> = await GET(url);

    if (startPage && endPage) {
      return handleMultiplePages(startPage, endPage, url, response, toJson);
    }

    if (retriveAllPages) {
      return handleAllPages(url, response, toJson);
    }

    if (response.status === 200) {
      if (toJson) await fs.writeFileSync(`${toJson}.json`, JSON.stringify(response.data, null, 2));
      return response.data;
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  async autoCpmleteWorks(search: string): Promise<Works> {
    const response: AxiosResponse<Works> = await GET(`${this.url}/autocomplete/works?q=${search}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  async ngram(id: string) {
    const response: AxiosResponse<Work> = await GET(`${this.url}/works/${id}/ngram`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
  async author(id: string, externalIds: ExternalIdsAuthor) {
    let url = '';
    if (externalIds) url = `${this.url}/authors/${externalIds}:${id}`;
    else url = `${this.url}/authors/${id}`;
    const response: AxiosResponse<Work> = await GET(url);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
}
