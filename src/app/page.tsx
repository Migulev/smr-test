'use client';

import {
  AddAndEditTableRow,
  DisplayTableRow,
  FolderCell,
} from '@/components/table-row';
import { deleteRowAPI, getAllSmrRowsAPI } from '@/api/smr';
import { SmrRowAPIRequest } from '@/api/smr.types';
import {
  addRowToData,
  deleteRowInData,
  flattenArrayAndPrepare,
  generateNewRow,
} from '@/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './page.module.scss';
import { Mode } from './page.types';

//TODO: on hover
//TODO: optimistic request
//TODO: resolve Errors and reload page
//TODO: if id === null it needs to await response with an id and then change it
//TODO: display EDIT FORM while no data
//TODO: types check | dispatch, any
//TODO: Vercel https error
//TODO: console errors

export default function Home() {
  const [data, setData] = useState<SmrRowAPIRequest[]>([]);
  const [idInEditState, setIdInEditState] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>(Mode.Viewing);

  // fetch data //
  useEffect(() => {
    async function getUiSmrRowList() {
      try {
        const data: SmrRowAPIRequest[] = await getAllSmrRowsAPI();
        setData(data);
      } catch (error) {
        console.error('Failed to fetch rows:', error);
      }
    }
    getUiSmrRowList();
  }, []);

  //prepare data to display //
  const uiSmrRowList = useMemo(() => {
    return flattenArrayAndPrepare(data, null);
  }, [data]);

  //----------------//
  const handleEscape = useCallback(() => {
    switch (mode) {
      case Mode.Adding:
        const newData = deleteRowInData(data, idInEditState);
        setData(newData);
        setIdInEditState(null);
        setMode(Mode.Viewing);
        break;

      case Mode.Editing:
        setIdInEditState(null);
        setMode(Mode.Viewing);
        break;

      default:
        break;
    }
  }, [data, idInEditState, mode]);

  //----------------//
  const handleAddNewRowForm = useCallback(
    (id: string | number | null = null) => {
      if (mode === Mode.Viewing) {
        const newRow: SmrRowAPIRequest = generateNewRow();

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

  //----------------//
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

  // handle event listeners for KeyDown functions //
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  //----------------//
  function handleEditRowForm(id: number | null) {
    if (mode === Mode.Viewing) {
      setIdInEditState(id);
      setMode(Mode.Editing);
    }
  }

  //----------------//
  async function handleDeleteRow(id: number | null) {
    try {
      const newData = deleteRowInData(data, id);
      setData(newData);
      await deleteRowAPI(id);
    } catch {
      alert('Произошла ошибка! Изменения не сохранены');
      window.location.reload();
    }
  }

  const isModeAddOrEdit = mode === Mode.Adding || Mode.Editing;
  const isIconsHoverEffect = mode === Mode.Viewing;

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
              let folderCellView = (
                <FolderCell
                  isHoverEffect={isIconsHoverEffect}
                  onAdd={() => handleAddNewRowForm(row.id)}
                  onDelete={() => handleDeleteRow(row.id)}
                  //
                  hasChildren={row.hasChildren}
                  level={row.level}
                  states={row.states}
                />
              );

              return idInEditState === row.id && isModeAddOrEdit ? (
                <AddAndEditTableRow
                  key={uuidv4()}
                  folderCellView={folderCellView}
                  setMode={setMode}
                  setIdInEditState={setIdInEditState}
                  data={data}
                  setData={setData}
                  onCreated={(id: any) => {}}
                  //
                  id={row.id}
                  equipmentCosts={row.equipmentCosts}
                  estimatedProfit={row.estimatedProfit}
                  overheads={row.overheads}
                  parentId={row.parentId}
                  rowName={row.rowName}
                  salary={row.salary}
                />
              ) : (
                <DisplayTableRow
                  key={row.id ?? uuidv4()}
                  folderCellView={folderCellView}
                  onEdit={() => handleEditRowForm(row.id)}
                  //
                  rowName={row.rowName}
                  equipmentCosts={row.equipmentCosts}
                  estimatedProfit={row.estimatedProfit}
                  overheads={row.overheads}
                  salary={row.salary}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
