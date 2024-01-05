import { SmrRowAPIRequest } from '@/api/smr.types';
import { v4 as uuidv4 } from 'uuid';

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

type UiSmrRow = SmrRowAPIRequest & {
  parentId: number | null;
  level: number;
  states: boolean[];
  hasChildren: boolean;
};

export function flattenArrayAndPrepare(
  objects: SmrRowAPIRequest[],
  parentId: number | null = null
): UiSmrRow[] {
  let result: UiSmrRow[] = [];

  function recurse(
    objectsArray: SmrRowAPIRequest[],
    parentId: number | null,
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
  parentId: string | number | null,
  newRow: SmrRowAPIRequest
): boolean {
  if (parentId === null) {
    data.push(newRow);
    return true;
  }

  for (const obj of data) {
    if (obj.id === parentId) {
      obj.child.push(newRow);
      return true; // Parent found and child added
    }

    // Recursively search in children
    if (addRowToData(obj.child, parentId, newRow)) {
      return true; // Parent was found in children
    }
  }

  return false; // Parent not found
}

export const deleteRowInData = (
  data: SmrRowAPIRequest[],
  id: number | null
): SmrRowAPIRequest[] => {
  return data.filter((obj) => {
    if (obj.id === id) {
      return false; // Do not include this item in the new array
    }

    // Recursively search in children if they exist
    if (obj.child && obj.child.length > 0) {
      obj.child = deleteRowInData(obj.child, id);
    }

    return true;
  });
};

export const updateRowInData = (
  data: SmrRowAPIRequest[],
  id: number | null,
  updates: Partial<SmrRowAPIRequest>
): SmrRowAPIRequest[] => {
  // Use map to create a new array
  return data.map((obj) => {
    if (obj.id === id) {
      // Check if id is null and generate a new UUID if needed
      const newId = id === null ? new Date().valueOf() : id;
      // Create a new object by applying the updates with the newId or existing id
      return { ...obj, id: newId, ...updates };
    } else if (obj.child) {
      // Recursively search and update in children and create a new object
      return { ...obj, child: updateRowInData(obj.child, id, updates) };
    }
    // Return the object as is if no updates were made
    return obj;
  });
};
