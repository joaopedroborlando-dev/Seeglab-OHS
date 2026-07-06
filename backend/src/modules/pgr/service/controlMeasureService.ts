import { getContext } from "../../../context/requestContext";
import { AppDataSource } from "../../../database/dataSource";
import { RowFactor } from "../../../database/entity/RowFactor";
import IControlMeasureDto from "../dto/IControlMeasureDto";
import { ControlMeasure } from "../../../database/entity/ControlMeasure";
import ControlMeasureMapper from "../mapper/ControlMeasureMapper";

const createControlMeasure = async (data: IControlMeasureDto): Promise<IControlMeasureDto | null> => {
    const { organizationId } = getContext();
    if (!data || !data.rowFactorId) throw new Error("INCORRECT_DATA");
    const rowFactor = await AppDataSource.manager.findOneBy(RowFactor, { id: data.rowFactorId });
    if (!rowFactor) throw new Error("INCORRECT_DATA");

    const controlMeasure = AppDataSource.manager.create(ControlMeasure, {
        administrativeMeasure: data.administrativeMeasure ?? "",
        epc: data.epc ?? "",
        organizationId: organizationId,
        ...(data.id && { id: data.id })
    });

    rowFactor.controlMeasure = controlMeasure;
    await AppDataSource.manager.save(rowFactor);
    return ControlMeasureMapper.toDto(controlMeasure);
}

const deleteControlMeasure = async (id: number): Promise<boolean> => {
    const { organizationId } = getContext();
    if (!id) throw new Error("INCORRECT_DATA");
    const deleteResult = await AppDataSource.manager.delete(ControlMeasure, { id, organizationId });
    return deleteResult.affected !== 0;
}

export {
    createControlMeasure,
    deleteControlMeasure,
}