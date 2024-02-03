import OpenAlex from '../src/index';

(async () => {
  const openAlex = new OpenAlex();
  // const res = await openAlex.work('10.53832/opendeved.1064');
  const res = await openAlex.works({
    search: 'education',
    searchField: 'title',
    perPage: 1,
    startPage: 2,
    endPage: 2,
    retriveAllPages: false,
    filter: {
      authorships: {
        author: {
          id: '0000-0002-1825-0097',
        },
      },
    },
  });
  console.log(res);
})();
