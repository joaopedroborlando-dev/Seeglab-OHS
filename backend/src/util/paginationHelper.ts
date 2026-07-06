import {PaginationOptions} from "../infra/dto/PaginationDto";
import {ObjectLiteral, SelectQueryBuilder} from "typeorm";
export interface IPaginationResponse<T> {
    data: T[],
    meta:{
        page:number,
        limit:number,
        total:number,
        totalPages:number,
    }
}

const getManyPaginated = async <T extends ObjectLiteral>(
    paginationOptions: PaginationOptions,
    queryBuilder: SelectQueryBuilder<T>
): Promise<IPaginationResponse<T>> => {
    const page = Math.max(1, paginationOptions.page || 1);
    const limit = Math.max(1, Math.min(100, paginationOptions.limit || 10));
    const skip = (page - 1) * limit;

    const total = await queryBuilder.getCount();

    queryBuilder.skip(skip).take(limit);

    const resultArr = await queryBuilder.getMany();
    const totalPages = Math.ceil(total / limit);

    return {
        data: resultArr,
        meta: {
            page,
            limit,
            total,
            totalPages
        }
    };
}

export {
    getManyPaginated,
}
