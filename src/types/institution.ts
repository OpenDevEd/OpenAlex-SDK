type Institution = {
  id?: string;
  ror?: string;
  display_name?: string;
  country_code?: string;
  type?: string;
  type_id?: string;
  lineage?: string[];
  homepage_url?: string;
  image_url?: string;
  image_thumbnail_url?: string;
  display_name_acronyms?: string[];
  display_name_alternatives?: string[];
  repositories?: Repository[];
  works_count?: number;
  cited_by_count?: number;
  summary_stats?: SummaryStats;
  ids?: Ids;
  geo?: Geo;
  international?: {
    display_name?: InternationalDisplayName;
  };
  associated_institutions?: AssociatedInstitution[];
  counts_by_year?: CountsByYear[];
  roles?: Role[];
  topics?: Topic[];
  topic_share?: TopicShare[];
  x_concepts?: XConcept[];
  is_super_system?: boolean;
  works_api_url?: string;
  updated_date?: string;
  created_date?: string;
};

type SummaryStats = {
  '2yr_mean_citedness'?: number;
  h_index?: number;
  i10_index?: number;
};

type Repository = {
  id?: string;
  display_name?: string;
  host_organization?: string;
  host_organization_name?: string;
  host_organization_lineage?: string[];
};

type CountsByYear = {
  year?: number;
  works_count?: number;
  cited_by_count?: number;
};

type Role = {
  role?: string;
  id?: string;
  works_count?: number;
};

type Topic = {
  id?: string;
  display_name?: string;
  count?: number;
  subfield?: {
    id?: string;
    display_name?: string;
  };
  field?: {
    id?: string;
    display_name?: string;
  };
  domain?: {
    id?: string;
    display_name?: string;
  };
};

type TopicShare = {
  id?: string;
  display_name?: string;
  value?: number;
  subfield?: {
    id?: string;
    display_name?: string;
  };
  field?: {
    id?: string;
    display_name?: string;
  };
  domain?: {
    id?: string;
    display_name?: string;
  };
};

type XConcept = {
  id?: string;
  wikidata?: string;
  display_name?: string;
  level?: number;
  score?: number;
};

type AssociatedInstitution = {
  id?: string;
  ror?: string;
  display_name?: string;
  country_code?: string;
  type?: string;
  relationship?: string;
};

type InternationalDisplayName = {
  [key: string]: string;
};

type Geo = {
  city?: string;
  geonames_city_id?: string;
  region?: string;
  country_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
};
type Ids = {
  openalex?: string;
  ror?: string;
  mag?: string;
  grid?: string;
  wikipedia?: string;
  wikidata?: string;
};

export type ExternalIdsInstitution = 'ror' | 'mag' | 'wikidata';

export type SearchFieldInstitution = 'display_name';

export type SearchParametersInstitution = {
  search?: string;
  searchField?: SearchFieldInstitution;
  perPage?: number;
  page?: number;
  retriveAllPages?: boolean;
  toCsv?: string;
  toJson?: string;
  startPage?: number;
  // filter?: SourceFilterParameters;
  endPage?: number;
  groupBy?: GroupByInstitution;
  sortBy?: SortByInstitution;
  AbstractArrayToString?: boolean;
};
export type GroupByInstitution =
  | 'cited_by_count'
  | 'continent'
  | 'country_code'
  | 'has_ror'
  | 'is_global_south'
  | 'lineage'
  | 'repositories.host_organization'
  | 'summary_stats.2yr_mean_citedness'
  | 'summary_stats.h_index'
  | 'summary_stats.i10_index'
  | 'type'
  | 'works_count';
export type SortByInstitution = {
  field:
    | 'display_name'
    | 'cited_by_count'
    | 'works_count'
    | 'publication_date'
    /**  relevance_score (only exists if there's a search filter active) */
    | 'relevance_score';
  order: 'asc' | 'desc';
};

export type Institutions = {
  meta: Meta;
  results: Institution[];
};
type Meta = {
  count: number;
  db_response_time_ms: number;
  page?: number;
  per_page: number;
  next_cursor: string;
  groups_count?: number;
};
