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

export type Field = {
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
