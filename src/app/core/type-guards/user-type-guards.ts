import { User } from '@models/user.model';
import { Owner } from '@models/owner.model';
import { Coach } from '@models/coach.model';
import { Admin } from '@models/admin.model';

function normalizeRole(u: any): string | undefined {
  const r = u?.role ?? u?.Role ?? u?.ROLE;
  return typeof r === 'string' ? r.toUpperCase() : undefined;
}

export function isCoach(user: User | null | undefined): user is Coach {
  if (!user) return false;
  const role = normalizeRole(user);
  return role === 'COACH' || Array.isArray((user as any).specializations);
}

export function isOwner(user: User | null | undefined): user is Owner {
  if (!user) return false;
  const role = normalizeRole(user);
  const u: any = user;
  return role === 'OWNER' || 'address' in u || 'city' in u || 'postalCode' in u || Array.isArray(u.dogs);
}

export function isAdmin(user: User | null | undefined): user is Admin {
  if (!user) return false;
  const role = normalizeRole(user);
  if (role) return role === 'ADMIN';
  const u: any = user;
  const looksCoach = Array.isArray(u?.specializations);
  const looksOwner = 'address' in u || 'city' in u || 'postalCode' in u || Array.isArray(u?.dogs);
  return !looksCoach && !looksOwner;
}
