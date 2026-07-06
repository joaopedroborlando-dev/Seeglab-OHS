import IHazardAssessmentDto from "../dto/IHazardAssessmentDto";
import {HazardAssessment} from "../../../database/entity/HazardAssessment";
import {AppDataSource} from "../../../database/dataSource";
import {WorkUnit} from "../../../database/entity/WorkUnit";
import Hazard from "../../../database/entity/Hazard";
import {HazardAssessmentMapper} from "../mapper/HazardAssessmentMapper";
import {getContext} from "../../../context/requestContext";

const createHazardAssessment = async (data:IHazardAssessmentDto):Promise<IHazardAssessmentDto | null>=> {
    if(!data) throw new Error("INCORRECT_DATA");
    const workUnit = await AppDataSource.manager.findOneBy(WorkUnit,{id:data.workUnitId});
    if(!workUnit) throw new Error("INCORRECT_DATA");
    const hazard = await AppDataSource.manager.findOneBy(Hazard,{id:data.hazard.id});
    if(!hazard) throw new Error("INCORRECT_DATA");
    const { organizationId } = getContext();
    const assessment = new HazardAssessment();
    assessment.rowFactors = [];
    assessment.workUnit = workUnit;
    assessment.hazard = hazard;
    assessment.organizationId = organizationId;

    return await AppDataSource.manager.save(assessment);
}

const findById = async (id:number):Promise<IHazardAssessmentDto> => {
    if(!id) throw new Error("INCORRECT_DATA");
    const { organizationId } = getContext();
    const assessment =  await AppDataSource.getRepository(HazardAssessment)
        .createQueryBuilder("assessment")
        .leftJoinAndSelect("assessment.hazard", "hazard")
        .leftJoinAndMapMany("assessment.rowFactors", "assessment.rowFactors", "rowFactors")
        .leftJoinAndSelect("rowFactors.factor", "factor")
        .where("assessment.id = :id", {id})
        .andWhere("assessment.organizationId = :organizationId", {organizationId: organizationId})
        .getOne();

    if(!assessment) throw new Error("INCORRECT_DATA");
    return HazardAssessmentMapper.toDto(assessment);
}

export {
    createHazardAssessment,
    findById,
}