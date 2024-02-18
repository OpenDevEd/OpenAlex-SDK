import OpenAlex from '../src/index';
import { convertToCSV } from '../src/utils/exportCSV';
// import OpenAlex from 'openalex-sdk';

(async () => {
  const openAlex = new OpenAlex();
  // const res = await openAlex.work('10.53832/opendeved.1064');
  const res = await openAlex.works({
    search: 'education',
    searchField: 'title',
    perPage: 200,
    filter: {
      has_fulltext: true,
    },

    fileName: 'test',
    page: 1,
  });
  // const res = await openAlex.work('14907713', 'pmid');
  console.log(res);
  // remove abstract and fulltext from the csv
  res.results.forEach((work) => {
    delete work.abstract_inverted_index;
  });
  convertToCSV(res.results, 'test1');
})();
