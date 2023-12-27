import { SmrRowType } from '@/crud/smr.types';

export type UiSmrRowType = SmrRowType & {
  parentId: number | null;
  level: number;
};

export enum Mode {
  Viewing,
  Adding,
  Editing,
}
