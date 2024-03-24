export type SourceFilterParameters = {
  apc_prices?: ApcPrices | ApcPrices[];
  apc_usd?: string | string[];
  cited_by_count?: string | string[];
  country_code?: string | string[];
  host_organization?: string | string[];
  host_organization_lineage?: string | string[];
  ids?: Ids | Ids[];
  is_in_doaj?: boolean | boolean[];
  is_oa?: boolean | boolean[];
  issn?: string | string[];
  publisher?: string | string[];
  summary_stats?: SummaryStats | SummaryStats[];
  type?:
    | (
        | 'journal'
        | 'repository'
        | 'conference'
        | 'ebook platform'
        | 'book series'
      )
    | (
        | 'journal'
        | 'repository'
        | 'conference'
        | 'ebook platform'
        | 'book series'
      )[];
  works_count?: string | string[];
  x_concepts?: XConcept | XConcept[];
};

type ApcPrices = {
  price: number;
  currency: string;
};
type Ids = {
  openalex: string;
};

type SummaryStats = {
  '2yr_mean_citedness': number;
  h_index: number;
  i10_index: number;
};
type XConcept = {
  id: string;
};
