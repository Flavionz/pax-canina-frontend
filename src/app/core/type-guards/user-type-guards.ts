import { User } from '@models/user.model';
import { Owner } from '@models/owner.model';
import { Coach } from '@models/coach.model';
import { Admin } from '@models/admin.model';

// Type guard for Owner
export function isOwner(user: User | null | undefined): user is Owner {
  return !!user && user.role === 'OWNER';
}

// Type guard for Coach
export function isCoach(user: User | null | undefined): user is Coach {
  return !!user && user.role === 'COACH';
}

// Type guard for Admin
export function isAdmin(user: User | null | undefined): user is Admin {
  return !!user && user.role === 'ADMIN';
}
