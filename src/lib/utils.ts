import { SmrRowType } from '@/crud/smr.types';
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

export function flattenArrayAndPrepare(
  objects: any,
  parentId = null,
  level = 0
) {
  // Array to accumulate the flattened objects
  let result: any[] = [];

  // Recursive function to handle the flattening
  function recurse(children: any[], parentId: any, level: number) {
    // Iterate over each child object
    children.forEach((child: any) => {
      //
      // Prepare for UI
      //
      result.push({
        ...child,
        // child: undefined, // Remove the children property
        parentId: parentId, // Add parentId property
        level: level, // Add level property
      });

      // If this child has its own children, recurse into them with incremented level and current child's id as parentId
      if (Array.isArray(child.child)) {
        recurse(child.child, child.id, level + 1);
      }
    });
  }

  // Start processing the initial array of objects
  recurse(objects, parentId, level);

  // Return the flat list of objects
  return result;
}

export function addRowToData(
  data: SmrRowType[],
  id: string | number | null,
  newRow: SmrRowType
): boolean {
  if (id === null) {
    data.push(newRow);
    return true;
  }

  for (const obj of data) {
    if (obj.id === id) {
      obj.child.push(newRow);
      return true; // Parent found and child added
    }

    // Recursively search in children
    if (addRowToData(obj.child, id, newRow)) {
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
