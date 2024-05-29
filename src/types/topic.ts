export type Topic = {
  description: string;
  display_name: string;
  domain: Domain;
  fields: Field;
  id: string;
  ids: Ids;
  keywords: string[];
  subfield: SubField;
  updated_date: string;
  works_count: number;
};

type Domain = {
  id: number;
  display_name: string;
};

type Field = {
  id: number;
  display_name: string;
};
type Ids = {
  openalex: string;
  wikidata: string;
};
type SubField = {
  id: number;
  display_name: string;
};
type Meta = {
  count: number;
  db_response_time_ms: number;
  page?: number;
  per_page: number;
  next_cursor: string;
  groups_count?: number;
};
export type Topics = {
  meta: Meta;
  topics: Topic[];
};

export type SearchParametersTopics = {
  search?: string;
  searchField?: SearchFieldTopics;
  perPage?: number;
  page?: number;
  retriveAllPages?: boolean;
  toCsv?: string;
  toJson?: string;
  startPage?: number;
  filter?: FilterParametersTopics;
  endPage?: number;
  groupBy?: GroupByTopics;
  sortBy?: SortByTopics;
  AbstractArrayToString?: boolean;
};

type SearchFieldTopics = 'display_name' | 'description' | 'keywords';
export type FilterParametersTopics = {
  cited_by_count?: string | string[];
  domain:
    | {
        id: number;
      }
    | { id: number }[];
  fields:
    | {
        id: number;
      }
    | { id: number }[];
  ids:
    | {
        openalex: number;
      }
    | { openalex: number }[];
  subfield:
    | {
        id: number;
      }
    | { id: number }[];
  works_count?: string | string[];
};

export type GroupByTopics =
  | 'cited_by_count'
  | 'domain.id'
  | 'fields.id'
  | 'subfield.id'
  | 'works_count';

export type SortByTopics = {
  field:
    | 'display_name'
    | 'cited_by_count'
    | 'works_count'
    | 'publication_date'
    /**  relevance_score (only exists if there's a search filter active) */
    | 'relevance_score';
  order: 'asc' | 'desc';
};
