import OpenAlex from '../src/index';

(async () => {
  const openAlex = new OpenAlex();
  // const res = await openAlex.work('10.53832/opendeved.1064');
  const res = await openAlex.works({
    search: 'education',
    searchField: 'title',
    perPage: 200,

    filter: {
      open_access: {
        oa_status: 'hybrid',
      },
      from_publication_date: '2020-01-01',
      to_publication_date: '2021-01-01',
    },
    group_by: 'apc_list.currency',
  });
  console.log(res);
})();
