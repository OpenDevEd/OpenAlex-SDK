import axios from 'axios';
import fs from 'fs';
import { Source } from 'src/types/source';
import OpenAlex from '../src/index';
describe('get single source', () => {
  test('get author ', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.source('S137773608');
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources/S137773608',
    );
    expect(res).toEqual(openAlexRes.data);
  });
  test('get author using External IDs', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.source('2041-1723', 'issn');
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources/issn:2041-1723',
    );
    expect(res).toEqual(openAlexRes.data);
  });
});

// get multiple sources
describe('get multiple sources', () => {
  // test getting first page
  test('get simple ', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      perPage: 50,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?per-page=50',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Source) => r.id),
    );
  }, 10000);

  test('get simple page 2', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      perPage: 50,
      page: 2,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?per-page=50&page=2',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Source) => r.id),
    );
  }, 10000);
  // get sources with search query
  test('get with search query', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      search: 'nature',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?search=nature',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Source) => r.id),
    );
  }, 10000);

  // get sources with search query for 'nature' and page 2
  test('get with search query and page 2', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      search: 'nature',
      page: 2,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?search=nature&page=2',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Source) => r.id),
    );
  });
  // get sources with search query with search field
  test('get with search query and search field', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      search: 'nature',
      searchField: 'display_name',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?filter=display_name.search:nature',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Source) => r.id),
    );
  });
  // get sources with simple filter
  test('get with filter', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      filter: {
        works_count: ['>100'],
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?filter=works_count:%3E100',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Source) => r.id),
    );
  });
  // get sources with multiple filters
  test('get with multiple filters', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      filter: {
        works_count: ['>100', '<1000'],
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?filter=works_count:%3E100|<1000',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Source) => r.id),
    );
  });
  // get sources with multiple filters and search query
  test('get with multiple filters and search query', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      filter: {
        works_count: ['>100', '<1000'],
      },
      search: 'nature',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?filter=works_count:%3E100|<1000&search=nature',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Source) => r.id),
    );
  });
  // get sources with different filters and search query and search field
  test('get with multiple filters and search query and search field', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      filter: {
        is_oa: true,
        type: 'journal',
      },
      search: 'nature',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?filter=is_oa:true,type:journal&search=nature&cursor=*',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Source) => r.id),
    );
  });
  // get sources with simple group by
  test('get with group by', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      groupBy: 'type',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?group_by=type',
    );
    expect(res.results).toEqual(openAlexRes.data.results);
  });
  // get sources with group by and filter
  test('get with group by and filter', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      groupBy: 'type',
      filter: {
        works_count: ['>100'],
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?group_by=type&filter=works_count:%3E100&cursor=*',
    );
    expect(res.results).toEqual(openAlexRes.data.results);
  });
  // get sources with sort by
  test('get with sort by', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      sortBy: {
        field: 'display_name',
        order: 'asc',
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?sort=display_name:asc&cursor=*',
    );
    expect(res.results).toEqual(openAlexRes.data.results);
  });
  // get sources with sort by and filter
  test('get with sort by and filter', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      sortBy: {
        field: 'display_name',
        order: 'asc',
      },
      filter: {
        works_count: ['>100'],
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?sort=display_name:asc&filter=works_count:%3E100&cursor=*',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Source) => r.id),
    );
  });
  // get sources from page 1 to 3 and per page 50
  test('get with start and end page', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      startPage: 1,
      endPage: 3,
      perPage: 50,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?per-page=50&page=1',
    );
    const openAlexRes2 = await axios.get(
      'https://api.openalex.org/sources?per-page=50&page=2',
    );
    const openAlexRes3 = await axios.get(
      'https://api.openalex.org/sources?per-page=50&page=3',
    );
    // compare only ids in the results
    expect(res.results.map((r: Source) => r.id)).toEqual([
      ...openAlexRes.data.results.map((r: Source) => r.id),
      ...openAlexRes2.data.results.map((r: Source) => r.id),
      ...openAlexRes3.data.results.map((r: Source) => r.id),
    ]);
  }, 10000);
  // get all sources with simple search query
  test('get all sources with simple search query', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.sources({
      search: 'nature',
      retriveAllPages: true,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/sources?search=nature&per-page=200&page=1',
    );
    const openAlexRes2 = await axios.get(
      'https://api.openalex.org/sources?search=nature&per-page=200&page=2',
    );

    expect(res.results.map((r: Source) => r.id)).toEqual([
      ...openAlexRes.data.results.map((r: Source) => r.id),
      ...openAlexRes2.data.results.map((r: Source) => r.id),
    ]);
  }, 10000);
});
describe('save sources to csv', () => {
  test('save sources to csv', async () => {
    const openAlex = new OpenAlex();
    await openAlex.sources({
      perPage: 50,
      toCsv: 'sources',
    });
    // check if file exists
    expect(fs.existsSync('sources.csv')).toBe(true);
    // delete the file
    fs.unlinkSync('sources.csv');
  }, 10000);

  test('save sources to json', async () => {
    const openAlex = new OpenAlex();
    await openAlex.sources({
      perPage: 50,
      toJson: 'sources',
    });
    // check if file exists
    expect(fs.existsSync('sources.json')).toBe(true);
    // delete the file
    fs.unlinkSync('sources.json');
  }, 10000);
});
