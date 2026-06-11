import Link from 'next/link';
import { Shell } from '@/components/ui';
export default function PaymentSuccess() { return <Shell title="Оплата отправлена"><div className="card"><p>ЮKassa вернула вас в сервис. Статус заказа обновится после webhook или ручной проверки оператором.</p><Link className="btn mt-5" href="/dashboard/orders">Перейти к заказам</Link></div></Shell>; }
