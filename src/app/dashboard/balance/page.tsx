import { requireUser, getDbUser } from '@/lib/auth';
import { Shell } from '@/components/ui';
import { money } from '@/lib/format';
export default async function Balance() { await requireUser(); const user = await getDbUser(); return <Shell title="Баланс"><div className="card">Текущий баланс: <b>{money(user?.balance || 0)}</b><p className="mt-3 text-slate-300">В MVP пополнение баланса не реализовано; оплата идёт по заказам через ЮKassa.</p></div></Shell>; }
