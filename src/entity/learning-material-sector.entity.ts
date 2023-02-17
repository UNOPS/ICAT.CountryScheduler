import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseTrackingEntity } from './base/base.tracking.entity';
import { LearningMaterial } from './learning-material.entity';
import { Sector } from './sector.entity';

@Entity({ name: 'learning_material_sector' })
export class LearningMaterialSector extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  uniqueIdentification: string;

  @ManyToOne(
    () => LearningMaterial,
    (learningMaterial) => learningMaterial.learningMaterialsector,
  )
  public learningMaterial2!: LearningMaterial;

  @ManyToOne(() => Sector, (sector) => sector.learningMaterialsector)
  public sector!: Sector;
}
