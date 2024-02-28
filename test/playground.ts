import OpenAlex from '../src/index';
// import { convertToCSV } from '../src/utils/exportCSV';
// import OpenAlex from 'openalex-sdk';

(async () => {
  const openAlex = new OpenAlex();
  // const res = await openAlex.work('10.53832/opendeved.1064');
  const res = await openAlex.works({
    search: 'search-term',
    searchField: 'title',
    perPage: 10,
    page: 1,
    retriveAllPages: false,
    toCsv: 'path/to/save.csv',
    toJson: 'path/to/save.json',
    startPage: 1,
    endPage: 10,
    filter: { /* filter parameters */ },
    groupBy: 'publication_year',
    sortBy: {
      field: 'cited_by_count',
      order: 'asc' // or 'desc'
    }
    });
  // const res = await openAlex.work('14907713', 'pmid');
  console.log(res);
  // remove abstract and fulltext from the csv
})();
