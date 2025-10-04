import { TextInput, Button, Form, Stack, InlineNotification } from '@carbon/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { RegisterUserSchema } from './register.contracts';
import { useRegisterMutation } from './register.mutation';
import { RegisterUser } from './register.types';

export default function RegisterForm() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <BaseRegisterForm />
    </ErrorBoundary>
  );
}

function BaseRegisterForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<RegisterUser>({
    mode: 'onTouched',
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  const { mutate, isPending, isError, error } = useRegisterMutation({
    onSuccess(session) {
      navigate(pathKeys.profile.byUsername(session.username));
    },
  });

  const mutationErrors = error?.response?.data;
  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const getErrorMessage = () => {
    if (!mutationErrors) return error?.message || 'An error occurred';
    if (Array.isArray(mutationErrors)) return mutationErrors.join(', ');
    if (typeof mutationErrors === 'object') {
      return Object.entries(mutationErrors)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('; ');
    }
    return String(mutationErrors);
  };

  const onValid = (registerUser: RegisterUser) => {
    mutate(registerUser);
  };

  return (
    <Stack gap={5}>
      {isError && (
        <InlineNotification
          kind="error"
          title="Registration failed"
          subtitle={getErrorMessage()}
          data-test="register-error"
          hideCloseButton
        />
      )}

      <Form onSubmit={handleSubmit(onValid)}>
        <Stack gap={5}>
          <TextInput
            id="username"
            labelText="Username"
            placeholder="Your Name"
            type="text"
            size="lg"
            disabled={isPending}
            data-test="register-username"
            invalid={!!errors.username}
            invalidText={errors.username?.message}
            {...register('username')}
          />

          <TextInput
            id="email"
            labelText="Email"
            placeholder="Email"
            type="text"
            size="lg"
            disabled={isPending}
            data-test="register-email"
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
            data-test="register-password"
            invalid={!!errors.password}
            invalidText={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" disabled={!canSubmit} data-test="register-submit" size="lg">
            Sign up
          </Button>
        </Stack>
      </Form>
    </Stack>
  );
}
