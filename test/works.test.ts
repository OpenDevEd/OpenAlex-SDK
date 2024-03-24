import axios from 'axios';
import fs from 'fs';
import OpenAlex from '../src/index';

// get single work
describe('get single work', () => {
  test('get work ', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.work('W2741809807');
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works/W2741809807',
    );
    expect(res).toEqual(openAlexRes.data);
  });
  test('get work using External IDs', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.work('10.7717/peerj.4375', 'doi');
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works/doi:10.7717/peerj.4375',
    );
    expect(res).toEqual(openAlexRes.data);
  });
});

// get multiple works
describe('get multiple works', () => {
  // test getting first page
  test('get simple ', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.works({
      perPage: 50,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works?per-page=50',
    );
    expect(res.results).toEqual(openAlexRes.data.results);
  });

  test('get simple page 2', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.works({
      perPage: 50,
      page: 2,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works?per-page=50&page=2',
    );
    expect(res.results).toEqual(openAlexRes.data.results);
  });
  // get works with search query for 'education'
  test('get with search query', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.works({
      search: 'education',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works?search=education',
    );
    expect(res.results).toEqual(openAlexRes.data.results);
  });
  // get works with search query for 'education' and page 2
  test('get with search query and page 2', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.works({
      search: 'education',
      page: 2,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works?search=education&page=2',
    );
    expect(res.results).toEqual(openAlexRes.data.results);
  });
  // get works with search query for 'education' and page 2 and perPage 50
  test('get with search query and page 2 and perPage 50', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.works({
      search: 'education',
      page: 2,
      perPage: 50,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works?search=education&page=2&per-page=50',
    );
    expect(res.results).toEqual(openAlexRes.data.results);
  });

  // get works with search query for 'education' and page 2 and perPage 50 and sort by relevance
  test('get with search query and page 2 and perPage 50 and sort by relevance', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.works({
      search: 'education',
      page: 2,
      perPage: 50,
      sortBy: {
        field: 'relevance_score',
        order: 'desc',
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works?search=education&page=2&per-page=50&sort=relevance_score:desc',
    );
    expect(res.results).toEqual(openAlexRes.data.results);
  });
  // get works with search query for 'education and group by institution country code
  test('get with search query and group by institution country code', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.works({
      search: 'education',
      groupBy: 'authors_count',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works?search=education&group_by=authors_count',
    );
    expect(res.results).toEqual(openAlexRes.data.results);
  });
  // get works with search query for 'education get page from 2 to 4
  test('get with search query and page 2 to 4', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.works({
      search: 'education',
      startPage: 2,
      endPage: 4,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works?search=education&page=2',
    );
    const openAlexRes2 = await axios.get(
      'https://api.openalex.org/works?search=education&page=3',
    );
    const openAlexRes3 = await axios.get(
      'https://api.openalex.org/works?search=education&page=4',
    );
    expect(res.results).toEqual([
      ...openAlexRes.data.results,
      ...openAlexRes2.data.results,
      ...openAlexRes3.data.results,
    ]);
  }, 10000);
  // get works with search query for 'education get page from 2 to 4 and perPage 50
  test('get with search query and page 2 to 4 and perPage 50', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.works({
      search: 'education',
      startPage: 2,
      endPage: 4,
      perPage: 50,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works?search=education&page=2&per-page=50',
    );
    const openAlexRes2 = await axios.get(
      'https://api.openalex.org/works?search=education&page=3&per-page=50',
    );
    const openAlexRes3 = await axios.get(
      'https://api.openalex.org/works?search=education&page=4&per-page=50',
    );
    expect(res.results).toEqual([
      ...openAlexRes.data.results,
      ...openAlexRes2.data.results,
      ...openAlexRes3.data.results,
    ]);
  }, 10000);
});

// save works to files
describe('save works to files', () => {
  // save works to csv
  test('save works to csv', async () => {
    const openAlex = new OpenAlex();
    await openAlex.works({
      search: 'education',
      toCsv: 'education',
    });
    // check if file exists
    expect(fs.existsSync('./education.csv')).toBe(true);
    // delete file
    fs.unlinkSync('./education.csv');
  });
  // save works to json
  test('save works to json', async () => {
    const openAlex = new OpenAlex();
    await openAlex.works({
      search: 'education',
      toJson: 'education',
    });
    // check if file exists
    expect(fs.existsSync('./education.json')).toBe(true);
    // delete file
    fs.unlinkSync('./education.json');
  });
});
