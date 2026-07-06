import { AppDataSource } from "../../../database/dataSource";
import Hazard from "../../../database/entity/Hazard";
import IHazardDto from "../dto/IHazardDto";
import HazardMapper from "../../business/mapper/HazardMapper";

const createHazard = async (dto:IHazardDto):Promise<Hazard> => {
    const hazard = new Hazard();
    hazard.description = dto.description;
    return await AppDataSource.manager.save(hazard);
}

const updateHazard = async (dto:IHazardDto):Promise<Hazard> => {
    if(!dto.id || !dto.description) throw new Error("INCORRECT_ID_OR_DESCRIPTION");
    const hazard = await AppDataSource.manager.findOneBy(Hazard, {
        id: dto.id,
    })
    if(hazard == null || undefined) throw new Error("HAZARD_NOT_FOUND");
    hazard.description = dto.description;
    return await AppDataSource.manager.save(hazard);
}

const findAllHazards = async ():Promise<IHazardDto[]> => {
    const hazards = await AppDataSource.manager.find(Hazard);
    if(hazards == null || undefined) throw new Error("HAZARD_NOT_FOUND");
    return HazardMapper.toDtoList(hazards);
}

const findHazardById = async (id:number):Promise<Hazard | null> => {
    return await AppDataSource.manager.findOneBy(Hazard,{id:id});
}

export{
    createHazard,
    updateHazard,
    findAllHazards,
    findHazardById,
}