import React, { ReactNode } from 'react';
import { AppHeader } from '@components';
import styles from './PageLayout.module.css';
import { Outlet } from 'react-router-dom';

// interface ILayoutProps {
//   children?: ReactNode;
// }

export default function PageLayout(/*{ children }: ILayoutProps*/) {
  return (
    <div className={styles.app}>
      <AppHeader />
      <Outlet />
    </div>
  );
}
