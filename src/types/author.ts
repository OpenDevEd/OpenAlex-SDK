export type Author = {
  id: string;
  display_name?: string;
  orcid?: string;
  display_name_alternatives?: string[];
  works_count?: number;
};

export type ExternalIdsAuthor = 'orcid' | 'scopus' | 'twitter' | 'wikipedia';
