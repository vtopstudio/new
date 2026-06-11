import { requireUser } from '@/lib/auth';
import { Shell } from '@/components/ui';
export default async function Profile() { const user = await requireUser(); return <Shell title="Профиль"><div className="card"><p>Email: {user.email}</p><p>Имя: {user.name}</p><p>Роль: {user.role}</p></div></Shell>; }
