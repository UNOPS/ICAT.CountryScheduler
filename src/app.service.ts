import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { Applicability } from './entity/applicability.entity';
import { Country } from './entity/contry.entity';
import { DefaultValue } from './entity/defaultValue.entity';
import { LearningMaterialSector } from './entity/learning-material-sector.entity';
import { LearningMaterialUserType } from './entity/learning-material-usertype.entity';
import { LearningMaterial } from './entity/learning-material.entity';
import { Methodology } from './entity/methodology.entity';
import { MitigationAction } from './entity/mitigation-action.entity';
import { Sector } from './entity/sector.entity';
import { UnitConversion } from './entity/unit-conversion.entity';
import { User } from './entity/user.entity';
import { Institution } from './entity/institution.entity';
import { MethodologyData } from './entity/methodology-data.entity';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly pmuBaseURl = process.env.PMU_BASE_URL;
  private readonly calEngineBaseURl = process.env.CAL_ENGINE_BASE_URL;

  constructor(
    @InjectRepository(Methodology)
    private readonly methodologyRepository: Repository<Methodology>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,

    @InjectRepository(MitigationAction)
    private readonly mitidationActionRepository: Repository<MitigationAction>,

    @InjectRepository(Applicability)
    private readonly applicabilityRepository: Repository<Applicability>,

    @InjectRepository(LearningMaterialSector)
    private readonly learningMeterialSectorRepository: Repository<LearningMaterialSector>,

    @InjectRepository(LearningMaterial)
    private readonly learningMeterialRepository: Repository<LearningMaterial>,

    @InjectRepository(LearningMaterialUserType)
    private readonly learningMeterialUserTypeRepository: Repository<LearningMaterialUserType>,

    @InjectRepository(DefaultValue)
    private readonly defaultValueRepository: Repository<DefaultValue>,

    @InjectRepository(UnitConversion)
    private readonly unitConversionRepository: Repository<UnitConversion>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Institution)
    private readonly insRepository: Repository<Institution>,

    @InjectRepository(MethodologyData)
    private readonly methodologyDataRepository: Repository<MethodologyData>,

    private httpService: HttpService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  @Cron('* * 23 * * *')
  async handleCron() {
    this.logger.debug('Called when the current second is 50');
    await this.syncCountry();
    await this.syncMethodologyData();
    await this.syncSector();
    await this.syncApplicability();
    await this.syncMAction();

    await this.syncDefaultValue();
    await this.syncUnitConversion();
  }

  async manualSynMethod() {
    await this.syncMethodology();
  }

  async manualSynLerningMeterial() {
    await this.synclearningMeterial();
    await this.synclearningMeterialSector();
    await this.synclearningMeterialUserType();
  }

  async manualSynCountry() {
    await this.syncCountry();
  }

  async manualSynUser() {
    await this.syncUser();
  }

  async syncCountry() {
    const localMCountry = await this.countryRepository.find();
    await this.getMetodlogyFromPMU('country').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          const exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            this.countryRepository.save(me);
          } else {
            this.countryRepository.save(me);
          }
        }
      });
    });
  }

  async syncMethodologyData() {
    const localMCountry = await this.methodologyDataRepository.find();
    await this.getMetodlogyFromPMU('methodology-data').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          const exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            this.methodologyDataRepository.save(me);
          } else {
            this.methodologyDataRepository.save(me);
          }
        }
      });
    });
  }

  async syncUser() {
    const localMCountry = await this.userRepository.find();
    this.getMetodlogyFromPMU('users/findUserBy').subscribe(async (m) => {
      m.data.map(async (me) => {
        if (me.uniqueIdentification) {
          const exsistingItem = await localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            const ins = new Institution();
            ins.name = me.mrvInstitution;
            ins.description = me.mrvInstitution;
            ins.country = me.countryId;
            const n = await this.insRepository.insert(ins);

            if (me.userTypeId == 2) {
              me.id = null;
              me.userTypeId = '1';
              me.institutionId = n.identifiers[0].id;
              await this.userRepository.insert(me);
            }
          } else {
            let id;
            await localMCountry.find((a) => {
              if (a.uniqueIdentification === me.uniqueIdentification) {
                id = a.id;
              }
            });

            if (me.userTypeId == 2) {
              me.id = id;
              me.userTypeId = '1';
              await this.userRepository.save(me);
            }
          }
        }
      });
    });
  }

  async syncSector() {
    const localMCountry = await this.sectorRepository.find();
    await this.getMetodlogyFromPMU('sector').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          const exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            this.sectorRepository.save(me);
          } else {
            this.sectorRepository.save(me);
          }
        }
      });
    });
  }

  async syncApplicability() {
    const localMCountry = await this.applicabilityRepository.find();
    await this.getMetodlogyFromPMU('applicability').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          const exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            this.applicabilityRepository.save(me);
          } else {
            this.applicabilityRepository.save(me);
          }
        }
      });
    });
  }

  async syncMAction() {
    const localMCountry = await this.mitidationActionRepository.find();
    await this.getMetodlogyFromPMU('mitigation-action').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.unitIdentification) {
          const exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            this.mitidationActionRepository.save(me);
          } else {
            this.mitidationActionRepository.save(me);
          }
        }
      });
    });
  }

  async synclearningMeterial() {
    const localMCountry = await this.learningMeterialRepository.find();

    await this.getMetodlogyFromPMU('learning-material').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          const exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );
          if (!exsistingItem) {
            this.learningMeterialRepository.save(me);
          } else {
            this.learningMeterialRepository.save(me);
          }
        }
      });
    });
  }

  async synclearningMeterialSector() {
    const localMCountry = await this.learningMeterialSectorRepository.find();
    await this.getMetodlogyFromPMU('learning-material/sector').subscribe(
      async (m) => {
        m.data.map((me) => {
          if (me.uniqueIdentification) {
            const exsistingItem = localMCountry.find(
              (a) => a.uniqueIdentification === me.uniqueIdentification,
            );

            if (!exsistingItem) {
              this.learningMeterialSectorRepository.save(me);
            } else {
              this.learningMeterialSectorRepository.save(me);
            }
          }
        });
      },
    );
  }

  async synclearningMeterialUserType() {
    const localMCountry = await this.learningMeterialUserTypeRepository.find();
    await this.getMetodlogyFromPMU('learning-material/user-type').subscribe(
      async (m) => {
        m.data.map((me) => {
          if (me.uniqueIdentification) {
            const exsistingItem = localMCountry.find(
              (a) => a.uniqueIdentification === me.uniqueIdentification,
            );

            if (!exsistingItem) {
              if (me.userid == 2) {
                me.userType = 1;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 6) {
                me.userType = 2;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 7) {
                me.userType = 3;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 8) {
                me.userType = 4;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 9) {
                me.userType = 5;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 10) {
                me.userType = 6;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 11) {
                me.userType = 7;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 12) {
                me.userType = 8;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 13) {
                me.userType = 9;
                this.learningMeterialUserTypeRepository.save(me);
              }
            } else {
              if (me.userid == 2) {
                me.userType = 1;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 6) {
                me.userType = 2;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 7) {
                me.userType = 3;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 8) {
                me.userType = 4;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 9) {
                me.userType = 5;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 10) {
                me.userType = 6;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 11) {
                me.userType = 7;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 12) {
                me.userType = 8;
                this.learningMeterialUserTypeRepository.save(me);
              }
              if (me.userid == 13) {
                me.userType = 9;
                this.learningMeterialUserTypeRepository.save(me);
              }
            }
          }
        });
      },
    );
  }

  async syncMethodology() {
    const localMethodology = await this.methodologyRepository.find();
    await this.getMetodlogyFromPMU('methodology').subscribe(async (m) => {
      m.data.map(async (me) => {
        if (me.uniqueIdentification) {
          const exsistingItem = await localMethodology.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );
          if (!exsistingItem) {
            await this.methodologyRepository.insert(me);
          } else {
            await this.methodologyRepository.save(me);
          }
        }
      });
    });
  }

  async syncDefaultValue() {
    const localMethodology = await this.defaultValueRepository.find();
    await this.getMetodlogyFromCalEngine('default-value').subscribe(
      async (m) => {
        m.data.map((me) => {
          if (me.uniqueIdentification) {
            const exsistingItem = localMethodology.find(
              (a) => a.uniqueIdentification === me.uniqueIdentification,
            );

            if (!exsistingItem) {
              this.defaultValueRepository.insert(me);
            } else {
              this.defaultValueRepository.save(me);
            }
          }
        });
      },
    );
  }

  async syncUnitConversion() {
    const localMethodology = await this.unitConversionRepository.find();
    await this.getMetodlogyFromCalEngine('unit-conversion').subscribe(
      async (m) => {
        m.data.map((me) => {
          if (me.uniqueIdentification) {
            const exsistingItem = localMethodology.find(
              (a) => a.uniqueIdentification === me.uniqueIdentification,
            );

            if (!exsistingItem) {
              this.unitConversionRepository.insert(me);
            } else {
              this.unitConversionRepository.save(me);
            }
          }
        });
      },
    );
  }

  getMetodlogyFromPMU(name: string): Observable<AxiosResponse<any>> {
    try {
      const methodologuURL = this.pmuBaseURl + name;
      return this.httpService.get(methodologuURL);
    } catch (e) {
      console.log('PMU error', e);
    }
  }

  getMetodlogyFromCalEngine(name: string): Observable<AxiosResponse<any>> {
    try {
      const methodologuURL = this.calEngineBaseURl + name;
      return this.httpService.get(methodologuURL);
    } catch (e) {
      console.log('Calculation Engine error', e);
    }
  }
}
