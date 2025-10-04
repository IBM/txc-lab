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
import { articleQueryOptions } from '~entities/article/article.api';
import { UpdateArticleSchema } from './update-article.contract';
import { transformArticleToUpdateArticle } from './update-article.lib';
import { useUpdateArticleMutation } from './update-article.mutation';
import { UpdateArticleSkeleton } from './update-article.skeleton';
import { UpdateArticle } from './update-article.types';

type UpdateArticleFormProps = {
  slug: string;
};

export function UpdateArticleForm(props: UpdateArticleFormProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<UpdateArticleSkeleton />}>
        <BaseUpdateArticleForm {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseUpdateArticleForm(props: UpdateArticleFormProps) {
  const { slug } = props;

  const navigate = useNavigate();

  const { data: article } = useSuspenseQuery(articleQueryOptions(slug));

  const { mutate, isPending, isError, error } = useUpdateArticleMutation({
    mutationKey: [slug],
    onSuccess: (updatedArticle) => {
      navigate(pathKeys.article.bySlug(updatedArticle.slug), { replace: true });
    },
  });

  const mutationErrors = error?.response?.data || [error?.message];

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<UpdateArticle>({
    mode: 'onTouched',
    resolver: zodResolver(UpdateArticleSchema),
    defaultValues: transformArticleToUpdateArticle(article),
  });

  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const onValid = (updateArticle: UpdateArticle) => {
    mutate(updateArticle);
  };

  return (
    <Stack gap={5}>
      {isError && (
        <InlineNotification
          kind="error"
          title="Error updating article"
          subtitle={mutationErrors.join(', ')}
          data-test="article-error"
          hideCloseButton
        />
      )}

      <Form onSubmit={handleSubmit(onValid)}>
        <Stack gap={5}>
          <TextInput
            id="title"
            labelText="Article Title"
            placeholder="Article Title"
            type="text"
            size="lg"
            disabled={isPending}
            data-test="article-title-input"
            invalid={!!errors.title}
            invalidText={errors.title?.message}
            {...register('title')}
          />

          <TextInput
            id="description"
            labelText="Description"
            placeholder="What's this article about?"
            type="text"
            disabled={isPending}
            data-test="article-description-input"
            invalid={!!errors.description}
            invalidText={errors.description?.message}
            {...register('description')}
          />

          <TextArea
            id="body"
            labelText="Article Content"
            rows={8}
            placeholder="Write your article (in markdown)"
            disabled={isPending}
            data-test="article-body-input"
            invalid={!!errors.body}
            invalidText={errors.body?.message}
            {...register('body')}
          />

          <TextInput
            id="tagList"
            labelText="Tags"
            placeholder="Enter tags"
            type="text"
            disabled={isPending}
            data-test="article-tags-input"
            invalid={!!errors.tagList}
            invalidText={errors.tagList?.message}
            {...register('tagList')}
          />

          <Button type="submit" size="lg" disabled={!canSubmit} data-test="article-submit">
            Update Article
          </Button>
        </Stack>
      </Form>
    </Stack>
  );
}
