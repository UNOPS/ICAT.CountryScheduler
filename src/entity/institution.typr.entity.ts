import { MasterData } from "./base/master.data.entity";
import { UserType } from "./user.type.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InstitutionType extends MasterData {
    
  @ManyToMany((type) => UserType, { 
    eager: true,
    cascade: false 
  })
  @JoinTable({ name: 'instype_usertype' })
  userType: UserType[];
    
}
