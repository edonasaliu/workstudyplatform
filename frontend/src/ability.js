import { AbilityBuilder, createMongoAbility } from '@casl/ability';

export function defineAbilityFor(user) {
  const { can, build } = new AbilityBuilder(createMongoAbility);
  
  if (user.role === 'student') {
    can('read', 'student-dashboard');
  }
  if (user.role === 'manager') {
    can('read', 'employer-dashboard');
  }

  return build();
}