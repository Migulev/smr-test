'use client';

import { AddAndEditTableRow, DisplayTableRow } from '@/components/table-row';
import { getAllSmrRows } from '@/crud/smr';
import { SmrRowType } from '@/crud/smr.types';
import {
  addRowToData,
  deleteRowInData,
  flattenArrayAndPrepare,
  generateNewUiRow,
} from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './page.module.scss';
import { Mode, UiSmrRowType } from './page.types';

//TODO: resolve Errors and reload page

export default function Home() {
  const [data, setData] = useState<SmrRowType[]>([]);
  const [uiSmrRowList, setUiSmrRowList] = useState<UiSmrRowType[]>([]);
  const [idInEdit, setIdInEdit] = useState<string | number | null>(null);
  const [mode, setMode] = useState<Mode>(Mode.Viewing);

  // fetch data //
  useEffect(() => {
    async function getUiSmrRowList() {
      try {
        const data: SmrRowType[] = await getAllSmrRows();
        setData(data);
      } catch (error) {
        console.error('Failed to fetch rows:', error);
      }
    }
    getUiSmrRowList();
  }, []);

  //prepare data to display //
  useEffect(() => {
    const uiData = flattenArrayAndPrepare(data);

    setUiSmrRowList(uiData);
  }, [data]);

  //----------------//
  const handleEscape = useCallback(() => {
    switch (mode) {
      case Mode.Adding:
        const newData = deleteRowInData(data, idInEdit);
        setData(newData);
        setIdInEdit(null);
        setMode(Mode.Viewing);
        break;

      case Mode.Editing:
        setIdInEdit(null);
        setMode(Mode.Viewing);
        break;

      default:
        break;
    }
  }, [data, idInEdit, mode]);

  //----------------//
  const handleAddNewRowForm = useCallback(
    (id: string | number | null = null) => {
      if (mode === Mode.Viewing) {
        const newRow: SmrRowType = generateNewUiRow();

        const newData = [...data];
        const success = addRowToData(newData, id, newRow);

        if (success) {
          setData(newData);
          setMode(Mode.Adding);
        } else {
          alert('не получилось добавить ряд');
        }
      }
    },
    [mode, data]
  );

  //----------------//
  const handleEnter = useCallback(() => {
    if (mode === Mode.Viewing) handleAddNewRowForm();
  }, [mode, handleAddNewRowForm]);

  // handle event listeners for KeyDown functions //
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleEscape();
      } else if (event.key === 'Enter') {
        handleEnter();
      }
    },
    [handleEscape, handleEnter]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  //----------------//
  function handleEditRowForm(id: string | number | null) {
    if (mode === Mode.Viewing) {
      setIdInEdit(id);
      setMode(Mode.Editing);
    }
  }

  return (
    <main className={styles.home}>
      <div className={styles.header}>
        <div className={styles.tag}>Строительно-монтажные работы</div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Уровень</th>
              <th>Наименование работ</th>
              <th>Основная з/п</th>
              <th>Оборудование</th>
              <th>Накладные расходы</th>
              <th>Сметная прибыль</th>
            </tr>
          </thead>
          <tbody>
            {uiSmrRowList.map((row) => {
              if (idInEdit === row.id) {
                return (
                  <AddAndEditTableRow
                    key={uuidv4()}
                    mode={mode}
                    setMode={setMode}
                    setIdInEdit={setIdInEdit}
                    data={data}
                    setData={setData}
                    {...row}
                  />
                );
              }
              return (
                <DisplayTableRow
                  key={row.id}
                  handleDoubleClick={() => handleEditRowForm(row.id)}
                  handleClick={() => handleAddNewRowForm(row.id)}
                  data={data}
                  setData={setData}
                  {...row}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
