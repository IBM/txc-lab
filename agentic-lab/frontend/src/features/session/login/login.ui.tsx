import { TextInput, Button, Form, Stack, InlineNotification } from '@carbon/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { LoginUserSchema } from './login.contracts';
import { useLoginMutation } from './login.mutation';
import { LoginUser } from './login.types';

export default function LoginForm() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <BaseLoginForm />
    </ErrorBoundary>
  );
}

function BaseLoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<LoginUser>({
    mode: 'onTouched',
    resolver: zodResolver(LoginUserSchema),
    defaultValues: { email: '', password: '' },
  });

  const { mutate, isPending, isError, error } = useLoginMutation({
    onSuccess(session) {
      navigate(pathKeys.profile.byUsername(session.username));
    },
  });

  const mutationErrors = (() => {
    if (!error) return [];
    const data = error?.response?.data;
    if (Array.isArray(data)) return data;
    if (typeof data === 'object' && data && 'message' in data) return [(data as any).message];
    if (typeof data === 'string') return [data];
    return [error?.message || 'An error occurred'];
  })();
  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const onValid = (loginUser: LoginUser) => {
    mutate(loginUser);
  };

  return (
    <Stack gap={5}>
      {isError && (
        <InlineNotification
          kind="error"
          title="Login failed"
          subtitle={mutationErrors.join(', ')}
          data-test="login-error"
          hideCloseButton
        />
      )}

      <Form onSubmit={handleSubmit(onValid)}>
        <Stack gap={5}>
          <TextInput
            id="email"
            labelText="Email"
            placeholder="Email"
            type="text"
            size="lg"
            disabled={isPending}
            data-test="login-email"
            invalid={!!errors.email}
            invalidText={errors.email?.message}
            {...register('email')}
          />

          <TextInput
            id="password"
            labelText="Password"
            placeholder="Password"
            type="password"
            size="lg"
            disabled={isPending}
            data-test="login-password"
            invalid={!!errors.password}
            invalidText={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" disabled={!canSubmit} data-test="login-submit" size="lg">
            Sign in
          </Button>
        </Stack>
      </Form>
    </Stack>
  );
}
