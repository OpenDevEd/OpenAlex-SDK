import axios from 'axios';
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
