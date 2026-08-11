import { getContext } from "../../../context/requestContext";
import { AppDataSource } from "../../../database/dataSource";
import { RowFactor } from "../../../database/entity/RowFactor";
import IControlMeasureDto from "../dto/IControlMeasureDto";
import { ControlMeasure } from "../../../database/entity/ControlMeasure";
import ControlMeasureMapper from "../mapper/ControlMeasureMapper";
import { IInsertControlMeasureDto } from "../dto/IInsertControlMeasureDto";
import { Epi } from "../../../database/entity/Epi";
import { ControlMeasureEpi } from "../../../database/entity/ControlMeasureEpi";

const createControlMeasure = async (data: IInsertControlMeasureDto): Promise<IControlMeasureDto | null> => {
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

    // Delete all EPIs relations
    if (data.id) {
        await AppDataSource.manager.delete(ControlMeasureEpi, { controlMeasure: { id: data.id } });
    }

    // Map EPIs
    if (data.epis && data.epis.length > 0) {
        const epiRepository = AppDataSource.getRepository(Epi);
        const epiEntities: ControlMeasureEpi[] = [];
        for (const epiId of data.epis) {
            const epi = await epiRepository.findOne({ where: { id: Number(epiId), organizationId } });
            if (epi) {
                epiEntities.push(AppDataSource.manager.create(ControlMeasureEpi, {
                    controlMeasure: controlMeasure,
                    epi: epi,
                    organizationId: organizationId,
                }));
            } else {
                throw new Error(`EPI with ID ${epiId} not found`);
            }
        }
        await AppDataSource.manager.save(epiEntities);
        controlMeasure.epis = epiEntities;
    }
    await AppDataSource.manager.save(controlMeasure);
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