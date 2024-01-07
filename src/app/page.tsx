'use client';

import {
  AddAndEditTableRow,
  DisplayTableRow,
  FolderCell,
} from '@/components/table-row';
import { RowValuesType } from '@/components/table-row/AddAndEditTableRow';
import useDeleteRowMutation from '@/hooks/useDeleteRowMutation';
import {
  UiSmrRow,
  addRowToData,
  deleteRowInData,
  flattenArrayAndPrepare,
  generateNewRow,
  updateIdInData,
  updateRowInData,
} from '@/lib/utils';
import { createRowAPI, fetchAllRowsAPI, updateRowAPI } from '@/services/smr';
import { SmrRowAPIRequest } from '@/services/smr.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './page.module.scss';
import { Id, Mode } from './page.types';
import useCreateRowMutation from '@/hooks/useCreateRowMutation';
import useUpdateRowMutation from '@/hooks/useUpdateRowMutation';

//TODO: resolve Errors and reload page
//TODO: if id === null it needs to await response with an id and then change it
//TODO: display EDIT FORM while no data
//TODO: types check | dispatch, any
//TODO: Vercel https error
//TODO: toaster for alerts (chakra)
//TODO: hooks for TanStack

export default function Home() {
  const [data, setData] = useState<SmrRowAPIRequest[]>([]);
  const [idInEditState, setIdInEditState] = useState<Id>(null);
  const [mode, setMode] = useState<Mode>(Mode.Viewing);
  const [idInMutation, setIdInMutation] = useState<Id>(null);

  const isModeAddOrEdit = mode === Mode.Adding || Mode.Editing;
  const isIconsHoverEffectOn = mode === Mode.Viewing;
  const isPending = mode === Mode.Pending;

  // fetch data from API //
  const { isError } = useQuery({
    queryKey: ['smr-rows'],
    queryFn: async () => {
      const dataAPI: SmrRowAPIRequest[] = await fetchAllRowsAPI();
      setData(dataAPI);
      return dataAPI;
    },
  });

  if (isError) alert('failed to fetch data');

  //prepare data to display //
  const uiSmrRowList: UiSmrRow[] = useMemo(() => {
    return flattenArrayAndPrepare(data, null);
  }, [data]);

  //----------------//
  const handleAddNewRowForm = useCallback(
    (id: Id = null) => {
      if (mode === Mode.Viewing) {
        const newRow: SmrRowAPIRequest = generateNewRow();
        const newData = [...data];
        addRowToData(newData, id, newRow);
        setData(newData);
        setMode(Mode.Adding);
      }
    },
    [mode, data]
  );

  //----------------//
  function handleEditRowForm(id: Id) {
    if (mode === Mode.Viewing) {
      setIdInEditState(id);
      setMode(Mode.Editing);
    }
  }

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
    }
  }, [data, idInEditState, mode]);

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

  const createRowMutation = useCreateRowMutation(
    data,
    idInEditState,
    idInMutation,
    setData,
    setMode,
    setIdInEditState,
    setIdInMutation
  );

  const updateRowMutation = useUpdateRowMutation(
    data,
    setData,
    setMode,
    setIdInEditState,
    setIdInMutation
  );

  //----------------//
  async function handleCreateOrUpdateRow(
    rowValues: RowValuesType,
    rowId: Id,
    parentId: Id
  ) {
    if (!isModeAddOrEdit) return;

    const isNewRow = rowId === null;
    if (isNewRow) {
      createRowMutation.mutate({ ...rowValues, parentId });
    } else {
      updateRowMutation.mutate({
        ...rowValues,
        parentId,
        rowId,
      });
    }
  }

  //----------------//
  const deleteRowMutation = useDeleteRowMutation(data, setData, setMode);

  async function handleDeleteRow(rowId: Id) {
    if (mode === Mode.Viewing) {
      deleteRowMutation.mutate(rowId);
    }
  }

  return (
    <main className={styles.home}>
      <div className={styles.header}>
        <div className={styles.tag}>Строительно-монтажные работы</div>
      </div>
      <div className={`${styles.tableWrapper} ${isPending && 'pending'}`}>
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
                  isHoverEffectOn={isIconsHoverEffectOn}
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
                  onCreated={(rowValues: RowValuesType) =>
                    handleCreateOrUpdateRow(rowValues, row.id, row.parentId)
                  }
                  //
                  folderCellView={folderCellView}
                  equipmentCosts={row.equipmentCosts}
                  estimatedProfit={row.estimatedProfit}
                  overheads={row.overheads}
                  rowName={row.rowName}
                  salary={row.salary}
                />
              ) : (
                <DisplayTableRow
                  key={row.id ?? uuidv4()}
                  onEdit={() => handleEditRowForm(row.id)}
                  //
                  folderCellView={folderCellView}
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
