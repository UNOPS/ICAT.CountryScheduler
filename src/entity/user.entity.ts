import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTrackingEntity } from "./base/base.tracking.entity";
import { Country } from './contry.entity';
import { Institution } from './institution.entity';
import { UserType } from './user.type.entity';

@Entity()
export class User extends BaseTrackingEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'userTypeId' })
    userTypeId: number;

    @ManyToOne((type) => UserType, { cascade: false })
    @JoinColumn()
    userType: UserType;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'institutionId' })
    institutionId: number;

    @ManyToOne((type) => Institution, { eager: true })
    @JoinColumn()
    institution: Institution;

<<<<<<< HEAD
    // @OneToMany(() => Assessment, assessment => assessment.user)
    //   assessments: Assessment[];

    @Column()
    telephone: string;

    @Column()
    mobile: string;

    @Column({ nullable: true })
    designation: string;


    @Column({ name: 'countryId' })
    countryId: number;

    @ManyToOne((type) => Country, { cascade: false })
    @JoinColumn({ name: 'countryId' })
    country: Country;

    // @Exclude()
    @Column()
    salt: string;

    // @Exclude()
    @Column()
    password: string;

    // @Exclude()
    @Column()
    resetToken: string;

    @Column()
    deletedAt?: Date;

    @Column({ default: 0 })
    canNotDelete?: boolean;

=======
    @Column()
    telephone: string;

    @Column()
    mobile: string;

    @Column({ nullable: true })
    designation: string;


    @Column({ name: 'countryId' })
    countryId: number;

    @ManyToOne((type) => Country, { cascade: false })
    @JoinColumn({ name: 'countryId' })
    country: Country;

    @Column()
    salt: string;

    @Column()
    password: string;

    @Column()
    resetToken: string;

    @Column()
    deletedAt?: Date;

    @Column({ default: 0 })
    canNotDelete?: boolean;

>>>>>>> 568203418a342b307da4884990a5f977cfff5617
    fullName: string;

    @Column({ default: null })
    uniqueIdentification: string;
}
