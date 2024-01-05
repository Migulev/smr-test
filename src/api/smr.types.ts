export type SmrRowAPIRequest = {
  child: SmrRowAPIRequest[];
  equipmentCosts: number;
  estimatedProfit: number;
  id: number | null;
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
