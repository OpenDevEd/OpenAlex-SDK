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
