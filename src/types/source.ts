export type Source = {
  abbreviated_title: string;
  alternate_titles: string[];
  apc_prices: ApcPrice[];
  apc_usd: number;
  cited_by_count: number;
  country_code: string;
  counts_by_year: CountsByYear[];
  created_date: string;
  display_name: string;
  homepage_url: string;
  host_organization: string;
  host_organization_lineage: string[];
  host_organization_name: string;
  id: string;
  ids: Ids[];
  is_in_doaj: boolean;
  is_oa: boolean;
  issn: string[];
  issn_l: string;
  societies: Societies[];
  summary_stats: Summary_stats;
  type?:
    | 'journal'
    | 'repository'
    | 'conference'
    | 'ebook platform'
    | 'book series';
  updated_date: string;
  works_api_url: string;
  works_count: number;
  x_concepts: Concept[];
};
type ApcPrice = {
  price: number;
  currency: string;
};
type CountsByYear = {
  year: number;
  works_count: number;
  cited_by_count: number;
};
type Ids = {
  fatcat?: string;
  issn?: string[];
  issn_l?: string;
  mag?: string;
  openalex: string;
  wikidata?: string;
};
type Societies = {
  url?: string;
  organization?: string;
};
type Summary_stats = {
  '2yr_mean_citedness': number;
  h_index: number;
  i10_index: number;
};
type Concept = {
  id: string;
  wikidata?: string;
  display_name?: string;
  level: number;
  score: number;
};

export type GroupBySource =
  | 'apc_prices.currency'
  | 'apc_usd'
  | 'cited_by_count'
  | 'has_issn'
  | 'continent'
  | 'country_code'
  | 'host_organization.id'
  | 'host_organization_lineage.id'
  | 'is_global_south'
  | 'is_in_doaj'
  | 'is_oa'
  | 'issn'
  | 'publisher'
  | 'summary_stats.2yr_mean_citedness'
  | 'summary_stats.h_index'
  | 'summary_stats.i10_index'
  | 'type'
  | 'works_count';

export type SeachFieldSource = 'display_name';

export type SearchParametersSource = {
  search?: string;
  searchField?: SeachFieldSource;
  perPage?: number;
  page?: number;
  retriveAllPages?: boolean;
  toCsv?: string;
  toJson?: string;
  startPage?: number;
  endPage?: number;
  groupBy?: GroupBySource;
  sortBy?: SortBySource;
  AbstractArrayToString?: boolean;
};

export type SortBySource = {
  field:
    | 'display_name'
    | 'cited_by_count'
    | 'works_count'
    | 'publication_date'
    /**  relevance_score (only exists if there's a search filter active) */
    | 'relevance_score';
  order: 'asc' | 'desc';
};
