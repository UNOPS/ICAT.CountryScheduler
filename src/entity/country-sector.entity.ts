
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseTrackingEntity } from "./base/base.tracking.entity";
import { Country } from "./contry.entity";
import { Sector } from "./sector.entity";

@Entity({ name: 'country_sector' })
export class CountrySector extends BaseTrackingEntity {

    constructor() {
        super();
        this.createdBy = '';
        this.editedBy = '';
      }
 
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Country, country => country.countrysector)
    public country: Country;

    @ManyToOne(() => Sector, sector => sector.countrysector)
    public sector: Sector;

    @Column("countryId")
    countryId:number;

    @Column("sectorId")
    sectorId:number;
    		 	
    @Column({ default: null })
    uniqueIdentification: string;


}
