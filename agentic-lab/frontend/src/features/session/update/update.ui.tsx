import { Suspense } from 'react';
import { TextInput, TextArea, Button, Form, Stack, InlineNotification } from '@carbon/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { sessionQueryOptions } from '~entities/session/session.api';
import { UpdateUserSchema } from './update.contracts';
import { useUpdateSessionMutation } from './update.mutation';
import UpdateSessionFormSkeleton from './update.skeleton';
import { UpdateUser } from './update.types';

export default function UpdateSessionForm() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<UpdateSessionFormSkeleton />}>
        <BaseUpdateSessionForm />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseUpdateSessionForm() {
  const navigate = useNavigate();

  const { data: user } = useSuspenseQuery(sessionQueryOptions);
  const { username, email, bio, image } = user;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<UpdateUser>({
    mode: 'onTouched',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: { username, email, bio, image, password: '' },
  });

  const { mutate, isPending, isError, error } = useUpdateSessionMutation({
    onSuccess: (session) => {
      navigate(pathKeys.profile.byUsername(session.username), { replace: true });
    },
  });

  const mutationErrors = error?.response?.data || [error?.message];
  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const onValid = (updateUser: UpdateUser) => {
    mutate(updateUser);
  };

  return (
    <Stack gap={5}>
      {isError && (
        <InlineNotification kind="error" title="Update failed" subtitle={mutationErrors.join(', ')} hideCloseButton />
      )}

      <Form onSubmit={handleSubmit(onValid)} data-test="settings-form">
        <Stack gap={5}>
          <TextInput
            id="image"
            labelText="Profile Picture URL"
            placeholder="URL of profile picture"
            type="text"
            disabled={isPending}
            data-test="settings-image"
            invalid={!!errors.image}
            invalidText={errors.image?.message}
            {...register('image')}
          />
          <TextInput
            id="username"
            labelText="Username"
            placeholder="Your Name"
            type="text"
            size="lg"
            disabled={isPending}
            data-test="settings-username"
            invalid={!!errors.username}
            invalidText={errors.username?.message}
            {...register('username')}
          />
          <TextArea
            id="bio"
            labelText="Bio"
            rows={8}
            placeholder="Short bio about you"
            disabled={isPending}
            data-test="settings-bio"
            invalid={!!errors.bio}
            invalidText={errors.bio?.message}
            {...register('bio')}
          />
          <TextInput
            id="email"
            labelText="Email"
            placeholder="Email"
            type="text"
            size="lg"
            disabled={isPending}
            data-test="settings-email"
            invalid={!!errors.email}
            invalidText={errors.email?.message}
            {...register('email')}
          />
          <TextInput
            id="password"
            labelText="New Password"
            placeholder="Password"
            type="password"
            size="lg"
            disabled={isPending}
            data-test="settings-password"
            invalid={!!errors.password}
            invalidText={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" size="lg" disabled={!canSubmit} data-test="settings-submit">
            Update Settings
          </Button>
        </Stack>
      </Form>
    </Stack>
  );
}
