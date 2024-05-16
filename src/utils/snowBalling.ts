import fs from 'fs';
import { ExternalIdsWork, Work } from 'src/types/work';
import OpenAlex from '../index';

type WorkWithChildren = {
  work: Work;
  children: WorkWithChildren[];
};

type SnowballingResult = {
  citedByResults: WorkWithChildren[];
  citesResults: WorkWithChildren[];
  relatedResults: WorkWithChildren[];
};

async function snowBalling(
  id: string,
  externalIds?: ExternalIdsWork,
  level: number = 1,
): Promise<SnowballingResult> {
  const openAlex = new OpenAlex();
  const work = await openAlex.work(id, externalIds);

  const citedByResults: WorkWithChildren[] = [];
  const citesResults: WorkWithChildren[] = [];
  const relatedResults: WorkWithChildren[] = [];

  console.log(`Starting snowballing for ${work.title}`);
  console.log(`extracting cited by works for ${work.title}`);

  // extract cited by works
  const works = await openAlex.works({
    filter: {
      cites: id,
    },
  });
  for (const result of works.results) {
    citedByResults.push({
      work: result,
      children:
        level > 1
          ? (await snowBalling(result.id, undefined, level - 1)).citedByResults
          : [],
    });
  }
  console.log(
    `extracted ${citedByResults.length} cited by works for ${work.title}`,
  );

  // extract cites works
  console.log(`extracting cites works for ${work.title}`);
  if (work.referenced_works) {
    for (const reference of work.referenced_works) {
      const referencedWork = await openAlex.work(reference);
      citesResults.push({
        work: referencedWork,
        children:
          level > 1
            ? (await snowBalling(reference, undefined, level - 1)).citesResults
            : [],
      });
    }
  }
  console.log(`extracted ${citesResults.length} cites works for ${work.title}`);

  // extract related works
  console.log(`extracting related works for ${work.title}`);
  if (work.related_works) {
    for (const related of work.related_works) {
      const relatedWork = await openAlex.work(related);
      relatedResults.push({
        work: relatedWork,
        children:
          level > 1
            ? (await snowBalling(related, undefined, level - 1)).relatedResults
            : [],
      });
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
  const res = await snowBalling('W4377994187', undefined, 2);
  fs.writeFileSync('snowballing.json', JSON.stringify(res, null, 2));
  console.log('citedByResults length: ', res.citedByResults.length);
  console.log('citesResults length: ', res.citesResults.length);
  console.log('relatedResults length: ', res.relatedResults.length);
})();
