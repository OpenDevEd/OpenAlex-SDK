import { Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Entity } from 'typeorm';

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('simple-json', { nullable: true })
  abstract_inverted_index?: {};

  @Column('simple-json', { nullable: true })
  alternate_host_venues?: any;
}

export type AuthorPosition = 'first' | 'last' | 'middle';
@Entity()
export class Authorship {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => Author)
  @JoinColumn()
  author: Author;

  @Column({ enum: ['first', 'last', 'middle'], nullable: true })
  author_position?: AuthorPosition;

  @Column({ type: 'simple-array', nullable: true })
  countries?: string[];

  // TODO: ask about Author and Institution relationship
  institutions?: Institution[];

  is_corresponding?: boolean;

  raw_affiliation_string?: string;

  raw_author_name?: string;
}

@Entity()
export class Author {
  @Column({ primary: true })
  id: string;

  @Column()
  display_name: string;

  @Column({ nullable: true })
  orcid?: string;
}
@Entity()
export class Institution {
  @Column({ primary: true })
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

  @OneToOne(() => Source)
  @JoinColumn()
  source?: Source;

  @Column({ nullable: true })
  pdf_url?: string;

  @Column({ nullable: true })
  version?: string;
}

@Entity()
export class Source {
  @Column({ primary: true })
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
}
