import axios from 'axios';
// import fs from 'fs';
import { Institution } from 'src/types/institution';
import OpenAlex from '../src/index';
describe('get single institution', () => {
  test('get institution ', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institution('I27837315');
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions/I27837315',
    );
    expect(res).toEqual(openAlexRes.data);
  });
  test('get institution using External IDs', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institution('00cvxb145', 'ror');
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions/ror:https://ror.org/00cvxb145',
    );
    expect(res).toEqual(openAlexRes.data);
  });
});

// get multiple institutions
describe('get multiple institutions', () => {
  // test getting first page
  test('get simple ', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institutions({
      perPage: 50,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions?per-page=50',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Institution) => r.id),
    );
  }, 10000);

  test('get simple page 2', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institutions({
      perPage: 50,
      page: 2,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions?per-page=50&page=2',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Institution) => r.id),
    );
  }, 10000);
  // get institutions with search query
  test('get with search query', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institutions({
      search: 'university',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions?search=university',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Institution) => r.id),
    );
  });
  // get single institution with search field
  test('get with search query and search field', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institutions({
      search: 'university',
      searchField: 'display_name',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions?filter=display_name.search:university',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Institution) => r.id),
    );
  });
  // get institutions with search query with single filter
  test('get with search query and filter', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institutions({
      search: 'university',
      filter: {
        country_code: 'US',
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions?search=university&filter=country_code:US',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Institution) => r.id),
    );
  });
  // get institutions with search query with multiple filters
  test('get with search query and multiple filters', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institutions({
      search: 'university',
      filter: {
        country_code: 'US',
        works_count: ['>100', '<1000'],
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions?&filter=country_code:US,works_count:>100|<1000&search=university&cursor=*',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Institution) => r.id),
    );
  });
  // get institutions with search query with multiple filters and sort by relevance
  test('get with search query and multiple filters and sort by relevance', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institutions({
      search: 'university',
      filter: {
        country_code: 'US',
        works_count: ['>100', '<1000'],
      },
      sortBy: {
        field: 'relevance_score',
        order: 'desc',
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions?&filter=country_code:US,works_count:>100|<1000&search=university&sort=relevance_score:desc',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Institution) => r.id),
    );
  });
  // get institutions with simple group by
  test('get with group by', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institutions({
      groupBy: 'country_code',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions?group_by=country_code',
    );
    expect(res.results).toEqual(openAlexRes.data.results);
  });
  // get institutions with group by and filter
  test('get with group by and filter', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institutions({
      groupBy: 'country_code',
      filter: {
        works_count: ['>100'],
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions?group_by=country_code&filter=works_count:%3E100',
    );
    expect(res.results).toEqual(openAlexRes.data.results);
  });
  // get institutions with sort by and filter
  test('get with sort by and filter', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institutions({
      sortBy: {
        field: 'works_count',
        order: 'desc',
      },
      filter: {
        works_count: ['>100'],
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions?sort=works_count:desc&filter=works_count:%3E100',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Institution) => r.id),
    );
  });
  // get institutions from page 1 to 3 and per page 50
  test('get from page 1 to 3 and per page 50', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institutions({
      perPage: 50,
      startPage: 1,
      endPage: 3,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions?per-page=50&page=1',
    );
    const openAlexRes2 = await axios.get(
      'https://api.openalex.org/institutions?per-page=50&page=2',
    );
    const openAlexRes3 = await axios.get(
      'https://api.openalex.org/institutions?per-page=50&page=3',
    );
    // compare only ids in the results
    expect(res.results.map((r: Institution) => r.id)).toEqual([
      ...openAlexRes.data.results.map((r: Institution) => r.id),
      ...openAlexRes2.data.results.map((r: Institution) => r.id),
      ...openAlexRes3.data.results.map((r: Institution) => r.id),
    ]);
  }, 10000);
  // get all institutions with search query
  test('get all with search query', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.institutions({
      search: 'india',
      retriveAllPages: true,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/institutions?search=india&per-page=200&page=1',
    );
    const openAlexRes2 = await axios.get(
      'https://api.openalex.org/institutions?search=india&per-page=200&page=2',
    );
    const openAlexRes3 = await axios.get(
      'https://api.openalex.org/institutions?search=india&per-page=200&page=3',
    );
    expect(res.results.map((r: Institution) => r.id)).toEqual([
      ...openAlexRes.data.results.map((r: Institution) => r.id),
      ...openAlexRes2.data.results.map((r: Institution) => r.id),
      ...openAlexRes3.data.results.map((r: Institution) => r.id),
    ]);
  }, 20000);
});
