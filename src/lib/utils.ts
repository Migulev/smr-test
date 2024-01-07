import { SmrRowAPIRequest } from '@/services/smr.types';
import { Id } from '@/app/page.types';

export function generateNewRow(): SmrRowAPIRequest {
  return {
    child: [],
    equipmentCosts: 0,
    estimatedProfit: 0,
    id: null,
    machineOperatorSalary: 0,
    mainCosts: 0,
    materials: 0,
    mimExploitation: 0,
    overheads: 0,
    rowName: '',
    salary: 0,
    supportCosts: 0,
    total: 0,
  };
}

export type UiSmrRow = SmrRowAPIRequest & {
  parentId: number | null;
  level: number;
  states: boolean[];
  hasChildren: boolean;
};

export function flattenArrayAndPrepare(
  objects: SmrRowAPIRequest[],
  parentId: Id = null
): UiSmrRow[] {
  let result: UiSmrRow[] = [];

  function recurse(
    objectsArray: SmrRowAPIRequest[],
    parentId: Id,
    level: number,
    states: boolean[]
  ) {
    objectsArray.forEach((obj: SmrRowAPIRequest, index: number) => {
      const isNotLastElement = index < objectsArray.length - 1;
      let newStates = level === 1 ? [] : [...states, isNotLastElement];

      result.push({
        ...obj,
        parentId,
        level,
        states: newStates,
        hasChildren: Array.isArray(obj.child) && obj.child.length > 0,
      });

      if (Array.isArray(obj.child)) {
        recurse(obj.child, obj.id, level + 1, newStates);
      }
    });
  }

  recurse(objects, parentId, 1, []);
  return result;
}

export function addRowToData(
  data: SmrRowAPIRequest[],
  parentId: Id,
  newRow: SmrRowAPIRequest
): boolean {
  if (parentId === null) {
    data.push(newRow);
    return true;
  }

  for (const obj of data) {
    if (obj.id === parentId) {
      obj.child.push(newRow);
      return true;
    }

    if (addRowToData(obj.child, parentId, newRow)) {
      return true;
    }
  }

  return false;
}

export const deleteRowInData = (
  data: SmrRowAPIRequest[],
  id: Id
): SmrRowAPIRequest[] => {
  return data.filter((obj) => {
    if (obj.id === id) {
      return false;
    }
    if (obj.child && obj.child.length > 0) {
      obj.child = deleteRowInData(obj.child, id);
    }

    return true;
  });
};

export const updateRowInData = (
  data: SmrRowAPIRequest[],
  id: Id,
  updates: Partial<SmrRowAPIRequest>
): SmrRowAPIRequest[] => {
  return data.map((obj) => {
    if (obj.id === id || obj.id === null) {
      return { ...obj, id, ...updates };
    } else if (obj.child) {
      return { ...obj, child: updateRowInData(obj.child, id, updates) };
    }
    return obj;
  });
};

export const updateIdInData = (
  data: SmrRowAPIRequest[],
  id: Id,
  newId: Id
): SmrRowAPIRequest[] => {
  return data.map((obj) => {
    if (obj.id === id) {
      return { ...obj, id: newId };
    } else if (obj.child) {
      return { ...obj, child: updateIdInData(obj.child, id, newId) };
    }
    return obj;
  });
};
