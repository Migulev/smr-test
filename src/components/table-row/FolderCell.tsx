import { Icons } from '@/components/Icons';
import { v4 as uuidv4 } from 'uuid';
import styles from './TableRow.module.scss';

type Props = {
  level: number;
  states: boolean[];
  open: boolean;
  edit: boolean;
  hasChildren: boolean;
  onAdd: () => void;
  onDelete: () => void;
  onClose: () => void;
};

function FolderCell(props: Props) {
  const columns = [];

  for (let i = 0; i < props.level; i++) {
    const grandParent = i === 0;

    if (i === props.level - 1) {
      columns.push(
        <div key={uuidv4()} className={styles.folderColumn}>
          <span className={`${styles.leftLine} ${grandParent && 'hidden'}`} />
          <span
            className={`${styles.downLine} ${props.hasChildren || 'hidden'}`}
          />
          <div className={styles.iconsContainer}>
            <div className={styles.icon} onClick={props.onAdd}>
              <Icons.folderIcon />
            </div>
            <div className={styles.icon} onClick={props.onDelete}>
              <Icons.trashIcon />
            </div>
          </div>
        </div>
      );
    } else {
      const parentHasChildren = props.states[i];
      const lastFolder = i === props.level - 2;

      columns.push(
        <div key={uuidv4()} className={styles.linesColumn}>
          <div
            className={`${styles.columnLine} ${
              parentHasChildren || lastFolder || 'hidden'
            }`}
          />
          <div
            className={`${styles.columnLine} ${parentHasChildren || 'hidden'}`}
          />
        </div>
      );
    }
  }

  return <div className={styles.folderCell}>{columns}</div>;
}

export default FolderCell;
