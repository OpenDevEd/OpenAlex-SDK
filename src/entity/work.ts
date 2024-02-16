import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('simple-json', { nullable: true })
  abstract_inverted_index?: {};

  @Column('simple-json', { nullable: true })
  alternate_host_venues?: any;
}

@Entity()
class Authorship {
  @PrimaryGeneratedColumn()
  id: string;

  author: Author;
  author_position?: 'first' | 'last' | 'middle';
  countries?: string[];
  institutions?: Institution[];
  is_corresponding?: boolean;
  raw_affiliation_string?: string;
  raw_author_name?: string;
}

@Entity()
class Author {
  @Column({ primary: true })
  id: string;

  @Column()
  display_name: string;

  @Column({ nullable: true })
  orcid?: string;
}

@Entity()
class Institution {
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
