import { Apc_payment, KeyTypeOpenAlex, TypeCrossRef } from './workTypes';

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
  has_fulltext: boolean;
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
  type?: string;
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
