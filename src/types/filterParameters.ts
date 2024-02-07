import { Apc_payment, KeyTypeOpenAlex, TypeCrossRef } from './work';

export type FilterParameters = {
  authorships?: Authorships;
  apc_list?: Apc_payment;
  apc_paid?: Apc_payment;
  LocationOpenAlexFilter?: LocationOpenAlexFilter;
  cited_by_count?: number;
  concepts?: Concept;
  corresponding_author_ids?: string;
  corresponding_institution_ids?: string;
  countries_distinct_count?: number;
  doi?: string;
  fulltext_origin?: string;
  grants?: Grants;
  has_fulltext?: boolean;
  ids?: Ids;
  institutions_distinct_count?: number;
  is_paratext?: boolean;
  is_retracted?: boolean;
  keywords?: Keywords;
  language?: string;
  locations?: LocationOpenAlexFilter;
  locations_count?: number;
  open_access?: Open_access;
  primary_location?: LocationOpenAlexFilter;
  publication_year?: number;
  publicatuon_date?: string;
  sustainable_development_goals?: Sustainable_development_goals;
  type?: KeyTypeOpenAlex;
  TypeCrossRef?: TypeCrossRef;
  abstract?: Abstract;
  authors_count?: number;
  best_open_version?: 'any' | 'published' | 'acceptedOrPublished';
  cited_by?: string;
  cites?: string;
  concepts_count?: number;
  /**
   * A string representing a date in the format "yyyy-mm-dd This field requires an OpenAlex Premium subscription".
   */
  from_created_date?: string;
  /**
   * A string representing a date in the format "yyyy-mm-dd".
   */
  from_publication_date?: string;
  /**
   * A string representing a date in the format "yyyy-mm-dd".
   */
  from_updated_date?: string;
  has_abstract?: boolean;
  has_doi?: boolean;
  has_oa_accepted_or_published_version?: boolean;
  has_oa_submitted_version?: boolean;
  has_orcid?: boolean;
  has_pmcid?: boolean;
  has_pmid?: boolean;
  has_ngrams?: boolean;
  has_references?: boolean;
  journal?: string;
  raw_affiliation_string?: Raw_affiliation_string;
  related_to?: string;
  repository?: string;
  /**
   * A string representing a date in the format "yyyy-mm-dd".
   */
  to_publication_date?: string;
  version?: 'publishedVersion' | 'acceptedVersion' | 'submittedVersion' | 'null';
};

type Authorships = {
  author?: Author;
  countries?: string[];
  institutions?: Institution;
  is_corresponding?: boolean;
};

type Author = {
  id?: string;
  orcid?: string;
};

type Institution = {
  id?: string;
  country_code?: string;
  lineage?: string[];
  ror?: string;
  continent?: string;
  type?: string;
  is_global_south?: boolean;
};

type LocationOpenAlexFilter = {
  is_accepted?: boolean;
  is_published?: boolean;
  license?: string;
  is_oa?: boolean;
  version?: string;
  source?: Source;
};

type Source = {
  id?: string;
  issn?: string[];
  is_in_doaj?: boolean;
  type?: string;
  host_organization?: string;
  host_institution_lineage?: string;
  publisher_lineage?: string;
  has_issn?: boolean;
};

type Concept = {
  id?: string;
  wikidata?: string;
};
type Grants = {
  funder?: string;
  award_id?: string;
};

type Ids = {
  pmcid?: string;
  pmid?: string;
  openalex?: string;
  mag?: string;
};

type Keywords = {
  keyword?: string;
};

type Open_access = {
  any_repository_has_fulltext?: boolean;
  is_oa?: boolean;
  oa_status?: 'gold' | 'green' | 'bronze' | 'hybrid' | 'closed';
};

type Sustainable_development_goals = {
  id?: string;
};

type Abstract = {
  search: string;
};

type Raw_affiliation_string = {
  search: string;
};
