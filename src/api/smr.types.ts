export type SmrRowType = {
  child: SmrRowType[];
  equipmentCosts: number;
  estimatedProfit: number;
  id: string | number | null;
  machineOperatorSalary: number;
  mainCosts: number;
  materials: number;
  mimExploitation: number;
  overheads: number;
  rowName: string;
  salary: number;
  supportCosts: number;
  total: number;
};
