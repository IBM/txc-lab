import { IoHeart } from 'react-icons/io5';
import { Button } from '~shared/ui/button/button.ui';
import { Article } from '~entities/article/article.types';
import { useUnfavoriteArticleMutation } from './unfavorite-article.mutation';

export function UnfavoriteArticleBriefButton(props: { article: Article }) {
  const { article } = props;

  const { mutate } = useUnfavoriteArticleMutation({ mutationKey: [article.slug] });

  const handleUnfavorite = () => {
    mutate(article.slug);
  };

  return (
    <Button
      color="primary"
      onClick={handleUnfavorite}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        gap: '4px',
        minWidth: 'fit-content',
        padding: '0.25rem 0.75rem'
      }}
    >
      <IoHeart size={16} />
      {article.favoritesCount}
    </Button>
  );
}

export function UnfavoriteArticleExtendedButton(props: { article: Article }) {
  const { article } = props;

  const { mutate } = useUnfavoriteArticleMutation({ mutationKey: [article.slug] });

  const handleUnfavorite = () => {
    mutate(article.slug);
  };

  return (
    <Button
      color="primary"
      onClick={handleUnfavorite}
      data-test="unfavorite-extended-button"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        gap: '4px',
        minWidth: 'fit-content',
        padding: '0.25rem 0.75rem'
      }}
    >
      <IoHeart size={16} />
      &nbsp;Unfavorite Article&nbsp;
      <span className="counter">({article.favoritesCount})</span>
    </Button>
  );
}
