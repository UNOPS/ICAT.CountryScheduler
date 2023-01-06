import {
    Column,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTrackingEntity } from './base/base.tracking.entity';

@Entity({ name: 'unit_conversion' })
export class UnitConversion extends BaseTrackingEntity {
    constructor() {
        super();
        this.createdBy = '';
        this.editedBy = '';
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    fromUnit: string;

    @Column({ nullable: false })
    toUnit: string;

    @Column({ nullable: false })
    conversionFactor: number;

    @Column({ default: null })
    uniqueIdentification: string;
}