export type InstitutionFilterParameters = {
  cited_by_count?: number | number[] | string;
  country_code?: string | string[];
  openalex?: string | string[];
  lineage?: string | string[];
  repositories?: Repositories | Repositories[];
  ror?: string | string[];
  summary_stats?: SummaryStats | SummaryStats[];
  type?: string | string[];
  works_count?: string | string[];
  x_concepts?: Concept | Concept[];
  continent?: Continent | Continent[];
};
type Continent =
  | 'africa'
  | 'asia'
  | 'europe'
  | 'north_america'
  | 'oceania'
  | 'south_america';

type Repositories = {
  host_organization?: string;
  host_organization_lineage?: string;
  id?: string;
};

type SummaryStats = {
  '2yr_mean_citedness'?: number;
  h_index?: number;
  i10_index?: number;
};

type Concept = {
  id: string;
};
