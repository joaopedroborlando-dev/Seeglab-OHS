import { AppDataSource } from "../../../database/dataSource";
import Factor from "../../../database/entity/Factor";
import IFactorDto from "../dto/IFactorDto";
import Hazard from "../../../database/entity/Hazard";
import {PaginationOptions} from "../../../infra/dto/PaginationDto";
import {getManyPaginated, IPaginationResponse} from "../../../util/paginationHelper";
import FactorMapper from "../mapper/FactorMapper";
import {getContext} from "../../../context/requestContext";

const createFactor = async (dto: IFactorDto): Promise<Factor> => {
    const factor = new Factor();
    const hazard = await AppDataSource.manager.findOneBy(Hazard, {id: dto.hazardId});
    const {organizationId} = getContext();
    if (!hazard) throw new Error("BAD_SOURCE");
    factor.description = dto.description;
    factor.hazard = hazard;
    factor.organizationId = organizationId;

    return await AppDataSource.manager.save(factor);
}

const updateFactor = async (dto: IFactorDto): Promise<Factor> => {
    if (!dto.id || !dto.description) throw new Error("INCORRECT_IR_OR_DEPARTMENT");
    const factor = await AppDataSource.manager.findOneBy(Factor, {
        id: dto.id,
    });
    if (!factor) throw new Error("FACTOR_NOT_FOUND");
    factor.description = dto.description;
    return await AppDataSource.manager.save(factor);
}

const findAllFactorsByHazardId = async (
    paginationOptions: PaginationOptions,
    hazardId: number,
): Promise< IPaginationResponse<IFactorDto>> => {
    const {organizationId} = getContext();
    const queryBuilder = AppDataSource.getRepository(Factor)
        .createQueryBuilder("factor")
         .leftJoinAndSelect("factor.hazard", "hazard")
        .where("hazard.id = :hazardId", {hazardId})
        .andWhere("factor.organizationId= :organizationId", {organizationId})
    if (paginationOptions.search) {
        queryBuilder.andWhere("factor.description LIKE :search", {
            search: `%${paginationOptions.search}%`
        });
    }
    queryBuilder.addOrderBy("factor.description","ASC");
    const results = await getManyPaginated(
        paginationOptions,
        queryBuilder
    )
    return {
        meta: results.meta,
        data: FactorMapper.toDtoList(results.data)
    };
}

export {
    createFactor,
    updateFactor,
    findAllFactorsByHazardId,
}
