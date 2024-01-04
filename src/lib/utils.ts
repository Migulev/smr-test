import { SmrRowType } from '@/api/smr.types';
import { v4 as uuidv4 } from 'uuid';

export function generateNewUiRow(): SmrRowType {
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

export function flattenArrayAndPrepare(objects: any, parentId = null) {
  let result: any[] = [];

  function recurse(
    objectsArray: object[],
    parentId: number | string | null,
    level: number,
    states: boolean[]
  ) {
    objectsArray.forEach((obj: any, index: number) => {
      const isNotLastElement = index < objectsArray.length - 1;

      let newStates = level === 1 ? [] : [...states, isNotLastElement];

      result.push({
        ...obj,
        parentId,
        level,
        states: newStates,
        hasChildren: obj.child.length > 0,
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
  data: SmrRowType[],
  parentId: string | number | null,
  newRow: SmrRowType
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
  data: SmrRowType[],
  id: string | number | null
): SmrRowType[] => {
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
  data: SmrRowType[],
  id: number | string | null,
  updates: Partial<SmrRowType>
): SmrRowType[] => {
  // Use map to create a new array
  return data.map((obj) => {
    if (obj.id === id) {
      // Check if id is null and generate a new UUID if needed
      const newId = id === null ? uuidv4() : id;
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
