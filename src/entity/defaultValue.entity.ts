
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTrackingEntity } from './base/base.tracking.entity';

@Entity()
export class DefaultValue extends BaseTrackingEntity {


    @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  parameterName: string;

  @Column({ default: null })
  parentId: number;

  @Column({ default: null })
  unit: string;

  @Column({ default: null })
  administrationLevel: string;

  @Column({ default: null })
  source: string;

  @Column({ default: null })
  year: number;

  @Column({ default: null })
  value: string;

  @Column({ default: null })
  uniqueIdentification: string;

  name: string;
}