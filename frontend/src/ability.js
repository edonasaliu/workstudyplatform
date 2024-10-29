import { AbilityBuilder, createMongoAbility } from '@casl/ability';

export function defineAbilityFor(user) {
  const { can, build } = new AbilityBuilder(createMongoAbility);
  
  if (user.role === 'student') {
    can('read', 'student-dashboard');
  }
  if (user.role === 'manager') {
    can('read', 'employer-dashboard');
  }
  if (user.role === 'admin') {
    can('read', 'admin-dashboard'); 
    can('manage', 'all'); 
  }

  return build();
}
