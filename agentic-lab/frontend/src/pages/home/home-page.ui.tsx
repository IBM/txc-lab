import { Grid, Column } from '@carbon/react';
import { TagFilter } from '~features/article/filter-article/filter-article.ui';
import { ArticlesFeed } from '~widgets/articles-feed/articles-feed.ui';

export default function HomePage() {
  return (
    <div
      className="home-page"
      style={{
        backgroundColor: 'var(--cds-layer-01)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        paddingBottom: '0',
      }}
    >
      <div className="banner" style={{ background: 'var(--cds-interactive-01)' }}>
        <Grid>
          <Column lg={16} md={8} sm={4} style={{ textAlign: 'center' }}>
            <h1
              className="logo-font"
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--cds-text-on-color)',
                textShadow: '0 1px 3px var(--cds-shadow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              <img src="/Bob.svg" alt="Bob Logo" width="48" height="48" style={{ marginRight: '12px' }} />
              Bobverse
            </h1>
            <p
              style={{
                color: 'var(--cds-text-on-color)',
                fontSize: '1.2rem',
                fontWeight: 300,
                margin: 0,
              }}
            >
              A place to share your knowledge.
            </p>
          </Column>
        </Grid>
      </div>

      <Grid style={{ marginTop: '0.5rem', paddingBottom: '0', backgroundColor: 'var(--cds-ui-background)' }}>
        <Column lg={12} md={6} sm={4}>
          <ArticlesFeed />
        </Column>

        <Column lg={4} md={2} sm={4}>
          <div className="sidebar" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: 'var(--cds-text-01)',
                letterSpacing: '0.16px',
                lineHeight: '1.375rem',
              }}
            >
              Popular Tags
            </h3>
            <TagFilter />
          </div>
        </Column>
      </Grid>
    </div>
  );
}
