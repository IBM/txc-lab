import { ReactNode, Suspense } from 'react';
import { Grid, Column, Tag } from '@carbon/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { IoAdd, IoHeart, IoPencil } from 'react-icons/io5';
import ReactMarkdown from 'react-markdown';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { pathKeys } from '~shared/router';
import { Avatar } from '~shared/ui/avatar/avatar.ui';
import { Button } from '~shared/ui/button/button.ui';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { articleQueryOptions } from '~entities/article/article.api';
import { Article } from '~entities/article/article.types';
import { Profile } from '~entities/profile/profile.types';
import { DeleteArticleButton } from '~features/article/delete-article/delete-article.ui';
import { FavoriteArticleExtendedButton } from '~features/article/favorite-article/favorite-article.ui';
import { UnfavoriteArticleExtendedButton } from '~features/article/unfavorite-article/unfavorite-article.ui';
import { useCanPerformAction } from '~features/permission/permission.service';
import { FollowUserButton } from '~features/profile/follow-profile/follow-profile.ui';
import { UnfollowUserButton } from '~features/profile/unfollow-profile/unfollow-profile.ui';
import { CommentsFeed } from '~widgets/comments-feed/comments-feed.ui';
import { ArticleLoaderArgs } from './article-page.loader';
import { ArticlePageSkeleton } from './article-page.skeleton';

export default function ArticlePage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<ArticlePageSkeleton />}>
        <BaseArticlePage />
      </Suspense>
    </ErrorBoundary>
  );
}

function CodeBlock({ inline, className, children, ...props }: any) {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

function BaseArticlePage() {
  const { params } = useLoaderData() as ArticleLoaderArgs;
  const { slug } = params;

  const { data: article } = useSuspenseQuery(articleQueryOptions(slug));

  return (
    <div className="article-page">
      <div className="banner" style={{
        padding: '2.5rem 0',
        background: '#4a4a4a',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <h1
              data-test="article-title"
              style={{
                fontSize: '2.8rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#ffffff'
              }}
            >
              {article.title}
            </h1>
            <ArticleMetaBanner article={article} actions={<ArticleActions article={article} />} />
          </Column>
        </Grid>
      </div>

      <Grid data-test="article-body">
        <Column lg={16} md={8} sm={4}>
          <div className="markdown-content" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
              }}
            >
              {article.body}
            </ReactMarkdown>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {article.tagList.map((tag, index) => (
              <Tag key={`${tag}-${index}`} type="gray">
                {tag}
              </Tag>
            ))}
          </div>
        </Column>

        <Column lg={16} md={8} sm={4}>
          <hr />
          <div className="article-actions" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <ArticleMeta article={article} actions={<ArticleActions article={article} />} />
          </div>
        </Column>

        <Column lg={{ span: 12, offset: 2 }} md={{ span: 6, offset: 1 }} sm={4}>
          <CommentsFeed slug={slug} />
        </Column>
      </Grid>
    </div>
  );
}

function ArticleMetaBanner(props: { article: Article; actions?: ReactNode }) {
  const { article, actions } = props;

  const { author, updatedAt } = article;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(updatedAt));

  return (
    <div className="article-meta">
      <Link to={pathKeys.profile.byUsername(author.username)}>
        <Avatar src={author.image} username={author.username} size="medium" />
      </Link>
      <div className="info">
        <Link className="author" to={pathKeys.profile.byUsername(author.username)} data-test="article-author" style={{ color: '#ffffff' }}>
          {author.username}
        </Link>
        <span className="date" data-test="article-date" style={{ color: '#e0e0e0' }}>
          {formattedDate}
        </span>
      </div>
      {actions}
    </div>
  );
}

function ArticleMeta(props: { article: Article; actions?: ReactNode }) {
  const { article, actions } = props;

  const { author, updatedAt } = article;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(updatedAt));

  return (
    <div className="article-meta">
      <Link to={pathKeys.profile.byUsername(author.username)}>
        <Avatar src={author.image} username={author.username} size="medium" />
      </Link>
      <div className="info">
        <Link className="author" to={pathKeys.profile.byUsername(author.username)} data-test="article-author">
          {author.username}
        </Link>
        <span className="date" data-test="article-date">
          {formattedDate}
        </span>
      </div>
      {actions}
    </div>
  );
}

function ArticleActions(props: { article: Article }) {
  const { article } = props;
  const { author } = article;
  const { username } = author;

  const canUpdateArticle = useCanPerformAction('update', 'article', {
    articleAuthorId: username,
  });

  const canDeleteArticle = useCanPerformAction('delete', 'article', {
    articleAuthorId: username,
  });

  return (
    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
      {canUpdateArticle && <EditArticleLink slug={article.slug} />}
      {!canUpdateArticle && <ToggleFollowProfile profile={author} />}
      {canDeleteArticle && <DeleteArticleButton slug={article.slug} />}
      {!canDeleteArticle && <ToggleFavoriteArticle article={article} />}
    </div>
  );
}

function ToggleFollowProfile(props: { profile: Profile }) {
  const { profile } = props;
  const { following, username } = profile;

  const canFollowProfile = useCanPerformAction('follow', 'profile');
  const canUnfollowProfile = useCanPerformAction('unfollow', 'profile');
  const cannotFollowOrUnfollow = !canFollowProfile || !canUnfollowProfile;

  const canFollow = canFollowProfile && !following;
  const canUnfollow = canUnfollowProfile && following;

  return (
    <>
      {canFollow && <FollowUserButton username={username} />}
      {canUnfollow && <UnfollowUserButton username={username} />}
      {cannotFollowOrUnfollow && <NavigateToLoginButtonFollow username={profile.username} />}
    </>
  );
}

function ToggleFavoriteArticle(props: { article: Article }) {
  const { article } = props;
  const { favorited } = article;

  const canLikeArticle = useCanPerformAction('like', 'article');
  const canDislikeArticle = useCanPerformAction('dislike', 'article');
  const cannotLikeOrDislike = !canLikeArticle || !canDislikeArticle;

  const canLike = canLikeArticle && !favorited;
  const canDislike = canDislikeArticle && favorited;

  return (
    <>
      {canLike && <FavoriteArticleExtendedButton article={article} />}
      {canDislike && <UnfavoriteArticleExtendedButton article={article} />}
      {cannotLikeOrDislike && <NavigateToLoginButtonFavorite favoritesCount={article.favoritesCount} />}
    </>
  );
}

function EditArticleLink(props: { slug: string }) {
  const { slug } = props;
  const navigate = useNavigate();

  return (
    <Button
      color="secondary"
      variant="outline"
      size="sm"
      onClick={() => navigate(pathKeys.editor.bySlug(slug))}
      data-test="article-edit-button"
    >
      <IoPencil size={16} />
      &nbsp;Edit Article
    </Button>
  );
}

function NavigateToLoginButtonFollow(props: { username: string }) {
  const { username } = props;

  const navigate = useNavigate();

  const onClick = () => navigate(pathKeys.login);

  return (
    <Button color="secondary" variant="outline" className="action-btn " onClick={onClick}>
      <IoAdd size={16} />
      &nbsp; Follow {username}
    </Button>
  );
}

function NavigateToLoginButtonFavorite(props: { favoritesCount: number }) {
  const { favoritesCount } = props;

  const navigate = useNavigate();

  const onClick = () => navigate(pathKeys.login);

  return (
    <Button color="primary" variant="outline" onClick={onClick} data-test="favorite-extended-button">
      <IoHeart size={16} />
      &nbsp;Favorite Article&nbsp;
      <span className="counter">({favoritesCount})</span>
    </Button>
  );
}
