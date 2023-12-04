
import { Column, Entity, PrimaryGeneratedColumn,ManyToOne ,JoinColumn} from 'typeorm';
import { BaseTrackingEntity } from './base/base.tracking.entity';
import { Country } from './country.entity';

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

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'countryId' })
    public country!: Country;


  @Column({ default: null })
  isMac: Number; //1
  
  @Column({ default: null })  // baseLine , project
  scenario: string;

  name: string;
}
