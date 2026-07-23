import { AppDataSource } from "../../../database/dataSource";

import Organization from "../../../database/entity/Organization";

const createOrganization = async (dto: any): Promise<void> => {
    const { organizationId, userId, name } = dto;
    let organization = await AppDataSource.getRepository(Organization)
        .createQueryBuilder("organization")
        .where("organization.id = :organizationId", { organizationId })
        .getOne();

    if (!organization) {
        organization = new Organization();
        organization.id = organizationId;
        organization.name = name ?? '';
        organization = await AppDataSource.manager.save(organization);
    }

    if (userId) {
        import("../../../database/entity/User").then(async ({ default: User }) => {
            const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
            if (user) {
                user.organization = organization!;
                await AppDataSource.manager.save(user);
            }
        });
    }
}

export {
    createOrganization,
};