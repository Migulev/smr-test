import { createRowAPI, updateRowAPI } from '@/api/smr';
import { SmrRowAPIRequest } from '@/api/smr.types';
import { Mode } from '@/app/page.types';
import { updateRowInData } from '@/lib/utils';
import { SmrRowSchema } from '@/lib/zod';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { z } from 'zod';

type ValueType = z.infer<typeof SmrRowSchema>;

//****************//
function AddAndEditTableRow({
  id,
  rowName,
  salary,
  equipmentCosts,
  overheads,
  estimatedProfit,
  parentId,
  data,
  setData,
  mode,
  setMode,
  setIdInEdit,
  folderCellView,
  onCreated,
}: {
  id: number | string | null;
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  parentId: number | null;
  data: SmrRowAPIRequest[];
  setData: (data: any) => void;
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
  setIdInEdit: Dispatch<SetStateAction<string | number | null>>;
  folderCellView: any;
  onCreated: (id: any) => void;
}) {
  const refInput = useRef<HTMLInputElement>(null);
  const [rowValue, setRowValue] = useState<ValueType>({
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
      if (mode === Mode.Editing || Mode.Adding) {
        SubmitRow();
      }
    }
  }

  //----------------//
  async function SubmitRow() {
    const validation = SmrRowSchema.safeParse(rowValue);

    if (validation.success) {
      if (id) {
        await updateRowAPI({
          ...rowValue,
          parentId: parentId,
          rowID: id,
        });
      } else {
        try {
          await createRowAPI({ ...rowValue, parentId: parentId });
        } catch {
          alert('Произошла ошибка! Изменения не сохранены');
          window.location.reload();
        }
      }

      const newData = updateRowInData(data, id, { ...rowValue });
      setData(newData);
      setIdInEdit(null);
      setMode(Mode.Viewing);
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
          value={rowValue.rowName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setRowValue((prev) => ({
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
          value={rowValue.salary}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setRowValue((prev) => ({
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
          value={rowValue.equipmentCosts}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setRowValue((prev) => ({
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
          value={rowValue.overheads}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setRowValue((prev) => ({
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
          value={rowValue.estimatedProfit}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setRowValue((prev) => ({
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
