import { type } from 'os';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTrackingEntity } from './base/base.tracking.entity';
import { Country } from './contry.entity';
import { InstitutionCategory } from './institition.catagory.entity';
import { InstitutionType } from './institution.typr.entity';
import { Sector } from './sector.entity';

@Entity()
export class Institution extends BaseTrackingEntity {
  /**
   *
   */
  constructor() {
    super();
    this.status = 0;
    this.sortOrder = 0;
    this.isNational = false;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ length: 300, nullable: true  })
  description: string;

  @Column()
  sortOrder: number;

  @ManyToOne((type) => InstitutionCategory,  { cascade: false, nullable: true })
  @JoinColumn()
  category: InstitutionCategory;

  @ManyToOne((type) => InstitutionType, { cascade: false, nullable: true })
  @JoinColumn()
  type: InstitutionType;

  @Column({ default: null })
  isNational: boolean;

  @ManyToOne((type) => Institution, { cascade: false, nullable: true })
  @JoinColumn()
  parentInstitution?: Institution;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ default: 0 })
  canNotDelete?: boolean;

  @Column({ length: 100 ,nullable: true })
  address: string;

  @Column({ name: 'sectorId' })
  sectorId: number;

  @ManyToOne((type) => Sector, { cascade: false, nullable: true ,eager:true})
  @JoinColumn()
  sector?: Sector;

  @ManyToOne((type) => Country, { cascade: false, nullable: true ,eager:true})
  @JoinColumn()
  country: Country;

  @Column()
  telephoneNumber: string;

  @Column({ length: 30, default: null, nullable: true })
  email: string;

  @Column({ default: null })
  uniqueIdentification: string;
}
