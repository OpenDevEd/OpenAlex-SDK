import { Apc_payment, KeyTypeOpenAlex, TypeCrossRef } from './work';
export type FilterParameters = {
  authorships?: Authorships | Authorships[];
  apc_list?: Apc_payment | Apc_payment[];
  apc_paid?: Apc_payment | Apc_payment[];
  LocationOpenAlexFilter?: LocationOpenAlexFilter | LocationOpenAlexFilter[];
  cited_by_count?: number | number[];
  concepts?: Concept | Concept[];
  corresponding_author_ids?: string | string[];
  corresponding_institution_ids?: string | string[];
  countries_distinct_count?: number | number[];
  doi?: string | string[];
  fulltext_origin?: string | string[];
  grants?: Grants | Grants[];
  has_fulltext?: boolean | boolean[];
  ids?: Ids | Ids[];
  institutions_distinct_count?: number | number[];
  is_paratext?: boolean | boolean[];
  is_retracted?: boolean | boolean[];
  keywords?: Keywords | Keywords[];
  language?: string | string[];
  locations?: LocationOpenAlexFilter | LocationOpenAlexFilter[];
  locations_count?: number | number[];
  open_access?: Open_access | Open_access[];
  primary_location?: LocationOpenAlexFilter | LocationOpenAlexFilter[];
  publication_year?: number | number[];
  publicatuon_date?: string | string[];
  sustainable_development_goals?:
    | Sustainable_development_goals
    | Sustainable_development_goals[];
  type?: KeyTypeOpenAlex | KeyTypeOpenAlex[];
  TypeCrossRef?: TypeCrossRef | TypeCrossRef[];
  abstract?: Abstract | Abstract[];
  authors_count?: number | number[];
  best_open_version?:
    | 'any'
    | 'published'
    | 'acceptedOrPublished'
    | ('any' | 'published' | 'acceptedOrPublished')[];
  cited_by?: string | string[];
  cites?: string | string[];
  concepts_count?: number | number[];
  from_created_date?: string | string[];
  from_publication_date?: string | string[];
  from_updated_date?: string | string[];
  has_abstract?: boolean | boolean[];
  has_doi?: boolean | boolean[];
  has_oa_accepted_or_published_version?: boolean | boolean[];
  has_oa_submitted_version?: boolean | boolean[];
  has_orcid?: boolean | boolean[];
  has_pmcid?: boolean | boolean[];
  has_pmid?: boolean | boolean[];
  has_ngrams?: boolean | boolean[];
  has_references?: boolean | boolean[];
  journal?: string | string[];
  raw_affiliation_string?: Raw_affiliation_string | Raw_affiliation_string[];
  related_to?: string | string[];
  repository?: string | string[];
  to_publication_date?: string | string[];
  version?:
    | 'publishedVersion'
    | 'acceptedVersion'
    | 'submittedVersion'
    | 'null'
    | ('publishedVersion' | 'acceptedVersion' | 'submittedVersion' | 'null')[];
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
