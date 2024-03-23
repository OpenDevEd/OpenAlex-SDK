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
  //     sustainable_development_goals: [
  //       { id: 'https://metadata.un.org/sdg/4' },
  //       { id: 'https://metadata.un.org/sdg/5' },
  //       { id: 'https://metadata.un.org/sdg/6' },
  //     ],
  //     open_access: { is_oa: true },
  //   },
  //   startPage: 1,
  //   endPage: 2,
  //   AbstractArrayToString: true,
  //   sortBy: {
  //     field: 'cited_by_count',
  //     order: 'desc',
  //   },
  // });
  // // const res = await openAlex.author('A5023888391');
  // console.log(res);
  const res2 = await openAlex.authors({
    search: 'tupolev',
    searchField: 'display_name',
    perPage: 1,
  });
  console.log(res2);

  // remove abstract and fulltext from the csv
})();
