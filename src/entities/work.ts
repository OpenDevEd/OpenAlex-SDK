import { KeyTypeOpenAlex, TypeCrossRef } from '../types/work';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Work {
  @PrimaryColumn()
  id: string;

  @Column('simple-json', { nullable: true })
  abstract_inverted_index?: {};

  @Column('simple-json', { nullable: true })
  alternate_host_venues?: any;

  @OneToMany(() => Authorship, (authorship) => authorship.work)
  authorships?: Authorship[];

  @OneToOne(() => ApcPayment)
  @JoinColumn()
  apc_list?: ApcPayment;

  @OneToOne(() => ApcPayment)
  @JoinColumn()
  apc_paid?: ApcPayment;

  @OneToOne(() => LocationOpenAlex)
  @JoinColumn()
  best_oa_location?: LocationOpenAlex;

  @OneToOne(() => Biblio)
  @JoinColumn()
  biblio?: Biblio;

  @Column({ nullable: true })
  cited_by_api_url?: string;

  @Column({ nullable: true })
  cited_by_count?: number;

  @ManyToMany(() => ConceptWork)
  @JoinTable()
  concepts?: ConceptWork[];

  @Column({ type: 'simple-array', nullable: true })
  corresponding_author_ids?: string[];

  @Column({ type: 'simple-array', nullable: true })
  corresponding_institution_ids?: string[];

  @Column({ nullable: true })
  countries_distinct_count?: number;

  @OneToMany(() => CountsByYear, (count) => count.year)
  counts_by_year: CountsByYear[];

  @Column({ nullable: true })
  created_date?: string;

  @Column({ nullable: true })
  display_name?: string;

  @Column({ nullable: true })
  doi?: string;

  @Column({ nullable: true })
  fulltext_origin?: string;

  @Column('simple-json', { nullable: true })
  grants?: {
    funder?: string;
    funder_display_name?: string;
    award_id?: string;
  };

  @Column({ nullable: true })
  has_fulltext?: boolean;

  @OneToOne(() => LocationOpenAlex)
  @JoinColumn()
  host_venue?: LocationOpenAlex;

  @Column({ nullable: true })
  ids?: {
    openalex?: string;
    doi?: string;
    mag?: number;
    pmid?: string;
  };

  @Column({ nullable: true })
  institutions_distinct_count?: number;

  @Column({ nullable: true })
  is_paratext?: boolean;

  @Column({ nullable: true })
  is_retracted?: boolean;

  @Column('simple-json', { nullable: true })
  keywords?: {
    keyword?: string;
    score?: number;
  }[];

  @Column({ nullable: true })
  language?: string;

  @Column({ nullable: true })
  license?: string;

  @OneToMany(() => LocationOpenAlex, (location) => location.work)
  locations?: LocationOpenAlex[];

  @Column({ nullable: true })
  locations_count?: number;

  @Column('simple-json', { nullable: true })
  mesh?: {
    descriptor_ui: string;
    descriptor_name: string;
    qualifier_ui: string;
    qualifier_name: string;
    is_major_topic: boolean;
  };

  @Column({ nullable: true })
  ngrams_url?: string;

  @Column('simple-json', { nullable: true })
  open_access?: {
    is_oa: boolean;
    oa_status: 'gold' | 'green' | 'bronze' | 'hybrid' | 'closed';
    oa_url: string;
    any_repository_has_fulltext: boolean;
  };

  @OneToOne(() => LocationOpenAlex)
  @JoinColumn()
  primary_location?: LocationOpenAlex;

  @Column({ nullable: true })
  publication_date?: string;

  @Column({ nullable: true })
  publication_year?: number;

  @Column({ type: 'simple-array', nullable: true })
  referenced_works?: string[];

  @Column({ type: 'simple-array', nullable: true })
  related_works?: string[];

  @Column('simple-json', { nullable: true })
  sustainable_development_goals?: {}[];

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  type?: KeyTypeOpenAlex;

  @Column({ nullable: true })
  type_crossref?: TypeCrossRef;

  @Column({ nullable: true })
  updated_date?: string;

  @Column({ nullable: true })
  ngrams?: string;

  @Column({ nullable: true })
  ngram_count?: number;

  @Column({ nullable: true })
  ngram_tokens?: number;

  @Column({ nullable: true })
  term_frequency?: number;
}

export type AuthorPosition = 'first' | 'last' | 'middle';
@Entity()
export class Authorship {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Author, (author) => author.authorships)
  author: Author;

  @Column({ enum: ['first', 'last', 'middle'], nullable: true })
  author_position?: AuthorPosition;

  @Column({ type: 'simple-array', nullable: true })
  countries?: string[];

  @ManyToMany(() => Institution)
  @JoinTable()
  institutions?: Institution[];

  @Column({ nullable: true })
  is_corresponding?: boolean;

  @Column({ nullable: true })
  raw_affiliation_string?: string;

  @Column({ nullable: true })
  raw_author_name?: string;

  @ManyToOne(() => Work, (work) => work.authorships)
  work: Work;
}

@Entity()
export class Author {
  @PrimaryColumn()
  id: string;

  @Column()
  display_name: string;

  @Column({ nullable: true })
  orcid?: string;

  @OneToMany(() => Authorship, (authorship) => authorship.author)
  authorships?: Authorship[];
}

@Entity()
export class Institution {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  display_name?: string;

  @Column({ nullable: true })
  ror?: string;

  @Column({ nullable: true })
  country_code?: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ type: 'simple-array', nullable: true })
  lineage?: string[];
}

@Entity()
export class ApcPayment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  value?: number;

  @Column({ nullable: true })
  currency?: string;

  @Column({ nullable: true })
  provenance?: string;

  @Column({ nullable: true })
  value_usd?: number;
}

@Entity()
export class LocationOpenAlex {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  is_accepted?: boolean;

  @Column({ nullable: true })
  is_oa?: boolean;

  @Column({ nullable: true })
  is_published?: boolean;

  @Column({ nullable: true })
  landing_page_url?: string;

  @Column({ nullable: true })
  license?: string;

  @ManyToOne(() => Source, (source) => source.locations)
  source?: Source;

  @Column({ nullable: true })
  pdf_url?: string;

  @Column({ nullable: true })
  version?: string;

  @ManyToOne(() => Work, (work) => work.locations)
  work: Work;
}

@Entity()
export class Source {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  display_name?: string;

  @Column({ nullable: true })
  issn_l?: string;

  @Column({ type: 'simple-array', nullable: true })
  issn?: string[];

  @Column({ nullable: true })
  host_organization?: string;

  @Column({ nullable: true })
  type?: string;

  @OneToMany(() => LocationOpenAlex, (location) => location.source)
  locations?: LocationOpenAlex[];
}

@Entity()
export class Biblio {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  volume?: string;

  @Column({ nullable: true })
  issue?: string;

  @Column({ nullable: true })
  first_page?: string;

  @Column({ nullable: true })
  last_page?: string;
}

@Entity()
export class ConceptWork {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  wikidata?: string;

  @Column({ nullable: true })
  display_name?: string;

  @Column({ nullable: true })
  level?: number;

  @Column({ nullable: true })
  score?: number;

  @ManyToMany(() => Work)
  works?: Work[];
}

@Entity()
export class CountsByYear {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  year: number;

  @Column()
  count: number;

  @ManyToOne(() => Work, (work) => work.counts_by_year)
  work: Work;
}
