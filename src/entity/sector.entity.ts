import {Entity,Column,PrimaryGeneratedColumn,OneToMany,} from 'typeorm';
import { BaseTrackingEntity } from "./base/base.tracking.entity";
import { CountrySector } from './country-sector.entity';
import { LearningMaterialSector } from './learning-material-sector.entity';

@Entity({ name: 'sector' })
export class Sector extends BaseTrackingEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: null })
    name: string;

    @Column({ length: 300, default: null })
    description: string;

    @Column({ default: 1 })
    sortOrder: number;


    @Column()
    emissionSummary: string;

    @Column()
    ndcDocuments: string;

    @Column({ default: null })
    uniqueIdentification: string;

    @OneToMany(() => CountrySector, countrySector => countrySector.sector)
  public countrysector!: CountrySector[];


    @OneToMany(() => LearningMaterialSector,(learningMaterialSector) => learningMaterialSector.sector)
    public learningMaterialsector!: LearningMaterialSector[];
  
}




