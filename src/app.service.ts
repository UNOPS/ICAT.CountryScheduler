import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Observable, timeout } from 'rxjs';
import { Repository } from 'typeorm';
import { Applicability } from './entity/applicability.entity';
import { Country } from './entity/country.entity';
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
import { CountrySector } from './entity/country-sector.entity';
import e from 'express';

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
    private readonly methodologyDataRepository: Repository<CountrySector>,
    @InjectRepository(CountrySector)
    private readonly countrySectorRepository: Repository<CountrySector>,

    private httpService: HttpService,
  ) { }

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
  async manualSynMethodOne(dto: any) {
    await this.syncMethodologyOne(dto);
  }
  async manualSynMethodoloies(dto: any) {
    await this.syncMethodologies(dto);
  }


  async manualSynLerningMeterial() {

    await this.synclearningMeterial();
    setTimeout(async () => {
      await this.synclearningMeterialSector();
      await this.synclearningMeterialUserType();
    }, 1000)

  }

  async manualSynCountry() {
    await this.syncCountry();
    setTimeout(async () => {
      await this.syncSectorCountry();
    }, 5000)

  }


  async manualSynCountryOne(dto: any) {
    await this.SynCountryOne(dto);
    setTimeout(async () => {
      await this.syncSectorCountryOne(dto.id);
    }, 5000)

  }

  async manualSynUser() {
    await this.syncUser();
  }

  async SynCountryOne(dto: any) {
    let exsistingItem = await this.countryRepository.findOne({ where: { uniqueIdentification: dto.uniqueIdentification } });
    if (!exsistingItem) {
      await this.countryRepository.save(dto);
    }
    else {
      if (exsistingItem.id == dto.id) {
        exsistingItem.status = dto.status;
        exsistingItem.dataCollectionGhgModule = dto.dataCollectionGhgModule;
        exsistingItem.dataCollectionModule = dto.dataCollectionModule;
        exsistingItem.ghgModule = dto.ghgModule;
        exsistingItem.isMember = dto.isMember;
        exsistingItem.isSystemUse = dto.isSystemUse;
        exsistingItem.macModule = dto.macModule;
        await this.countryRepository.save(exsistingItem);
      }
    }
  }

  async syncSectorCountryOne(id: number) {
    let localMCountrySector = await this.countrySectorRepository.find({ where: { countryId: id } });
    let Pmu: any;

    await this.getMetodlogyFromPMU('country/country-sector').subscribe(async (m) => {
      Pmu = m.data.filter((a) => a.countryId == id);
      localMCountrySector.forEach(async (a) => await this.countrySectorRepository.delete(a.id));
      Pmu.forEach(async (a) => await this.countrySectorRepository.insert(a));
    });
  }

  async syncMethodologyOne(dto: Methodology) {
    let meth = await this.methodologyRepository.findOne({ where: { uniqueIdentification: dto.uniqueIdentification } });
    meth.isActive = dto.isActive;
    await this.methodologyRepository.save(meth);
  }

  async syncMethodologies(dto: Country) {
    let country = await this.countryRepository.findOne({ where: { id: dto.id } });
    let pmu;
    let oldmeth = await this.methodologyRepository.find({ where: { country: country } });

    await this.getMetodlogyFromPMU('methodology').subscribe(async (m) => {
      pmu = m.data.filter((a) => a.country.id == country.id);
      pmu.map(async (me) => {

        if (me.uniqueIdentification) {
          let exsistingItem = await oldmeth.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );
          if (!exsistingItem) {
            me.baselineImage = me.method.baselineImage;
            me.projectImage = me.method.projectImage;
            me.projectionImage = me.method.projectionImage;
            me.leakageImage = me.method.leakageImage;
            me.resultImage = me.method.resultImage;
            await this.methodologyRepository.insert(me);
          } else {
            exsistingItem.isActive = me.isActive
            await this.methodologyRepository.save(exsistingItem);
          }
        }
      });
    });
  }

  async manualSynUserOne(dto: any) {
    let exsistingItem = await this.userRepository.findOne({ where: { uniqueIdentification: dto.uniqueIdentification } });
    if (!exsistingItem) {
      let ins = new Institution();
      ins.name = dto.mrvInstitution;
      ins.description = dto.mrvInstitution;
      ins.telephoneNumber = '';
      ins.sectorId = 0;
      ins.country = dto.countryId;
      let n = await this.insRepository.insert(ins);
      if (dto.userType.id == 2) {
        dto.id = null;
        dto.userTypeId = "1";
        dto.institutionId = n.identifiers[0].id;
        await this.userRepository.insert(dto);
      }
    }
    else {
      if (dto.userType.id == 2 && exsistingItem.countryId == dto.country.id) {
        exsistingItem.status = dto.status;
        await this.userRepository.save(exsistingItem);
      }
    }
  }

  async syncCountry() {
    let localMCountry = await this.countryRepository.find();
    await this.getMetodlogyFromPMU('country').subscribe(async (m) => {
      m.data.map((me) => {

        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
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

  async syncSectorCountry() {
    let localMCountrySector = await this.countrySectorRepository.find();
    let Pmu: any;
    let sec: any;

    await this.getMetodlogyFromPMU('country/country-sector').subscribe(async (m) => {
      Pmu = m.data;

      sec = await localMCountrySector.filter((a) => !Pmu.some((b) => a.uniqueIdentification == b.uniqueIdentification));

      if (sec.length > 0) {
        sec.forEach((a) => this.countrySectorRepository.delete(a.id));
      }
    });

    setTimeout(async () => {
      await this.getMetodlogyFromPMU('country/country-sector').subscribe(async (m) => {
        m.data.map(async (me) => {

          if (me.uniqueIdentification != null && me.uniqueIdentification.length > 5) {
            let exsistingItem = localMCountrySector.find(
              (a) => a.uniqueIdentification === me.uniqueIdentification,
            );

            if (!exsistingItem) {

              await this.countrySectorRepository.save(me);
            } else {
              await this.countrySectorRepository.save(me);
            }
          }
        });
      });
    }, 5000)
  }

  async syncMethodologyData() {
    let localMCountry = await this.methodologyDataRepository.find();
    await this.getMetodlogyFromPMU('methodology-data').subscribe(async (m) => {
      m.data.map((me) => {

        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
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
    let localMCountry = await this.userRepository.find();
    this.getMetodlogyFromPMU('users/findUserBy').subscribe(async (m) => {
      m.data.map(async (me) => {

        if (me.uniqueIdentification) {

          let exsistingItem = await localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification
          );

          if (!exsistingItem) {
            let ins = new Institution();
            ins.name = me.mrvInstitution;
            ins.description = me.mrvInstitution;
            ins.telephoneNumber = '';
            ins.sectorId = 0;
            ins.country = me.countryId;
            let n = await this.insRepository.insert(ins);

            if (me.userTypeId == 2) {
              me.id = null;
              me.userTypeId = "1";
              me.institutionId = n.identifiers[0].id;
              await this.userRepository.insert(me);
            }

          }
          else {
            let id;
            let pass;
            let salt;

            if (me.userTypeId == 2) {
              await localMCountry.find((a) => { if (a.uniqueIdentification === me.uniqueIdentification) { id = a.id; pass = a.password; salt = a.salt } });

              let co = await this.countryRepository.findOne({ where: { id: me.countryId } });
              let ins1 = await this.insRepository.findOne({ where: { country: co, type: null } });
              me.id = id;
              me.userTypeId = "1";
              me.institution = ins1;
              me.password = pass;
              me.salt = salt;

              await this.userRepository.save(me);
            }
          }
        }
      });
    }, error => {
      throw new InternalServerErrorException(error)
    });
  }

  async syncSector() {
    let localMCountry = await this.sectorRepository.find();
    await this.getMetodlogyFromPMU('sector').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
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
    let localMCountry = await this.applicabilityRepository.find();
    await this.getMetodlogyFromPMU('applicability').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
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
    let localMCountry = await this.mitidationActionRepository.find();
    await this.getMetodlogyFromPMU('mitigation-action').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.unitIdentification) {
          let exsistingItem = localMCountry.find(
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
    let localMCountry = await this.learningMeterialRepository.find();
    await this.getMetodlogyFromPMU('learning-material').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
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

  async synclearningMeterialOne(dto: any) {
    const lm = await this.learningMeterialRepository.save(dto);

    dto.learningMaterialsector.map((a) => {
      a.learningMaterial2.id = lm.id;
      a.sector.id = dto.learningMaterialsector[0].sector.id;
    });

    try {
      dto.learningMaterialsector.map(async (a) => {
        const lms = await this.learningMeterialSectorRepository.save(await a);
      });
    } catch (error) { }

    dto.learningMaterialusertype.map((b) => {
      b.learningMaterial.id = lm.id;
      b.userType.id = dto.learningMaterialusertype[0].userType.id;
    });

    try {
      dto.learningMaterialusertype.map(async (b) => {
        if (b.userid == 2) {
          b.userType.id = 1;
          this.learningMeterialUserTypeRepository.save(b);
        }
        else if (b.userid == 6) {
          b.userType.id = 2;
          this.learningMeterialUserTypeRepository.save(b);
        }
        else if (b.userid == 7) {
          b.userType.id = 3;
          this.learningMeterialUserTypeRepository.save(b);
        }
        else if (b.userid == 8) {
          b.userType.id = 4;
          this.learningMeterialUserTypeRepository.save(b);
        }
        else if (b.userid == 9) {
          b.userType.id = 5;
          this.learningMeterialUserTypeRepository.save(b);
        }
        else if (b.userid == 10) {
          b.userType.id = 6;
          this.learningMeterialUserTypeRepository.save(b);
        }
        else if (b.userid == 11) {
          b.userType.id = 7;
          this.learningMeterialUserTypeRepository.save(b);
        }
        else if (b.userid == 12) {
          b.userType.id = 8;
          this.learningMeterialUserTypeRepository.save(b);
        }
        else if (b.userid == 13) {
          b.userType.id = 9;
          this.learningMeterialUserTypeRepository.save(b);
        }
      });
    } catch (error) { }
  }

  async synclearningMeterialSector() {
    let localMCountry = await this.learningMeterialSectorRepository.find();
    await this.getMetodlogyFromPMU('learning-material/sector').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            this.learningMeterialSectorRepository.save(me);
          } else {
            this.learningMeterialSectorRepository.save(me);
          }
        }
      });
    });
  }

  async synclearningMeterialUserType() {
    let localMCountry = await this.learningMeterialUserTypeRepository.find();
    await this.getMetodlogyFromPMU('learning-material/user-type').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
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
    });
  }

  async syncMethodology() {
    let localMethodology = await this.methodologyRepository.find();
    await this.getMetodlogyFromPMU('methodology').subscribe(async (m) => {
      m.data.map(async (me) => {

        if (me.uniqueIdentification) {
          let exsistingItem = await localMethodology.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );
          if (!exsistingItem) {

            me.baselineImage = me.method.baselineImage;
            me.projectImage = me.method.projectImage;
            me.projectionImage = me.method.projectionImage;
            me.leakageImage = me.method.leakageImage;
            me.resultImage = me.method.resultImage;
            await this.methodologyRepository.insert(me);
          } else {
            me.baselineImage = me.method.baselineImage;
            me.projectImage = me.method.projectImage;
            me.projectionImage = me.method.projectionImage;
            me.leakageImage = me.method.leakageImage;
            me.resultImage = me.method.resultImage;
            await this.methodologyRepository.save(me);
          }
        }
      });
    });
  }


  async syncDefaultValue() {
    let localMethodology = await this.defaultValueRepository.find();
    await this.getMetodlogyFromCalEngine('default-value').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = localMethodology.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            this.defaultValueRepository.insert(me);
          } else {
            this.defaultValueRepository.save(me);
          }
        }
      });
    });
  }

  async syncUnitConversion() {
    let localMethodology = await this.unitConversionRepository.find();
    await this.getMetodlogyFromCalEngine('unit-conversion').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = localMethodology.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {

            this.unitConversionRepository.insert(me);
          } else {
            this.unitConversionRepository.save(me);
          }
        }
      });
    });
  }

  getMetodlogyFromPMU(name: string): Observable<AxiosResponse<any>> {
    try {
      let methodologuURL = this.pmuBaseURl + name;
      return this.httpService.get(methodologuURL);
    } catch (e) {
    }
  }

  getMetodlogyFromCalEngine(name: string): Observable<AxiosResponse<any>> {
    try {
      let methodologuURL = this.calEngineBaseURl + name;
      return this.httpService.get(methodologuURL);
    } catch (e) {
    }
  }
}
