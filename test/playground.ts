import OpenAlex from '../src/index';
// import { convertToCSV } from '../src/utils/exportCSV';
// import OpenAlex from 'openalex-sdk';

(async () => {
  const openAlex = new OpenAlex();
  // const res = await openAlex.work('W2741809807');
  // const res = await openAlex.works({
  //   search: 'education',
  //   searchField: 'title',
  //   perPage: 1,
  //   filter: {
  //     sustainable_development_goals: { id: 'https://metadata.un.org/sdg/4' },
  //   },
  //   toCsv: 'test100',
  //   startPage: 1,
  //   endPage: 2,
  //   sortBy: {
  //     field: 'cited_by_count',
  //     order: 'desc',
  //   },
  // });
  const res = await openAlex.author('A5023888391');
  console.log(res);

  // remove abstract and fulltext from the csv
})();
