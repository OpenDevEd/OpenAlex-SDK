export type AuthorFilterParameters = {
  affiliation?: Affiliation | Affiliation[];
  cited_by_count?: number | number[];
  ids?: Ids | Ids[];
  last_known_institution?: Institution | Institution[];
  orcid?: string | string[];
  scopus?: string | string[];
  summary_stats?: SummaryStats | SummaryStats[];
  works_count?: string | string[];
  x_concepts?: Concept | Concept[];
};

type Affiliation = {
  institution: Institution;
  years: number[];
};
type Institution = {
  country_code: string;
  id: string;
  lineage: string[];
  ror: string;
  type: string;
};
type Ids = {
  openalex: string;
};
type SummaryStats = {
  '2yr_mean_citedness': number;
  h_index: number;
  i10_index: number;
};
type Concept = {
  id: string;
};
