import axios from 'axios';
import fs from 'fs';
import * as glob from 'glob';
import { Work } from 'src/types/work';
import OpenAlex from '../src/index';
import { formatNumber } from '../src/utils/works';

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
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Work) => r.id),
    );
  }, 10000);

  test('get simple page 2', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.works({
      perPage: 50,
      page: 2,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works?per-page=50&page=2',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Work) => r.id),
    );
  }, 10000);
  // get works with search query for 'education'
  test('get with search query', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.works({
      search: 'education',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works?search=education',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Work) => r.id),
    );
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
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Work) => r.id),
    );
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
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Work) => r.id),
    );
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
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Work) => r.id),
    );
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
    expect(res.results.map((r) => r.id)).toEqual([
      ...openAlexRes.data.results.map((r: Work) => r.id),
      ...openAlexRes2.data.results.map((r: Work) => r.id),
      ...openAlexRes3.data.results.map((r: Work) => r.id),
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
    // compare only ids in the results
    expect(res.results.map((r) => r.id)).toEqual([
      ...openAlexRes.data.results.map((r: Work) => r.id),
      ...openAlexRes2.data.results.map((r: Work) => r.id),
      ...openAlexRes3.data.results.map((r: Work) => r.id),
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

// test retrieveAllPages option
describe('retrieveAllPages option', () => {
  test('retrieve All Pages with chunkSize', async () => {
    const chunkSize = 1000;
    const openAlex = new OpenAlex();
    await openAlex.works({
      search: 'english africa',
      searchField: 'title',
      retriveAllPages: true,
      chunkSize: chunkSize,
      toJson: 'english_africa',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works?filter=title.search:english%20africa',
    );
    // check folder exists
    expect(fs.existsSync('./english_africa')).toBe(true);
    let start = 0;
    let end;
    // check if files exists we use ./english_africa as the folder and english_africa_0,000,000-0,001,000.json as first file and so on
    for (
      let i = 0;
      i < Math.ceil(openAlexRes.data.meta.count / chunkSize);
      i++
    ) {
      end = start + chunkSize;
      end = start + chunkSize;
      const startFormatted = formatNumber(
        Number((start + 1).toString().padStart(7, '0')),
      );
      // ./english_africa/english_africa_${startFormatted}*.json
      expect(
        checkFileExists(`./english_africa/english_africa_${startFormatted}*`),
      ).toBe(true);
      start = end;
    }
    // delete folder with files
    fs.rmSync('./english_africa', { recursive: true });
  }, 100000);
  test('simple retrieve All Pages test', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.works({
      search: 'english africa',
      searchField: 'title',
      retriveAllPages: true,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/works?filter=title.search:english%20africa',
    );
    expect(res.results).toHaveLength(openAlexRes.data.meta.count);
  }, 80000);
});

function checkFileExists(pattern: string): boolean {
  const files = glob.sync(pattern);
  return files.length > 0;
}
