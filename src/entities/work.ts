import { Column, PrimaryGeneratedColumn, Entity, OneToMany, PrimaryColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

// @Entity()
// export class Work {
//   @PrimaryGeneratedColumn()
//   id: string;

//   @Column('simple-json', { nullable: true })
//   abstract_inverted_index?: {};

//   @Column('simple-json', { nullable: true })
//   alternate_host_venues?: any;
// }

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
}

@Entity()
export class CountsByYear {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  year: number;

  @Column()
  count: number;
}
