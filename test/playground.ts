import OpenAlex from '../src/index';
// import { convertToCSV } from '../src/utils/exportCSV';
// import OpenAlex from 'openalex-sdk';

(async () => {
  const openAlex = new OpenAlex();
  const res = await openAlex.work('W2741809807');
  // const res = await openAlex.works({
  //   search: 'education',
  //   searchField: 'title',
  //   perPage: 1,
  //   filter: {
  //     has_fulltext: true,
  //   },
  //   toCsv: 'test100',
  //   startPage: 1,
  //   endPage: 2,
  // });
  // const res = await openAlex.work('14907713', 'pmid');
  console.log(res);
  // remove abstract and fulltext from the csv
})();
