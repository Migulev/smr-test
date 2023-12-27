import { Icons } from '@/components/Icons';
import { deleteRow } from '@/crud/smr';
import { SmrRowType } from '@/crud/smr.types';
import { deleteRowInData } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import styles from './DisplayTableRow.module.scss';

type Props = {
  handleClick: () => void;
  handleDoubleClick: () => void;
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  id: string | number | null;
  level: number;
  data: SmrRowType[];
  setData: Dispatch<SetStateAction<SmrRowType[]>>;
};

//****************//
function DisplayTableRow(props: Props) {
  //----------------//
  async function handleDeleteRow() {
    try {
      const newData = deleteRowInData(props.data, props.id);
      props.setData(newData);
      await deleteRow(props.id);
    } catch {
      alert('Произошла ошибка! Изменения не сохранены');
      window.location.reload();
    }
  }

  return (
    <tr onDoubleClick={() => props.handleDoubleClick()}>
      <td className="flex align-center">
        <div
          className={styles.icons}
          style={{ marginLeft: `${props.level * 20}px` }}>
          <div
            className={`${styles.add} clickable`}
            onClick={() => props.handleClick()}>
            <Icons.levelIcon />
            <span aria-hidden="true" className={styles.addBG} />
            {props.level > 0 && (
              <>
                <span aria-hidden="true" className={styles.connLineLeft} />
                <span aria-hidden="true" className={styles.connLineUp} />
              </>
            )}
          </div>
          <div
            className={`${styles.trash} clickable`}
            onClick={handleDeleteRow}>
            <Icons.trashIcon />
          </div>
        </div>
      </td>
      <td>{props.rowName}</td>
      <td>{props.salary}</td>
      <td>{props.equipmentCosts}</td>
      <td>{props.overheads}</td>
      <td>{props.estimatedProfit}</td>
    </tr>
  );
}

export default DisplayTableRow;
