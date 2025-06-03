import { FC, useEffect, useState } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders = useSelector((state) => state.feed.feeds);
  let readyOrders: Array<number> = getOrders(orders, 'done');
  let pendingOrders: Array<number> = getOrders(orders, 'pending');
  // const [readyOrders, setReadyOrders] = useState<number[]>([]);
  // const [pendingOrders, setPendingOrders] = useState<number[]>([]);
  const total = useSelector((state) => state.feed.total);
  const totalToday = useSelector((state) => state.feed.totalToday);

  useEffect(() => {
    // readyOrders = getOrders(orders, 'done');
    // pendingOrders = getOrders(orders, 'pending');
  }, [orders]);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
