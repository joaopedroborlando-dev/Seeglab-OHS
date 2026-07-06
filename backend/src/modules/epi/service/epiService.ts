import { AppDataSource } from "../../../database/dataSource";
import { Epi } from "../../../database/entity/Epi";
import { PaginatedResponse, PaginationOptions } from "../../../infra/dto/PaginationDto";
import { getContext } from "../../../context/requestContext";
import IEpiDto from "../dto/IEpiDto";

const createEpi = async (dto: IEpiDto): Promise<Epi> => {
    const { organizationId } = getContext();
    const epi = new Epi();
    epi.name = dto.name;
    epi.caNumber = dto.caNumber ?? "";
    epi.caExpiration = dto.caExpiration ?? new Date();
    epi.manufacturer = dto.manufacturer ?? "";
    epi.organizationId = organizationId;
    return await AppDataSource.manager.save(epi);
}

const updateEpi = async (dto: IEpiDto): Promise<Epi> => {
    if (!dto.id) throw new Error("INCORRECT_DATA");
    const { organizationId } = getContext();
    const epi = await AppDataSource.manager.findOneBy(Epi, {
        id: dto.id,
        organizationId: organizationId,
    });
    if (!epi) throw new Error("EPI_NOT_FOUND");
    epi.name = dto.name;
    epi.caNumber = dto.caNumber ?? epi.caNumber;
    epi.caExpiration = dto.caExpiration ?? epi.caExpiration;
    epi.manufacturer = dto.manufacturer ?? epi.manufacturer;
    return await AppDataSource.manager.save(epi);
}

const findAllEpis = async (
    paginationOptions: PaginationOptions,
): Promise<PaginatedResponse<IEpiDto>> => {
    const { organizationId } = getContext();
    const page = Math.max(1, paginationOptions.page || 1);
    const limit = Math.max(1, Math.min(100, paginationOptions.limit || 10));
    const skip = (page - 1) * limit;
    const { filter } = paginationOptions;

    const queryBuilder = AppDataSource.getRepository(Epi)
        .createQueryBuilder("epi")
        .where("epi.organizationId = :organizationId", { organizationId });

    const { description, expirationStart, expirationEnd } = filter || {};
    if (description) {
        queryBuilder.andWhere("epi.name ILIKE :description", {
            description: `%${description}%`
        }).orWhere("epi.manufacturer ILIKE :description", {
            description: `%${description}%`
        });
    }
    if (expirationStart && expirationEnd) {
        const startDate = new Date(expirationStart);
        const endDate = new Date(expirationEnd);
        queryBuilder.andWhere("epi.caExpiration BETWEEN :startDate AND :endDate", {
            startDate,
            endDate
        });
    } else if (expirationStart) {
        const startDate = new Date(expirationStart);
        queryBuilder.andWhere("epi.caExpiration >= :startDate", {
            startDate
        });
    } else if (expirationEnd) {
        const endDate = new Date(expirationEnd);
        queryBuilder.andWhere("epi.caExpiration <= :endDate", {
            endDate
        });
    }

    queryBuilder.addOrderBy("epi.name", "ASC");

    const total = await queryBuilder.getCount();

    queryBuilder.skip(skip).take(limit);

    const rawResults = await queryBuilder.getMany();

    const epis: IEpiDto[] = rawResults.map(epi => ({
        id: epi.id,
        name: epi.name,
        caNumber: epi.caNumber,
        caExpiration: epi.caExpiration,
        manufacturer: epi.manufacturer,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
        data: epis,
        meta: {
            page,
            limit,
            total,
            totalPages
        }
    };
}

const deleteEpi = async (id: number): Promise<boolean> => {
    const { organizationId } = getContext();
    if (!id) throw new Error("INCORRECT_DATA");
    const deleteResult = await AppDataSource.manager.delete(Epi, { id, organizationId });
    return deleteResult.affected !== 0;
}

export {
    createEpi,
    updateEpi,
    findAllEpis,
    deleteEpi,
}
