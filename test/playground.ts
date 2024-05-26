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
  //   filter: {
  //     works_count: ['<100', '>10'],
  //   },
  // });
  // console.log(res2);
  const res = await openAlex.institutions({
    search: 'india',
    retriveAllPages: true,
  });
  console.log(res.results.length);
  // console.log(res.results[487]);
  const res4 = await openAlex.works({
    search: 'africa',
    searchField: 'title',
    toJson: 'africa',
    AbstractArrayToString: true,
    retriveAllPages: true,
    chunkSize: 1000,
  });

  console.log(res4.meta);

  // remove abstract and fulltext from the csv
})();
