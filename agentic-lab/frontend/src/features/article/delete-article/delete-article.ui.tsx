import { Button } from '@carbon/react';
import { IoTrash } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { useDeleteArticleMutation } from './delete-article.mutation';

export function DeleteArticleButton(props: { slug: string }) {
  const { slug } = props;

  const navigate = useNavigate();

  const { mutate, isPending } = useDeleteArticleMutation({
    mutationKey: [slug],
    onSuccess: () => {
      navigate(pathKeys.home, { replace: true });
    },
  });

  const handleClick = () => {
    mutate(slug);
  };

  return (
    <Button
      kind="danger"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      data-test="article-delete-button"
      renderIcon={IoTrash}
    >
      Delete Article
    </Button>
  );
}
