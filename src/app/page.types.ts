import { SmrRowType } from '@/api/smr.types';

export type UiSmrRowType = SmrRowType & {
  parentId: number | null;
  level: number;
  states: any[];
  open: boolean;
};

export enum Mode {
  Viewing,
  Adding,
  Editing,
}
