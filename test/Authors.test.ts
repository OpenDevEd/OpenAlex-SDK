import axios from 'axios';
import fs from 'fs';
import { Author } from 'src/types/author';
import OpenAlex from '../src/index';
describe('get single author', () => {
  test('get author ', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.author('A5023888391');
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors/A5023888391',
    );
    expect(res).toEqual(openAlexRes.data);
  });
  test('get author using External IDs', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.author('0000-0002-1298-3089', 'orcid');
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors/orcid:0000-0002-1298-3089',
    );
    expect(res).toEqual(openAlexRes.data);
  }, 20000);
});

describe('get multiple authors', () => {
  // test getting first page
  test('get simple ', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.authors({
      search: 'john smith',
      perPage: 50,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors?per-page=50&search=john%20smith',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Author) => r.id),
    );
  }, 10000);

  test('get simple page 2', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.authors({
      perPage: 50,
      page: 2,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors?per-page=50&page=2',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Author) => r.id),
    );
  }, 10000);
  // get authors with search query
  test('get with search query', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.authors({
      search: 'carl sagan',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors?search=carl%20sagan',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Author) => r.id),
    );
  });
  // get authors with search query with search field
  test('get with search query and search field', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.authors({
      search: 'john smith',
      searchField: 'display_name',
      perPage: 50,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors?filter=display_name.search:john%20smith&per-page=50',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Author) => r.id),
    );
  }, 10000);
  // get authors from page 1 to 3 and per page 50
  test('get with start and end page', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.authors({
      startPage: 1,
      endPage: 3,
      perPage: 50,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors?per-page=50&page=1',
    );
    const openAlexRes2 = await axios.get(
      'https://api.openalex.org/authors?per-page=50&page=2',
    );
    const openAlexRes3 = await axios.get(
      'https://api.openalex.org/authors?per-page=50&page=3',
    );
    // compare only ids in the results
    expect(res.results.map((r: Author) => r.id)).toEqual([
      ...openAlexRes.data.results.map((r: Author) => r.id),
      ...openAlexRes2.data.results.map((r: Author) => r.id),
      ...openAlexRes3.data.results.map((r: Author) => r.id),
    ]);
  }, 10000);
  // get authors with simple filter
  test('get authors with simple filter', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.authors({
      filter: {
        works_count: '<100',
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors?filter=works_count:<100',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Author) => r.id),
    );
  });
  // get authors with multiple filters
  test('get authors with multiple filters', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.authors({
      filter: {
        works_count: ['<100', '>10'],
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors?filter=works_count:<100|>10',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Author) => r.id),
    );
  }, 10000);
  // get authors with multiple filters and search query
  test('get authors with multiple filters and search query', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.authors({
      filter: {
        works_count: ['<100', '>10'],
      },
      search: 'john smith',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors?filter=works_count:<100|>10&search=john%20smith',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Author) => r.id),
    );
  }, 10000);
  // get authors with multiple filters and search query and search field
  test('get authors with multiple filters and search query and search field', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.authors({
      filter: {
        works_count: ['<100', '>10'],
      },
      search: 'john smith',
      searchField: 'display_name',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors?filter=works_count:%3C100|%3E10,display_name.search:john%20smith',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Author) => r.id),
    );
  }, 10000);
  // get authors with group by
  test('get authors with group by', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.authors({
      groupBy: 'works_count',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors?group_by=works_count',
    );
    expect(res.group_by?.length).toEqual(openAlexRes.data.group_by.length);
  }, 10000);
  // get authors with group by and filter
  test('get authors with group by and filter', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.authors({
      groupBy: 'works_count',
      filter: {
        works_count: ['<100', '>10'],
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors?group_by=works_count&filter=works_count:<100|>10',
    );
    expect(res.group_by?.length).toEqual(openAlexRes.data.group_by.length);
  }, 10000);
  // get authors with sort by
  test('get authors with sort by', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.authors({
      search: 'john smith',
      sortBy: {
        field: 'cited_by_count',
        order: 'desc',
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/authors?search=john%20smith&sort=cited_by_count:desc&cursor=*',
    );
    expect(res.results).toEqual(openAlexRes.data.results);
  }, 10000);
});

// test saving files
describe('save authors to csv', () => {
  test('save authors to csv', async () => {
    const openAlex = new OpenAlex();
    await openAlex.authors({
      perPage: 50,
      toCsv: 'authors',
    });
    // check if file exists
    expect(fs.existsSync('authors.csv')).toBe(true);
    // delete the file
    fs.unlinkSync('authors.csv');
  }, 10000);
  // save authors to json
  test('save authors to json', async () => {
    const openAlex = new OpenAlex();
    await openAlex.authors({
      perPage: 50,
      toJson: 'authors',
    });
    // check if file exists
    expect(fs.existsSync('authors.json')).toBe(true);
    // delete the file
    fs.unlinkSync('authors.json');
  }, 10000);
});
