import { ExternalIdsWork, Work } from 'src/types/work';
import OpenAlex from '../index';

async function snowBalling(
  id: string,
  externalIds?: ExternalIdsWork,
  // level: number = 1,
): Promise<{
  citedByResults: Work[];
  citesResults: Work[];
  relatedResults: Work[];
}> {
  const openAlex = new OpenAlex();
  const work = await openAlex.work(id, externalIds);

  let citedByResults: any[] = [];
  const citesResults: any[] = [];
  const relatedResults: any[] = [];

  console.log(`Starting snowballing for ${work.title}`);
  console.log(`extracting cited by works for ${work.title}`);

  // extract cited by works
  const works = await openAlex.works({
    filter: {
      cites: id,
    },
  });
  // add the results to the citedByResults
  citedByResults = citedByResults.concat(works.results);

  console.log(
    `extracted ${works.results.length} cited by works for ${work.title}`,
  );

  // extract cites works
  // loop through the references and get the work
  console.log(`extracting cites works for ${work.title}`);

  if (work.referenced_works) {
    for (const reference of work.referenced_works) {
      const work = await openAlex.work(reference);
      citesResults.push(work);
    }
  }
  console.log(`extracted ${citesResults.length} cites works for ${work.title}`);
  // extract related works
  // loop through the related works and get the work
  console.log(`extracting related works for ${work.title}`);
  if (work.related_works) {
    for (const related of work.related_works) {
      const work = await openAlex.work(related);
      relatedResults.push(work);
    }
  }
  console.log(
    `extracted ${relatedResults.length} related works for ${work.title}`,
  );
  return {
    citedByResults,
    citesResults,
    relatedResults,
  };
}
(async () => {
  const res = await snowBalling('W2741809807');
  console.log('citedByResults length: ', res.citedByResults.length);
  console.log('citesResults length: ', res.citesResults.length);
  console.log('relatedResults length: ', res.relatedResults.length);
})();
