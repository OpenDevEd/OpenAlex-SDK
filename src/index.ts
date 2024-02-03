// Empty file to make the 'types' directory a module.
import { AxiosResponse } from 'axios';

import { SearchParameters, Work, Works } from './types/workTypes';
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
   * The function `work` retrieves a work object from a server using an HTTP GET request and returns it,
   * or returns an error object if the request fails.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of a work.
   * @returns {Work |  { error: number; message: string }} The `work` function returns a `Promise` that resolves to either a `Work` object or an
   * object with properties `error` and `message`.
   */
  async work(id: string): Promise<Work> {
    // // check if searchField when defined is a valid search field type
    // if (search && searchField) url = `${this.url}/works/?filter=${searchField}.search:${search}`;
    // if (search && !searchField) url = `${this.url}/works/?search=${search}`;
    const response: AxiosResponse<Work> = await GET(`${this.url}/works/${id}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  async works(searchParameters: SearchParameters = { perPage: 25, page: 1, retriveAllPages: false }): Promise<Works> {
    const { retriveAllPages, searchField, search, fileName, startPage, endPage, filter } = searchParameters;
    let { perPage, page } = searchParameters;

    validateParameters(retriveAllPages, startPage, endPage, searchField);

    let url = buildUrl(this.url, search, searchField, filter);

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
      return handleMultiplePages(startPage, endPage, url, response, fileName);
    }

    if (retriveAllPages) {
      return handleAllPages(url, response, fileName);
    }

    if (response.status === 200) {
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
}
