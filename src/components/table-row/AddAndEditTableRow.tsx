import { SmrRowSchema } from '@/lib/zod';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

type Props = {
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  folderCellView: JSX.Element;
  onCreated: (data: RowValuesType) => void;
};

export type RowValuesType = z.infer<typeof SmrRowSchema>;

//****************//
function AddAndEditTableRow({
  rowName,
  salary,
  equipmentCosts,
  overheads,
  estimatedProfit,
  folderCellView,
  onCreated,
}: Props) {
  //----------------//
  const refInput = useRef<HTMLInputElement>(null);
  const [rowValues, setRowValues] = useState<RowValuesType>({
    rowName,
    salary,
    equipmentCosts,
    overheads,
    estimatedProfit,
  });

  //----------------//
  useEffect(() => {
    refInput.current?.focus();
  }, []);

  //----------------//
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      SubmitRow();
    }
  }

  //----------------//
  async function SubmitRow() {
    const validation = SmrRowSchema.safeParse(rowValues);

    if (validation.success) {
      onCreated({ ...rowValues });
    } else {
      alert('форма не заполнена');
    }
  }

  return (
    <tr onKeyDown={handleKeyDown}>
      <td>{folderCellView}</td>
      <td>
        <input
          ref={refInput}
          type="text"
          name="наименование работ"
          value={rowValues.rowName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setRowValues((prev) => ({
              ...prev,
              rowName: event.target.value,
            }))
          }
          required
        />
      </td>
      <td>
        <input
          type="text"
          name="основная з/п"
          value={rowValues.salary}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setRowValues((prev) => ({
              ...prev,
              salary: +event.target.value || 0,
            }))
          }
          required
        />
      </td>
      <td>
        <input
          type="text"
          name="оборудование"
          value={rowValues.equipmentCosts}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setRowValues((prev) => ({
              ...prev,
              equipmentCosts: +event.target.value || 0,
            }))
          }
          required
        />
      </td>
      <td>
        <input
          type="text"
          name="накладные расходы"
          value={rowValues.overheads}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setRowValues((prev) => ({
              ...prev,
              overheads: +event.target.value || 0,
            }))
          }
          required
        />
      </td>
      <td>
        <input
          type="text"
          name="сметная прибыль"
          value={rowValues.estimatedProfit}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setRowValues((prev) => ({
              ...prev,
              estimatedProfit: +event.target.value || 0,
            }))
          }
          required
        />
      </td>
    </tr>
  );
}

export default AddAndEditTableRow;
