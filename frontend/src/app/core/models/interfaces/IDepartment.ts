import IRole from './IRole';

export default interface IDepartment {
  id: number;
  description?: string;
  name: string;
  roles: IRole[] | null;
}
