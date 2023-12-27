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
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './page.module.scss';

export type UiSmrRowType = SmrRowType & {
  parentId: number | null;
  level: number;
};

export enum Mode {
  Viewing,
  Adding,
  Editing,
}

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
    //TODO: remove
    console.log(uiData);

    setUiSmrRowList(uiData);
  }, [data]);

  // handle event listeners for KeyDown functions //
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleEscape();
      }

      if (event.key === 'Enter') {
        handleEnter();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleEscape, handleEnter]);

  //----------------//
  function handleEscape() {
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
  }

  //----------------//
  function handleEnter() {
    if (mode === Mode.Viewing) handleAddNewRowForm();
  }

  //----------------//
  function handleAddNewRowForm(id: string | number | null = null) {
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
  }

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
