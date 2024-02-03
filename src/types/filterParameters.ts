import { Apc_payment } from './workTypes';

export type FilterParameters = {
  authorships?: Authorships;
  apc_list?: Apc_payment;
  apc_paid?: Apc_payment;
  LocationOpenAlexFilter?: LocationOpenAlexFilter;
  cited_by_count?: number;
  concepts?: concept;
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
  source?: Source;
};

type Source = {
  id?: string;
  issn?: string[];
  is_in_doaj?: boolean;
  type?: string;
  host_organization?: string;
};

type concept = {
  id?: string;
  wikidata?: string;
};
