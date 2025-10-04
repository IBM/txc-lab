import { Suspense } from 'react';
import { Tag, Tabs as CarbonTabs, TabList, Tab } from '@carbon/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { Tabs } from '~shared/ui/tabs/tabs.ui';
import { selectSession } from '~entities/session/session.model';
import { tagsQueryOptions } from '~entities/tag/tag.api';
import { TagFilterSkeleton } from './filter-article.skeleton';
import { PrimaryLoaderArgs, SecondaryLoaderArgs } from './filter-article.types';

export function PrimaryFilter() {
  const session = useSelector(selectSession);

  const { context } = useLoaderData() as PrimaryLoaderArgs;
  const { filterQuery } = context;
  const { source, tag } = filterQuery;

  const [searchParams, setSearchParams] = useSearchParams();

  const tabValue = tag ? 'tag' : source;

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleTabClick = (source: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('source', source);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <Tabs.Root value={tabValue} onValueChange={handleTabClick}>
        <Tabs.List>
          {session && (
            <Tabs.Trigger value="user" data-test="your-feed-tab">
              Your Feed
            </Tabs.Trigger>
          )}
          <Tabs.Trigger value="global" data-test="global-feed-tab">
            Global Feed
          </Tabs.Trigger>
          {tag && <Tabs.Trigger value="tag">#{tag}</Tabs.Trigger>}
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
}
export function SecondaryFilter() {
  const { params, context } = useLoaderData() as SecondaryLoaderArgs;
  const { filterQuery } = context;
  const { favorited } = filterQuery;
  const { username } = params;

  const [, setSearchParams] = useSearchParams();

  const tabValue = favorited ? 'favorited' : 'author';

  const handleTabClick = (value: string) => {
    // Create a new URLSearchParams with only string values
    const newParams = new URLSearchParams();

    // Copy existing params except last24Hours (which is boolean)
    newParams.set('page', '1');
    newParams.set('source', filterQuery.source);

    // Check for optional properties
    if ('author' in filterQuery && filterQuery.author) {
      newParams.set('author', filterQuery.author);
    }
    if ('favorited' in filterQuery && filterQuery.favorited) {
      newParams.set('favorited', filterQuery.favorited);
    }

    if (value === 'author') {
      newParams.delete('favorited');
      newParams.set('author', username);
    }

    if (value === 'favorited') {
      newParams.delete('author');
      newParams.set('favorited', username);
    }

    setSearchParams(newParams);
  };

  const selectedIndex = tabValue === 'favorited' ? 1 : 0;

  const handleCarbonTabChange = (evt: any) => {
    const newIndex = evt.selectedIndex;
    handleTabClick(newIndex === 1 ? 'favorited' : 'author');
  };

  return (
    <div className="articles-toggle">
      <CarbonTabs selectedIndex={selectedIndex} onChange={handleCarbonTabChange}>
        <TabList aria-label="Profile tabs">
          <Tab data-test="profile-tab-my-articles">
            {`${username}`}'s Articles
          </Tab>
          <Tab data-test="profile-tab-favorited-articles">
            Favorited Articles
          </Tab>
        </TabList>
      </CarbonTabs>
    </div>
  );
}

export function TagFilter() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<TagFilterSkeleton />}>
        <div style={{ flex: '1', height: '100%', display: 'flex' }}>
          <BaseTagFilter />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseTagFilter() {
  const { data: tags } = useSuspenseQuery(tagsQueryOptions);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTag = searchParams.get('tag');

  const handleTagClick = (tag: string) => () => {
    const newParams = new URLSearchParams({ source: 'global', page: '1', tag });

    if (currentTag === tag) {
      newParams.delete('tag');
    }

    setSearchParams(newParams);
  };

  return (
    <div className="tag-list" data-test="tag-list" style={{
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
      maxHeight: 'calc(100% - 2rem)',
      width: '100%',
      overflow: 'auto'
    }}>
      {tags.map((tag) => (
        <Tag
          key={tag}
          type="cool-gray"
          onClick={handleTagClick(tag)}
          data-test={`tag-${tag}`}
          style={{
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e: any) => {
            e.currentTarget.style.backgroundColor = '#e0e0e0';
          }}
          onMouseLeave={(e: any) => {
            e.currentTarget.style.backgroundColor = '';
          }}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
}
