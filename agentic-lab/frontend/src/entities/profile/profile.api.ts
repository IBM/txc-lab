import { queryOptions } from '@tanstack/react-query';
import { getProfileByUsername } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { transformProfileDtoToProfile } from './profile.lib';
import { Profile } from './profile.types';

export const profileQueryOptions = (username: string) =>
  queryOptions({
    queryKey: ['profile', username],

    queryFn: async ({ signal }) => {
      const { data } = await getProfileByUsername(username, { signal });
      const profile = transformProfileDtoToProfile(data);
      return profile;
    },

    initialData: () => queryClient.getQueryData<Profile>(['profile', username]),

    initialDataUpdatedAt: () => queryClient.getQueryState(['profile', username])?.dataUpdatedAt,
  });
