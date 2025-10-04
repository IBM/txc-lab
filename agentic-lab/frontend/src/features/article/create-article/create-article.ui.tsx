import { TextInput, TextArea, Button, Form, Stack, InlineNotification } from '@carbon/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { CreateArticleSchema } from './create-article.contract';
import { useCreateArticleMutation } from './create-article.mutation';
import { CreateArticle } from './create-article.types';

export function CreateArticleForm() {
	return (
		<ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
			<BaseCreateArticleForm />
		</ErrorBoundary>
	);
}

export function BaseCreateArticleForm() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, isValid },
	} = useForm<CreateArticle>({
		mode: 'onTouched',
		resolver: zodResolver(CreateArticleSchema),
		defaultValues: { title: '', description: '', body: '', tagList: '' },
	});

	const { mutate, isPending, isError, error } = useCreateArticleMutation({
		onSuccess: (article) => {
			navigate(pathKeys.article.bySlug(article.slug), { replace: true });
		},
	});

	const mutationErrors = error?.response?.data || [error?.message];
	const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

	const onValid = (createArticle: CreateArticle) => {
		mutate(createArticle);
	};

	return (
		<Stack gap={5}>
			{isError && (
				<InlineNotification
					kind="error"
					title="Error creating article"
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
						Publish Article
					</Button>
				</Stack>
			</Form>
		</Stack>
	);
}
