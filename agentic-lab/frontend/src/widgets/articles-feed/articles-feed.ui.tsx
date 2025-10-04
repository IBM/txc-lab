import { ReactNode, Suspense, useState } from 'react';
import { Tile, Tag, Search } from '@carbon/react';
import { useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { IoHeart } from 'react-icons/io5';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { Avatar } from '~shared/ui/avatar/avatar.ui';
import { Button } from '~shared/ui/button/button.ui';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import Toggle from '~shared/ui/toggle/toggle.ui';
import { articlesQueryOptions } from '~entities/article/article.api';
import { Article } from '~entities/article/article.types';
import { FavoriteArticleBriefButton } from '~features/article/favorite-article/favorite-article.ui';
import { BaseLoaderArgs } from '~features/article/filter-article/filter-article.types';
import { UnfavoriteArticleBriefButton } from '~features/article/unfavorite-article/unfavorite-article.ui';
import { useCanPerformAction } from '~features/permission/permission.service';
import { ArticlesFeedSkeleton } from './articles-feed.skeleton';
import './articles-feed.css';

export function ArticlesFeed() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<ArticlesFeedSkeleton />}>
        <BaseArticlesFeed />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseArticlesFeed() {
  const {
    context: { filterQuery },
  } = useLoaderData() as BaseLoaderArgs;

  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError } = useQuery(articlesQueryOptions(filterQuery));

  if (isLoading) return <ArticlesFeedSkeleton />;
  if (isError || !data) {
    return (
      <div className="articles-feed-empty">
        <p>No articles are here... yet.</p>
      </div>
    );
  }

  const articles = Object.values(data.articles);

  // Filter articles based on search term
  const filteredArticles = searchTerm
    ? articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : articles;

  return (
    <>
      <div className="articles-feed-toolbar">
        <Search
          labelText="Search articles"
          placeholder="Search by title or description"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="articles-feed-search"
        />
				{/* Here add the first comment*/}
      </div>
      <div className="articles-feed-scrollable">
        {filteredArticles.map((article) => (
          <ArticleMeta key={article.slug} article={article} action={<FavoriteArticleAction article={article} />} />
        ))}

        {filteredArticles.length === 0 && (
          <Tile className="articles-feed-empty-tile">
            <p className="articles-feed-empty-text">
							{/* Here add the second comment*/}
              {searchTerm ? 'No articles match your search criteria.' : 'No articles are here... yet.'}
            </p>
          </Tile>
        )}
      </div>
    </>
  );
}

type ArticleMetaProps = { article: Article; action?: ReactNode };
function ArticleMeta(props: ArticleMetaProps) {
  const { article, action } = props;
  const { author, updatedAt } = article;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(updatedAt));

  return (
    <Tile
      data-test="article-preview"
      className="article-tile"
      onMouseEnter={(e: any) => {
        e.currentTarget.classList.add('article-tile-hover');
      }}
      onMouseLeave={(e: any) => {
        e.currentTarget.classList.remove('article-tile-hover');
      }}
    >
      <div className="article-header">
        <div className="article-author">
          <Link to={pathKeys.profile.byUsername(author.username)}>
            <Avatar src={author.image} username={author.username} size="medium" />
          </Link>

          <div>
            <Link to={pathKeys.profile.byUsername(author.username)} className="article-author-username">
              {author.username}
            </Link>
            <div className="article-date">{formattedDate}</div>
          </div>
        </div>

        {action}
      </div>

      <Link to={pathKeys.article.bySlug(article.slug)} className="article-link">
        <h2 className="article-title">{article.title}</h2>
        <p className="article-description">{article.description}</p>
        <span className="article-read-more">Read more...</span>
        {article.tagList.length > 0 && (
          <div className="article-tags">
            {article.tagList.map((tag, index) => (
              <Tag key={`${tag}-${index}`} type="gray" size="sm">
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </Link>
    </Tile>
  );
}

function FavoriteArticleAction(props: { article: Article }) {
  const { article } = props;

  const canLike = useCanPerformAction('like', 'article');
  const canDislike = useCanPerformAction('dislike', 'article');
  const canLikeArticle = canLike && !article.favorited;
  const canDislikeArticle = canDislike && article.favorited;
  const cannotLikeAndDislikeArticle = !canLike && !canDislike;

  return (
    <>
      {canLikeArticle && <FavoriteArticleBriefButton article={article} />}
      {canDislikeArticle && <UnfavoriteArticleBriefButton article={article} />}
      {cannotLikeAndDislikeArticle && <NavigateToLoginButton favoritesCount={article.favoritesCount} />}
    </>
  );
}

const ToggleVersion = true;

function NavigateToLoginButton(props: { favoritesCount: number }) {
  const [toggled, setToggled] = useState(false);
  const { favoritesCount } = props;

  const navigate = useNavigate();

  const onClick = () => navigate(pathKeys.login);

  if (ToggleVersion) {
    // Create an inline toggle by using the hideLabel property
    return <Toggle id="fav-toggle" labelText="favorite" toggled={toggled} onToggle={() => setToggled(!toggled)} />;
  }
  return (
    <Button color="primary" variant="outline" size="sm" onClick={onClick}>
      <IoHeart size={16} /> {favoritesCount > 0 && favoritesCount}
    </Button>
  );
}
