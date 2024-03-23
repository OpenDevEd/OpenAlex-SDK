import { AuthorFilterParameters } from './authorFilterParameters';
export type Author = {
  id: string;
  orcid?: string;
  display_name?: string;
  display_name_alternatives?: string[];
  works_count: number;
  cited_by_count: number;
  summary_stats: SummaryStats;
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
  next_cursor: string;
  groups_count?: number;
};

export type ExternalIdsAuthor = 'orcid' | 'scopus' | 'twitter' | 'wikipedia';

type SummaryStats = {
  '2yr_mean_citedness': number;
  h_index: number;
  i10_index: number;
};
export type AuthorsSearchParameters = {
  /**
   *The best way to search for authors is to use the search query parameter, which searches the display_name and the display_name_alternatives fields. Example:

  Get works with the author name "Carl Sagan":
 @see {@link https://api.openalex.org/authors?search=carl%20sagan} 

  Searching without a middle initial returns names with and without middle initials. So a search for "John Smith" will also return "John W. Smith".
   */
  search?: string;
  searchField?: SeachField;
  perPage?: number;
  page?: number;
  retriveAllPages?: boolean;
  toCsv?: string;
  toJson?: string;
  startPage?: number;
  endPage?: number;
  filter?: AuthorFilterParameters;
  groupBy?: GroupBy;
  sortBy?: SortByAuthor;
  AbstractArrayToString?: boolean;
};
export type SeachField = 'display_name';

export type GroupBy =
  | 'affiliations.institution.country_code'
  | 'affiliations.institution.id'
  | 'affiliations.institution.lineage'
  | 'affiliations.institution.ror'
  | 'affiliations.institution.type'
  | 'cited_by_count'
  | 'has_orcid'
  | 'last_known_institution.continent'
  | 'last_known_institution.country_code'
  | 'last_known_institution.id'
  | 'last_known_institution.is_global_south'
  | 'last_known_institution.lineage'
  | 'last_known_institution.ror'
  | 'last_known_institution.type'
  | 'summary_stats.2yr_mean_citedness'
  | 'summary_stats.h_index'
  | 'summary_stats.i10_index'
  | 'works_count';
export type SortByAuthor = {
  field:
    | 'display_name'
    | 'cited_by_count'
    | 'works_count'
    | 'publication_date'
    /**  relevance_score (only exists if there's a search filter active) */
    | 'relevance_score ';
  order: 'asc' | 'desc';
};
