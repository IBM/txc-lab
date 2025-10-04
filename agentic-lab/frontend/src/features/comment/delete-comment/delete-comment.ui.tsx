import { Button } from '@carbon/react';
import { IoTrash } from 'react-icons/io5';
import { useDeleteCommentMutation } from './delete-comment.mutation';

type DeleteCommentButttonProps = {
  id: number;
  slug: string;
};

export function DeleteCommentButtton(props: DeleteCommentButttonProps) {
  const { id, slug } = props;

  const { mutate } = useDeleteCommentMutation({ mutationKey: [`${id} ${slug}`] });

  const handleClick = () => {
    mutate({ slug, id });
  };

  return (
    <Button
      kind="ghost"
      size="sm"
      onClick={handleClick}
      hasIconOnly
      iconDescription="Delete comment"
      renderIcon={IoTrash}
      data-test="comment-delete-button"
    />
  );
}
