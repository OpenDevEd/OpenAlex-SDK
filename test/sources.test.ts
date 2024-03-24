import axios from 'axios';
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
