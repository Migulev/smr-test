import { Icons } from '@/components/Icons';
import { v4 as uuidv4 } from 'uuid';
import styles from './TableRow.module.scss';

function FolderCell({
  level,
  states,
  hasChildren,
  onAdd,
  onDelete,
  isHoverEffect,
}: {
  level: number;
  states: boolean[];
  hasChildren: boolean;
  isHoverEffect: boolean;
  onAdd: () => void;
  onDelete: () => void;
}) {
  const columns = [];

  for (let i = 0; i < level; i++) {
    const grandParent = i === 0;

    if (i === level - 1) {
      columns.push(
        <div
          key={uuidv4()}
          className={`${styles.folderColumn} ${
            isHoverEffect && styles.hoverEffect
          }`}>
          <span className={`${styles.leftLine} ${grandParent && 'hidden'}`} />
          <span className={`${styles.downLine} ${hasChildren || 'hidden'}`} />
          <div className={styles.iconsContainer}>
            <div className={styles.icon} onClick={onAdd}>
              <Icons.folderIcon />
            </div>
            <div className={styles.icon} onClick={onDelete}>
              <Icons.trashIcon />
            </div>
          </div>
        </div>
      );
    } else {
      const parentHasChildren = states[i];
      const lastFolder = i === level - 2;

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
