import { AppDataSource } from "../../../database/dataSource";
import { HazardAssessment } from "../../../database/entity/HazardAssessment";
import IRowFactorDto from "../dto/IRowFactorDto";
import Factor from "../../../database/entity/Factor";
import { MatrixEnum, RowFactor } from "../../../database/entity/RowFactor";
import RowFactorMapper from "../mapper/RowFactorMapper";
import { findHazardById } from "./hazardService";
import { getContext } from "../../../context/requestContext";

const riskScore = (probability: number, severity: number): MatrixEnum => {
    const score = probability * severity;
    if (score > 12) return MatrixEnum.VERY_HIGH;
    else if (score <= 12 && score >= 8) return MatrixEnum.HIGH;
    else if (score < 8 && score > 3) return MatrixEnum.MODERATE;
    else return MatrixEnum.LOW;
}

const createRowFactor = async (data: IRowFactorDto): Promise<IRowFactorDto | null> => {
    const { organizationId } = getContext();
    if (!data || !data.hazardAssessmentId) throw new Error("INCORRECT_DATA");
    const hazardAssessment = await AppDataSource.manager.findOneBy(HazardAssessment, { id: data.hazardAssessmentId });
    if (!hazardAssessment) throw new Error("INCORRECT_DATA");
    let factor: Factor | null;
    if (data.factor && !data.factor.id) {
        factor = new Factor();
        factor.description = data.factor.description;
        const hazard = await findHazardById(data.hazardId ?? -1);
        if (!hazard) throw new Error("INCORRECT_DATA");
        factor.hazard = hazard;
        factor.organizationId = organizationId;
        await AppDataSource.manager.save(Factor, factor);
    } else {
        factor = await AppDataSource.manager.findOneBy(Factor, { id: data.factor.id });
        if (!factor) throw new Error("INCORRECT_DATA");
        factor.description = data.factor.description;
        await AppDataSource.manager.save(Factor, factor);
    }

    const rowFactor = new RowFactor();
    if (data.id) {
        rowFactor.id = data.id;
    }
    rowFactor.factor = factor;
    rowFactor.hazardAssessment = hazardAssessment;
    rowFactor.exposureTime = data.exposureTime;
    rowFactor.harm = data.harm;
    rowFactor.intensity = data.intensity;
    rowFactor.probability = data.probability;
    rowFactor.severity = data.severity;
    rowFactor.technique = data.technique;
    rowFactor.score = riskScore(data.probability, data.severity);
    rowFactor.organizationId = organizationId;
    rowFactor.source = data.source;

    return RowFactorMapper.toDto(await AppDataSource.manager.save(RowFactor, rowFactor));
}

const deleteRowFactor = async (id: number): Promise<boolean> => {
    const { organizationId } = getContext();
    const deleted = await AppDataSource.manager.delete(RowFactor, { id, organizationId });
    if (deleted.affected && deleted.affected > 0) return true;
    return false;
}

export {
    createRowFactor,
    deleteRowFactor,
}