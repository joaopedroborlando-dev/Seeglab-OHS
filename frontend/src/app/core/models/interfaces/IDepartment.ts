import IRole from './IRole';

export default interface IDepartment {
  id: number;
  description: string;
  roles: IRole[] | null;
}
