import { Icons } from '@/components/Icons';
import styles from './Sidebar.module.scss';

const MENU_OPTIONS = [
  'По проекту',
  'Объекты',
  'Рд',
  'МТО',
  'СМР',
  'График',
  'Мим',
  'Рабочие',
  'Капвложения',
  'Бюджет',
  'Финансирование',
  'Панорамы',
  'Камеры',
  'Поручения',
  'Контрагенты',
];

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.selection}>
        <div>
          Название проекта <br /> <span>Аббревиатура</span>
        </div>
        <div>
          <Icons.arrowDown />
        </div>
      </div>
      <div className={styles.menu}>
        {MENU_OPTIONS.map((option) => (
          <div key={option} className={styles.option}>
            <Icons.projectIcon />
            <p>{option}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
