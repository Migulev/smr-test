'use client';

import {
  AddAndEditTableRow,
  DisplayTableRow,
  FolderCell,
} from '@/components/table-row';
import { deleteRow, getAllSmrRows } from '@/crud/smr';
import { SmrRowType } from '@/crud/smr.types';
import {
  addRowToData,
  deleteRowInData,
  flattenArrayAndPrepare,
  generateNewUiRow,
} from '@/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './page.module.scss';
import { Mode } from './page.types';

//TODO: display EDIT FORM while no data
//TODO: resolve Errors and reload page
//TODO: if id === null it needs to await response with an id and then change it
//TODO: optimistic request
//TODO: Vercel https error
//TODO: screen size

export default function Home() {
  const [data, setData] = useState<SmrRowType[]>([]);
  const [foldersClosed, setFoldersClosed] = useState<any>({});
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
  const uiSmrRowList = useMemo(() => {
    // return flattenArrayAndPrepare(data, null);
    return flattenArrayAndPrepare(data, null, foldersClosed);
  }, [data, foldersClosed]);

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
  function handleEditRowForm(id: string | number | null) {
    if (mode === Mode.Viewing) {
      setIdInEdit(id);
      setMode(Mode.Editing);
    }
  }

  async function handleDeleteRow(id: any) {
    try {
      const newData = deleteRowInData(data, id);
      setData(newData);
      await deleteRow(id);
    } catch {
      alert('Произошла ошибка! Изменения не сохранены');
      window.location.reload();
    }
  }

  async function handleClose(id: any) {
    const newState = foldersClosed[id] ? !foldersClosed[id] : true;
    setFoldersClosed({ ...foldersClosed, [id]: newState });
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
              let folderView = (
                <FolderCell
                  {...row}
                  edit={idInEdit === row.id}
                  onAdd={() => handleAddNewRowForm(row.id)}
                  onDelete={() => handleDeleteRow(row.id)}
                  onClose={() => handleClose(row.id)}
                />
              );

              return idInEdit === row.id ? (
                <AddAndEditTableRow
                  key={uuidv4()}
                  mode={mode}
                  setMode={setMode}
                  setIdInEdit={setIdInEdit}
                  data={data}
                  setData={setData}
                  foldersView={folderView}
                  onCreated={(id: any) => {}}
                  {...row}
                />
              ) : (
                <DisplayTableRow
                  key={row.id ?? uuidv4()}
                  foldersView={folderView}
                  {...row}
                  onEdit={() => handleEditRowForm(row.id)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
