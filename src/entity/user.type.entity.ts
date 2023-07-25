import { Entity,OneToMany } from 'typeorm';
import { MasterData } from './base/master.data.entity';
import { LearningMaterialUserType } from './learning-material-usertype.entity';

@Entity()
export class UserType extends MasterData {
  

    @OneToMany(() => LearningMaterialUserType, learningMaterialUserType => learningMaterialUserType.userType)
    public learningMaterialusertype!: LearningMaterialUserType[];
 
}
