import axios from 'axios';
import { Topic } from 'src/types/topic';
import OpenAlex from '../src/index';
describe('get single topic', () => {
  test('get topic ', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.topic('T11636');
    const openAlexRes = await axios.get(
      'https://api.openalex.org/topics/T11636',
    );
    expect(res).toEqual(openAlexRes.data);
  });
});

describe('test topics endpoint ', () => {
  test('get simple ', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.topics({
      perPage: 50,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/topics?per-page=50',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Topic) => r.id),
    );
  });
  test('get simple page 2', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.topics({
      perPage: 50,
      page: 2,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/topics?per-page=50&page=2',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Topic) => r.id),
    );
  });
  // get topics with search query
  test('get with search query', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.topics({
      search: 'education',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/topics?search=education',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Topic) => r.id),
    );
  });
  // get topics with search query for 'education' and page 2
  test('get with search query and page 2', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.topics({
      search: 'education',
      page: 2,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/topics?search=education&page=2',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Topic) => r.id),
    );
  });
  // get topic with a filter
  test('get with filter', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.topics({
      filter: {
        works_count: '1',
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/topics?filter=works_count:1',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Topic) => r.id),
    );
  });
  // get topic with a filter and search query
  test('get with filter and search query', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.topics({
      search: 'education',
      filter: {
        works_count: '1',
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/topics?search=education&filter=works_count:1',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Topic) => r.id),
    );
  });
  // get topic with a multiple filter and search query
  test('get with multiple filters and search query', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.topics({
      search: 'education',
      filter: {
        works_count: '1',
        cited_by_count: '>1',
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/topics?search=education&filter=works_count:1,cited_by_count:>1',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Topic) => r.id),
    );
  });
  // get topic with a filter and search query and page 2 and perPage 50
  test('get with filter and search query and page 2 and perPage 50', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.topics({
      search: 'education',
      filter: {
        cited_by_count: '>100',
      },
      page: 2,
      perPage: 50,
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/topics?search=education&filter=cited_by_count:>100&per-page=50&page=2',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Topic) => r.id),
    );
  });
  // get simple with groupBy
  test('get with groupBy', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.topics({
      groupBy: 'cited_by_count',
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/topics?group_by=cited_by_count&cursor=*',
    );
    if (res.group_by && openAlexRes.data.group_by)
      expect(res.group_by).toEqual(openAlexRes.data.group_by);
    // return fail error
    else expect(true).toEqual(false);
  });

  // get simple with sortBy
  test('get with sortBy', async () => {
    const openAlex = new OpenAlex();
    const res = await openAlex.topics({
      sortBy: {
        field: 'works_count',
        order: 'desc',
      },
    });
    const openAlexRes = await axios.get(
      'https://api.openalex.org/topics?sort=works_count:desc',
    );
    expect(res.results.map((r) => r.id)).toEqual(
      openAlexRes.data.results.map((r: Topic) => r.id),
    );
  });
});
