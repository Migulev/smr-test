import { Mode } from '@/app/page.types';
import { createRow, updateRow } from '@/crud/smr';
import { SmrRowType } from '@/crud/smr.types';
import { updateRowInData } from '@/lib/utils';
import { SmrRowSchema } from '@/lib/zod';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { z } from 'zod';

type ValueType = z.infer<typeof SmrRowSchema>;

type Props = {
  id: number | string | null;
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  parentId: number | null;
  data: SmrRowType[];
  setData: Dispatch<SetStateAction<SmrRowType[]>>;
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
  setIdInEdit: Dispatch<SetStateAction<string | number | null>>;
  foldersView: any;
  onCreated: (id: any) => void; // `TODO: reload item state'
};

//****************//
function AddAndEditTableRow(props: Props) {
  const refInput = useRef<HTMLInputElement>(null);
  const [rowValue, setRowValue] = useState<ValueType>({
    rowName: props.rowName,
    salary: props.salary,
    equipmentCosts: props.equipmentCosts,
    overheads: props.overheads,
    estimatedProfit: props.estimatedProfit,
  });

  //----------------//
  useEffect(() => {
    refInput.current?.focus();
  }, []);

  //----------------//
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      if (props.mode === Mode.Editing || Mode.Adding) {
        SubmitRow();
      }
    }
  }

  //----------------//
  async function SubmitRow() {
    const validation = SmrRowSchema.safeParse(rowValue);

    if (validation.success) {
      if (props.id) {
        await updateRow({
          ...rowValue,
          parentId: props.parentId,
          rowID: props.id,
        });
      } else {
        try {
          await createRow({ ...rowValue, parentId: props.parentId });
        } catch {
          alert('Произошла ошибка! Изменения не сохранены');
          window.location.reload();
        }
      }

      const newData = updateRowInData(props.data, props.id, { ...rowValue });
      props.setData(newData);
      props.setIdInEdit(null);
      props.setMode(Mode.Viewing);
    } else {
      alert('форма не заполнена');
    }
  }

  return (
    <tr onKeyDown={handleKeyDown}>
      <td>{props.foldersView}</td>
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
