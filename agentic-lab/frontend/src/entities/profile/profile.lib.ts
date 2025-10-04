import type { ProfileDto } from '~shared/api/api.types';
import type { Profile } from './profile.types';

export function transformProfileDtoToProfile(profileDto: ProfileDto): Profile {
  const { profile } = profileDto;

  return {
    ...profile,
    image: profile?.image || '',
    bio: profile?.bio || '',
  };
}
