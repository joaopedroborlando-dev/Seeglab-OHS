import { Request, Response } from 'express';
import { signToken } from '../../../auth/jwt';
import { AppDataSource } from '../../../database/dataSource';
import User from '../../../database/entity/User';
import Organization from '../../../database/entity/Organization';

export const signUp = async (req: Request, res: Response): Promise<any> => {
    const { email, password, phone, document } = req.body;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        if (!email || !password) throw new Error('MISSING_EMAIL_OR_PASSWORD');

        const userRepository = queryRunner.manager.getRepository(User);
        const organizationRepository = queryRunner.manager.getRepository(Organization);

        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            throw new Error('USER_ALREADY_EXISTS');
        }

        let organization = await organizationRepository.findOneBy({ organizationId: document });
        if (!organization) {
            organization = new Organization();
            organization.organizationId = document;
            organization.name = '';
            organization = await organizationRepository.save(organization);
        }

        const user = new User();
        user.email = email;
        user.password = password;
        user.phone = phone;
        user.organization = organization;
        await userRepository.save(user);

        await queryRunner.commitTransaction();

        const token = signToken({ userId: user.id, organizationId: organization.organizationId });
        res.status(201).json({ token, organization: organization.organizationId, userId: user.id });

    } catch (e: any) {
        await queryRunner.rollbackTransaction();
        return res.status(422).send(e.message);
    } finally {
        await queryRunner.release();
    }
}

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new Error('MISSING_EMAIL_OR_PASSWORD');

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { email },
            relations: ['organization']
        });

        if (!user) throw new Error('INVALID_CREDENTIALS');

        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new Error('INVALID_CREDENTIALS');

        if (!user.organization?.organizationId) throw new Error('INVALID_CREDENTIALS');

        const token = signToken({ userId: user.id, organizationId: user.organization.organizationId });
        res.json({ userId: user.id, token, organization: user.organization.organizationId });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
}
