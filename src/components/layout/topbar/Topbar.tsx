import { Icons } from '@/components/Icons';
import styles from './Topbar.module.scss';

function Topbar() {
  return (
    <header className={styles.topbar}>
      <button disabled>
        <Icons.apps />
      </button>
      <button disabled>
        <Icons.reply />
      </button>
      <button data-enabled>Просмотр</button>
      <button disabled>Управление</button>
    </header>
  );
}

export default Topbar;
