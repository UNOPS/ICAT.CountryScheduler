import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Applicability } from './applicability.entity';

import { BaseTrackingEntity } from './base/base.tracking.entity';
import { Country } from './contry.entity';
import { MethodologyData } from './methodology-data.entity';
import { MitigationAction } from './mitigation-action.entity';
import { Sector } from './sector.entity';

@Entity({ name: 'methodology' })
export class Methodology extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  version: string;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  displayName: string;

  @Column({ default: null })
  developedBy: string;

  @Column({ default: null })
  parentId: number;

  @Column({ default: null })
  applicableSector: string;

  @Column({ default: null })
  Documents: string;
  
  @Column({ default: 0 })
  isActive: number;

  @Column({ default: null })
  easenessOfDataCollection: string;

  @Column({ default: null })
  transportSubSector: string;

  @Column({ default: null })
  upstream_downstream: string;

  @Column({ default: null })
  ghgIncluded: string;

  @Column({ default: null })
  uniqueIdentification: string;

  @ManyToOne((type) => MitigationAction, { cascade: false })
  @JoinColumn({ name: 'mitigationActionTypeId' })
  mitigationActionType?: MitigationAction;

  @ManyToOne((type) => Country, { cascade: false })
  @JoinColumn({ name: 'countryId' })
  country?: Country;

  

  @ManyToOne((type) => Sector, { cascade: false })
  @JoinColumn({ name: 'sectorId' })
  sector?: Sector;

  
  @ManyToOne((type) => Applicability, { cascade: false })
  @JoinColumn({ name: 'applicabilityId' })
  applicability?: Applicability;


  @ManyToOne((type) => MethodologyData, { cascade: false })
  @JoinColumn({ name: 'methodId' })
  method?: MethodologyData;
}
