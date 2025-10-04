import { Suspense } from 'react';
import { TextArea, Button, Form, Tile, InlineNotification } from '@carbon/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { Avatar } from '~shared/ui/avatar/avatar.ui';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { sessionQueryOptions } from '~entities/session/session.api';
import { CreateCommentSchema } from './create-comment.contracts';
import { useCreateCommentMutation } from './create-comment.mutation';
import { CreateCommentFormSkeleton } from './create-comment.skeleton';
import { CreateComment } from './create-comment.types';

type CreateCommentFormProps = {
  slug: string;
};

export function CreateCommentForm(props: CreateCommentFormProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<CreateCommentFormSkeleton />}>
        <BaseCreateCommentForm {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseCreateCommentForm(props: CreateCommentFormProps) {
  const { slug } = props;

  const { data: user } = useSuspenseQuery(sessionQueryOptions);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateComment>({
    mode: 'onChange',
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: { slug, body: '' },
  });

  const { mutate, isPending, isError, error } = useCreateCommentMutation({
    mutationKey: [slug],
    onSuccess: () => {
      setValue('body', '');
    },
  });

  const mutationErrors = error?.response?.data || [error?.message];
  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const onValid = (createComment: CreateComment) => {
    mutate(createComment);
  };

  return (
    <>
      {isError && (
        <InlineNotification
          kind="error"
          title="Error posting comment"
          subtitle={mutationErrors.join(', ')}
          hideCloseButton
        />
      )}

      <Tile>
        <Form onSubmit={handleSubmit(onValid)}>
          <TextArea
            id="comment-body"
            labelText=""
            placeholder="Write a comment..."
            rows={3}
            disabled={isPending}
            data-test="comment-input"
            invalid={!!errors.body}
            invalidText={errors.body?.message}
            {...register('body')}
          />
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', gap: '1rem' }}>
            <Avatar src={user.image} username={user.username} size="small" className="comment-author-img" />
            <Button type="submit" size="sm" disabled={!canSubmit} data-test="comment-submit">
              Post Comment
            </Button>
          </div>
        </Form>
      </Tile>
    </>
  );
}
