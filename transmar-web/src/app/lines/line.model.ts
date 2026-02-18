export interface AssemblyLine {
  alassLineId: number;
  productId: number;
  name: string;
  status: number; // 1 Active, 2 Locked, 3 Closed
}
