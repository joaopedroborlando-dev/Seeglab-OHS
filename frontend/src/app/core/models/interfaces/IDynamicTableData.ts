export default interface IDynamicTableData {
  header: string[];
  data: IRowData[];
}
interface IRowData {
  rowId: string;
  rowData: { key: string, value: string, ref: any }[];
}
