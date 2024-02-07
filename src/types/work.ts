import { FilterParameters } from './filterParameters';

export type WorkResult = Work | { error: number; message: string };

export type Work = {
  abstract_inverted_index?: {};
  alternate_host_venues?: any;
  // this limited to 100 authors
  authorships?: Authorship[];
  apc_list?: Apc_payment;
  apc_paid?: Apc_payment;
  best_oa_location?: LocationOpenAlex;
  biblio: Biblio;
  cited_by_api_url?: string;
  cited_by_count?: number;
  concepts?: ConceptWork[];
  corresponding_author_ids?: string[];
  corresponding_institution_ids?: string[];
  countries_distinct_count?: number;
  counts_by_year: CountsByYear[];
  created_date?: string;
  display_name?: string;
  doi?: string;
  fulltext_origin?: string;
  grants?: {
    funder?: string;
    funder_display_name?: string;
    award_id?: string;
  };
  has_fulltext?: boolean;
  host_venue?: LocationOpenAlex;
  id: string;
  ids?: {
    openalex?: string;
    doi?: string;
    mag?: number;
    pmid?: string;
  };
  institutions_distinct_count?: number;
  is_paratext?: boolean;
  is_retracted?: boolean;
  keywords?: {
    keyword?: string;
    score?: number;
  }[];
  language?: string;
  license?: string;
  locations?: LocationOpenAlex[];
  locations_count?: number;
  mesh?: {
    descriptor_ui: string;
    descriptor_name: string;
    qualifier_ui: string;
    qualifier_name: string;
    is_major_topic: boolean;
  };
  ngrams_url?: string;
  open_access?: {
    is_oa: boolean;
    oa_status: 'gold' | 'green' | 'bronze' | 'hybrid' | 'closed';
    oa_url: string;
    any_repository_has_fulltext: boolean;
  };
  primary_location?: LocationOpenAlex;
  publication_date?: string;
  publication_year?: number;
  referenced_works?: string[];
  related_works?: string[];
  sustainable_development_goals?: {}[];
  title?: string;
  type?: KeyTypeOpenAlex;
  type_crossref?: TypeCrossRef;
  updated_date?: string;
  ngrams?: string;
  ngram_count?: number;
  ngram_tokens?: number;
  term_frequency?: number;
};
type Authorship = {
  author: Author;
  author_position?: 'first' | 'last' | 'middle';
  countries?: string[];
  institutions?: Institution[];
  is_corresponding?: boolean;
  raw_affiliation_string?: string;
  raw_author_name?: string;
};

type Author = {
  id: string;
  display_name: string;
  orcid?: string;
};
type Institution = {
  id: string;
  display_name?: string;
  ror?: string;
  country_code?: string;
  type?: string;
  lineage?: string[];
};
export type Apc_payment = {
  value?: number;
  currency?: string;
  provenance?: string;
  value_usd?: number;
};

type LocationOpenAlex = {
  is_accepted?: boolean;
  is_oa?: boolean;
  is_published?: boolean;
  landing_page_url?: string;
  license?: string;
  source?: Source;
  pdf_url?: string;
  version?: string;
};

type Source = {
  id: string;
  display_name?: string;
  issn_l?: string;
  issn?: string[];
  host_organization?: string;
  type?: string;
};

type Biblio = {
  volume?: string;
  issue?: string;
  first_page?: string;
  last_page?: string;
};
type ConceptWork = {
  id: string;
  wikidata?: string;
  display_name?: string;
  level?: number;
  score?: number;
};
type CountsByYear = {
  year: number;
  count: number;
};
export type KeyTypeOpenAlex =
  | 'article'
  | 'book-chapter'
  | 'dissertation'
  | 'book'
  | 'dataset'
  | 'paratext'
  | 'other'
  | 'reference-entry'
  | 'report'
  | 'peer-review'
  | 'standard'
  | 'editorial'
  | 'erratum'
  | 'grant'
  | 'letter'
  | 'edited-book';

type KeyDisplayNameType =
  | 'article'
  | 'book-chapter'
  | 'dissertation'
  | 'book'
  | 'dataset'
  | 'paratext'
  | 'other'
  | 'reference-entry'
  | 'report'
  | 'peer-review'
  | 'standard'
  | 'editorial'
  | 'erratum'
  | 'grant'
  | 'letter'
  | 'edited-book';

export type TypeCrossRef =
  | 'book-section'
  | 'monograph'
  | 'report-component'
  | 'report'
  | 'peer-review'
  | 'book-track'
  | 'journal-article'
  | 'book-part'
  | 'other'
  | 'book'
  | 'journal-volume'
  | 'book-set'
  | 'reference-entry'
  | 'proceedings-article'
  | 'journal'
  | 'component'
  | 'book-chapter'
  | 'proceedings-series'
  | 'report-series'
  | 'proceedings'
  | 'database'
  | 'standard'
  | 'reference-book'
  | 'posted-content'
  | 'journal-issue'
  | 'dissertation'
  | 'grant'
  | 'dataset'
  | 'book-series'
  | 'edited-book';

type TypeOpenAlex = {
  key: KeyTypeOpenAlex;
  key_display_name: KeyDisplayNameType;
  count: number;
};
export type Works = {
  meta: {
    count: number;
    db_response_time_ms: number;
    page: number;
    per_page: number;
    groups_count: null | number;
  };
  results: Work[];
  group_by?: TypeOpenAlex[];
};
export interface SearchParameters {
  search?: string;
  searchField?: SeachField;
  perPage?: number;
  page?: number;
  retriveAllPages?: boolean;
  toJson?: boolean;
  fileName?: string;
  startPage?: number;
  endPage?: number;
  filter?: FilterParameters;
  group_by?: GroupBy;
}

export type SeachField = 'abstract' | 'title' | 'title_and_abstract' | 'display_name' | 'fulltext';

//TODO : add group by type
export type GroupBy =
  | 'authors_count'
  | 'authorships.author.id'
  | 'authorships.author.orcid'
  | 'authorships.countries'
  | 'authorships.institutions.country_code'
  | 'authorships.institutions.continent'
  | 'authorships.institutions.is_global_south'
  | 'authorships.institutions.id'
  | 'authorships.institutions.lineage'
  | 'authorships.institutions.ror'
  | 'authorships.institutions.type'
  | 'authorships.is_corresponding'
  | 'apc_list.value'
  | 'apc_list.currency'
  | 'apc_list.provenance'
  | 'apc_list.value_usd'
  | 'apc_paid.value'
  | 'apc_paid.currency'
  | 'apc_paid.provenance'
  | 'apc_paid.value_usd'
  | 'best_oa_location.is_accepted'
  | 'best_oa_location.license'
  | 'best_oa_location.is_published'
  | 'best_oa_location.source.host_organization'
  | 'best_oa_location.source.id'
  | 'best_oa_location.source.is_in_doaj'
  | 'best_oa_location.source.issn'
  | 'best_oa_location.source.type'
  | 'best_oa_location.version'
  | 'best_open_version'
  | 'biblio.first_page'
  | 'biblio.issue'
  | 'biblio.last_page'
  | 'biblio.volume'
  | 'cited_by_count'
  | 'cites'
  | 'concepts_count'
  | 'concepts.id'
  | 'concepts.wikidata'
  | 'corresponding_author_ids'
  | 'corresponding_institutions_ids'
  | 'countries_distinct_count'
  | 'fulltext_origin'
  | 'grants.award_id'
  | 'grants.funder'
  | 'has_abstract'
  | 'has_doi'
  | 'has_fulltext'
  | 'has_orcid'
  | 'has_pmid'
  | 'has_pmcid'
  | 'has_ngrams'
  | 'has_references'
  | 'indexed_in'
  | 'is_retracted'
  | 'is_paratext'
  | 'journal'
  | 'keywords.keyword'
  | 'language'
  | 'locations.is_accepted'
  | 'locations.is_published'
  | 'locations.source.host_institution_lineage'
  | 'locations.source.is_in_doaj'
  | 'locations.source.publisher_lineage'
  | 'locations_count'
  | 'open_access.any_repository_has_fulltext'
  | 'open_access.is_oa'
  | 'open_access.oa_status'
  | 'primary_location.is_accepted'
  | 'primary_location.is_oa'
  | 'primary_location.is_published'
  | 'primary_location.license'
  | 'primary_location.source.has_issn'
  | 'primary_location.source.host_organization'
  | 'primary_location.source.id'
  | 'primary_location.source.is_in_doaj'
  | 'primary_location.source.issn'
  | 'primary_location.source.publisher_lineage'
  | 'primary_location.source.type'
  | 'primary_location.version'
  | 'publication_year'
  | 'repository'
  | 'sustainable_development_goals.id'
  | 'type'
  | 'type_crossref';

export type ExternalIdsWork = 'doi' | 'mag' | 'pmid' | 'pmcid';
