import OpenAlex from '../src/index';
// import { convertToCSV } from '../src/utils/exportCSV';
// import OpenAlex from 'openalex-sdk';

(async () => {
  const openAlex = new OpenAlex();
  // const res = await openAlex.work('W2741809807');
  // const res = await openAlex.works({
  //   search: 'education',
  //   searchField: 'title',
  //   perPage: 200,
  //   page: 60,
  // });
  // // const res = await openAlex.author('A5023888391');
  // console.log(res.meta);
  // const res2 = await openAlex.authors({
  //   search: 'tupolev',
  //   searchField: 'display_name',
  //   perPage: 1,
  // });
  // console.log(res2);
  const res4 = await openAlex.works({
    search: 'english class',
    retriveAllPages: true,
    searchField: 'title',
    toJson: 'english_class',
    chunkSize: 1000,
  });
  console.log(res4.meta);

  // remove abstract and fulltext from the csv
})();
