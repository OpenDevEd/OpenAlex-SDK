export type Author = {
  id: string;
  orcid?: string;
  display_name?: string;
  display_name_alternatives?: string[];
  works_count: number;
  cited_by_count: number;
  summary_stats: {
    '2yr_mean_citedness': number;
    h_index: number;
    i10_index: number;
  };
  ids: Ids;
  affiliations: Affiliation[];
  last_known_institution: Institution;
  last_known_institutions: Institution[];
  x_concepts: Concept[];
  counts_by_year: PublicationYear[];
  works_api_url: string;
  updated_date: string;
  created_date: string;
};

type Ids = {
  openalex: string;
  orcid?: string;
  scopus?: string;
  twitter?: string;
  wikipedia?: string;
};

type Institution = {
  id: string;
  ror: string;
  display_name: string;
  country_code: string;
  type: string;
  lineage: string[];
  years?: number[];
};

type Affiliation = {
  institution: Institution;
  years: number[];
};

type Concept = {
  id: string;
  wikidata: string;
  display_name: string;
  level: number;
  score: number;
};

type PublicationYear = {
  year: number;
  works_count: number;
  cited_by_count: number;
};

export type Authors = {
  results: Author[];
  meta: Meta;
};

type Meta = {
  count: number;
  db_response_time_ms: number;
  page?: number;
  per_page: number;
  next_cursor?: string;
  groups_count?: number;
};

export type ExternalIdsAuthor = 'orcid' | 'scopus' | 'twitter' | 'wikipedia';
