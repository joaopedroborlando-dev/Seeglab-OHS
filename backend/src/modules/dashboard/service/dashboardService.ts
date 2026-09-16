import { AppDataSource } from "../../../database/dataSource";
import { getContext } from "../../../context/requestContext";
import { RowFactor } from "../../../database/entity/RowFactor";
import { EpiDeliveryItem, DeliveryItemStatusEnum } from "../../../database/entity/EpiDeliveryItem";
import HazardInventory from "../../../database/entity/HazardInventory";

export const getRowFactorScoreCounts = async () => {
    const { organizationId } = getContext();

    const latestInventory = await AppDataSource.getRepository(HazardInventory)
        .createQueryBuilder("inventory")
        .where("inventory.organizationId = :organizationId", { organizationId })
        .orderBy("inventory.createdAt", "DESC")
        .getOne();

    if (!latestInventory) {
        return { VERY_LOW: 0, LOW: 0, MODERATE: 0, HIGH: 0, VERY_HIGH: 0 };
    }

    // VERY_LOW = 1, LOW = 2, MODERATE = 3, HIGH = 4, VERY_HIGH = 5
    const rowFactors = await AppDataSource.getRepository(RowFactor)
        .createQueryBuilder("rf")
        .innerJoin("rf.hazardAssessment", "ha")
        .innerJoin("ha.workUnit", "wu")
        .where("wu.inventoryId = :inventoryId", { inventoryId: latestInventory.id })
        .select("rf.score", "score")
        .addSelect("COUNT(rf.id)", "count")
        .groupBy("rf.score")
        .getRawMany();

    const counts = {
        VERY_LOW: 0,
        LOW: 0,
        MODERATE: 0,
        HIGH: 0,
        VERY_HIGH: 0
    };

    const scoreMap: Record<number, keyof typeof counts> = {
        1: "VERY_LOW",
        2: "LOW",
        3: "MODERATE",
        4: "HIGH",
        5: "VERY_HIGH"
    };

    for (const row of rowFactors) {
        const scoreKey = scoreMap[row.score as number];
        if (scoreKey) {
            counts[scoreKey] = parseInt(row.count, 10);
        }
    }

    return counts;
};

export const getEpiDeliveryStats = async () => {
    const { organizationId } = getContext();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay();
    const daysUntilEndOfWeek = 6 - dayOfWeek;
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + daysUntilEndOfWeek);
    endOfWeek.setHours(23, 59, 59, 999);

    const todayStr = today.toISOString().split('T')[0];
    const endOfWeekStr = endOfWeek.toISOString().split('T')[0];

    const repo = AppDataSource.getRepository(EpiDeliveryItem);

    const expiredCount = await repo.createQueryBuilder("item")
        .where("item.organizationId = :organizationId", { organizationId })
        .andWhere("item.status = :status", { status: DeliveryItemStatusEnum.ACTIVE })
        .andWhere("item.expiresAt < :today", { today: todayStr })
        .getCount();

    const expiringThisWeekCount = await repo.createQueryBuilder("item")
        .where("item.organizationId = :organizationId", { organizationId })
        .andWhere("item.status = :status", { status: DeliveryItemStatusEnum.ACTIVE })
        .andWhere("item.expiresAt >= :today", { today: todayStr })
        .andWhere("item.expiresAt <= :endOfWeek", { endOfWeek: endOfWeekStr })
        .getCount();

    return {
        expired: expiredCount,
        expiringThisWeek: expiringThisWeekCount
    };
};
