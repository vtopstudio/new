import Link from 'next/link';
import { Shell } from '@/components/ui';
export default function PaymentFail() { return <Shell title="Оплата не завершена"><div className="card"><p>Платёж был отменён или не прошёл. Вы можете повторить оплату из карточки заказа.</p><Link className="btn mt-5" href="/dashboard/orders">Вернуться к заказам</Link></div></Shell>; }
