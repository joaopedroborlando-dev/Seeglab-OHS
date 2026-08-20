import IRoleDto from "./IRoleDto";

export default interface IEmployeeDto {
    id?: number;
    name?: string;
    birthDate?: Date | string;
    maritalStatus?: string;
    CPF?: string;
    PIS?: string;
    post?: string;
    roles?: IRoleDto[];
    roleIds?: number[];
}
