export async function getAllSmrRowsAPI() {
  try {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/outlay-rows/entity/${process.env.NEXT_PUBLIC_API_eID}/row/list`
    ).then((d) => d.json());

    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function createRowAPI({
  rowName,
  salary,
  equipmentCosts,
  overheads,
  estimatedProfit,
  parentId,
}: {
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  parentId: number | null;
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/outlay-rows/entity/${process.env.NEXT_PUBLIC_API_eID}/row/create`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentCosts,
          estimatedProfit,
          machineOperatorSalary: 0,
          mainCosts: 0,
          materials: 0,
          mimExploitation: 0,
          overheads,
          parentId,
          rowName,
          salary,
          supportCosts: 0,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Server responded with an error!');
    }
  } catch (e) {
    console.log(e);
    throw new Error('Server responded with an error!');
  }
}

export async function updateRowAPI({
  rowName,
  salary,
  equipmentCosts,
  overheads,
  estimatedProfit,
  parentId,
  rowID,
}: {
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  parentId: number | null;
  rowID: string | number;
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/outlay-rows/entity/${process.env.NEXT_PUBLIC_API_eID}/row/${rowID}/update`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentCosts,
          estimatedProfit,
          machineOperatorSalary: 0,
          mainCosts: 0,
          materials: 0,
          mimExploitation: 0,
          overheads,
          parentId,
          rowName,
          salary,
          supportCosts: 0,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Server responded with an error!');
    }
  } catch (e) {
    console.log(e);
    throw new Error('Server responded with an error!');
  }
}

export async function deleteRowAPI(rowID: string | number | null) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/outlay-rows/entity/${process.env.NEXT_PUBLIC_API_eID}/row/${rowID}/delete`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Server responded with an error!');
    }

    return true;
  } catch (e) {
    console.log(e);
    throw new Error('Server responded with an error!');
  }
}
