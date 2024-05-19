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
  const res = await openAlex.sources({
    filter: {
      is_oa: true,
      type: 'journal',
    },
    search: 'nature',
  });
  console.log(res.meta);
  res.results.map((r) => console.log(r.id));
  // const res4 = await openAlex.works({
  //   search: 'africa',
  //   // retriveAllPages: true,
  //   searchField: 'title',
  //   toCsv: 'africa',
  //   AbstractArrayToString: true,
  //   // chunkSize: 25000,
  //   filter: {
  //     publication_year: [
  //       2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
  //     ],
  //   },
  // });

  // console.log(res4.meta);

  // remove abstract and fulltext from the csv
})();
