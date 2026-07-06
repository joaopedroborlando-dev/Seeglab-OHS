"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signUp = void 0;
const jwt_1 = require("../../../auth/jwt");
const dataSource_1 = require("../../../database/dataSource");
const User_1 = __importDefault(require("../../../database/entity/User"));
const Organization_1 = __importDefault(require("../../../database/entity/Organization"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, phone, document } = req.body;
    const queryRunner = dataSource_1.AppDataSource.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        if (!email || !password)
            throw new Error('MISSING_EMAIL_OR_PASSWORD');
        const userRepository = queryRunner.manager.getRepository(User_1.default);
        const organizationRepository = queryRunner.manager.getRepository(Organization_1.default);
        const existingUser = yield userRepository.findOneBy({ email });
        if (existingUser) {
            throw new Error('USER_ALREADY_EXISTS');
        }
        let organization = yield organizationRepository.findOneBy({ organizationId: document });
        if (!organization) {
            organization = new Organization_1.default();
            organization.organizationId = document;
            organization.name = '';
            organization = yield organizationRepository.save(organization);
        }
        const user = new User_1.default();
        user.email = email;
        user.password = password;
        user.phone = phone;
        user.organization = organization;
        yield userRepository.save(user);
        yield queryRunner.commitTransaction();
        const token = (0, jwt_1.signToken)({ userId: user.id, organizationId: organization.organizationId });
        res.status(201).json({ token, organization: organization.organizationId, userId: user.id });
    }
    catch (e) {
        yield queryRunner.rollbackTransaction();
        return res.status(422).send(e.message);
    }
    finally {
        yield queryRunner.release();
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw new Error('MISSING_EMAIL_OR_PASSWORD');
        const userRepository = dataSource_1.AppDataSource.getRepository(User_1.default);
        const user = yield userRepository.findOne({
            where: { email },
            relations: ['organization']
        });
        if (!user)
            throw new Error('INVALID_CREDENTIALS');
        const isMatch = yield user.comparePassword(password);
        if (!isMatch)
            throw new Error('INVALID_CREDENTIALS');
        if (!((_a = user.organization) === null || _a === void 0 ? void 0 : _a.organizationId))
            throw new Error('INVALID_CREDENTIALS');
        const token = (0, jwt_1.signToken)({ userId: user.id, organizationId: user.organization.organizationId });
        res.json({ userId: user.id, token, organization: user.organization.organizationId });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
});
exports.login = login;
