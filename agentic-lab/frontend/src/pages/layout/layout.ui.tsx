import { Suspense } from 'react';
import { Grid, Column } from '@carbon/react';
import { ErrorBoundary } from 'react-error-boundary';
import { IoCreateOutline, IoSettingsSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { Outlet, NavLink } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { Avatar } from '~shared/ui/avatar/avatar.ui';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { Skeleton } from '~shared/ui/skeleton/skeleton.ui';
import { Stack } from '~shared/ui/stack/stack.ui';
import { selectSession } from '~entities/session/session.model';
import { useCanPerformAction } from '~features/permission/permission.service';

export default function Layout() {
  const session = useSelector(selectSession);
  return session?.token ? <UserLayout /> : <GuestLayout />;
}

function UserLayout() {
  return (
    <>
      <Navigation links={[UserNavigation]} />
      <div style={{ minHeight: 'calc(100vh - 160px)', backgroundColor: 'var(--cds-layer-01)' }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function GuestLayout() {
  return (
    <>
      <Navigation links={[HomeLink, SignInLink, SignUpLink]} />
      <div style={{ minHeight: 'calc(100vh - 160px)', backgroundColor: 'var(--cds-layer-01)', paddingBottom: '0' }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function Navigation({ links }: { links: Array<() => JSX.Element> }) {
  return (
    <nav className="navbar navbar-light" style={{ backgroundColor: 'var(--cds-background-brand)' }}>
      <div className="container">
        <BrandLink />
        <ul className="nav navbar-nav pull-xs-right">
          {links.map((LinkComponent, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index} className="nav-item">
              <LinkComponent />
            </li>
          ))}
          {/* Theme toggle removed */}
        </ul>
      </div>
    </nav>
  );
}

function UserNavigation() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<UserNavigationSkeleton />}>
        <BaseUserNavigation />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseUserNavigation() {
  const session = useSelector(selectSession);

  const canCreateArticle = useCanPerformAction('create', 'article');
  const canUpdateProfile = useCanPerformAction('update', 'profile', { profileOwnerId: session?.username || '' });

  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <HomeLink />
      </li>
      {canCreateArticle && (
        <li className="nav-item">
          <NewArticleLink />
        </li>
      )}
      {canUpdateProfile && (
        <li className="nav-item">
          <SettingsProfileLink />
        </li>
      )}
      {canUpdateProfile && (
        <li className="nav-item">
          <ProfileLink />
        </li>
      )}
    </ul>
  );
}

function BrandLink() {
  return (
    <NavLink
      className="navbar-brand"
      to={pathKeys.home}
      style={{
        color: 'var(--cds-text-on-color)',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.2s ease'
      }}
    >
      <img src="/Bob.svg" alt="Bob Logo" width="24" height="24" style={{ marginRight: '8px' }} />
      <span>Bobverse</span>
    </NavLink>
  );
}

function HomeLink() {
  return (
    <NavLink
      className="nav-link"
      to={pathKeys.home}
      style={{
        color: 'var(--cds-text-on-color)',
        transition: 'all 0.2s ease'
      }}
    >
      Home
    </NavLink>
  );
}

function SignInLink() {
  return (
    <NavLink
      className="nav-link"
      to={pathKeys.login}
      style={{
        color: 'var(--cds-text-on-color)',
        transition: 'all 0.2s ease'
      }}
    >
      Sign in
    </NavLink>
  );
}

function SignUpLink() {
  return (
    <NavLink
      className="nav-link"
      to={pathKeys.register}
      style={{
        color: 'var(--cds-text-on-color)',
        transition: 'all 0.2s ease'
      }}
    >
      Sign up
    </NavLink>
  );
}

function NewArticleLink() {
  return (
    <NavLink
      className="nav-link"
      to={pathKeys.editor.root}
      style={{
        color: 'var(--cds-text-on-color)',
        transition: 'all 0.2s ease'
      }}
    >
      <IoCreateOutline size={16} /> &nbsp;New Article
    </NavLink>
  );
}

function SettingsProfileLink() {
  return (
    <NavLink
      className="nav-link"
      to={pathKeys.settings}
      style={{
        color: 'var(--cds-text-on-color)',
        transition: 'all 0.2s ease'
      }}
    >
      <IoSettingsSharp size={16} /> &nbsp;Settings
    </NavLink>
  );
}

function ProfileLink() {
  const session = useSelector(selectSession);

  if (!session?.username) {
    return null;
  }

  return (
    <NavLink
      className="nav-link"
      to={pathKeys.profile.byUsername(session.username)}
      style={{
        color: 'var(--cds-text-on-color)',
        transition: 'all 0.2s ease'
      }}
    >
      <Avatar src={session.image} username={session.username} size="small" className="user-pic" /> {session.username}
    </NavLink>
  );
}

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--cds-layer-01)',
        padding: '0.1rem 0',
        marginTop: 0,
        borderTop: '1px solid var(--cds-border-subtle-01)',
      }}
    >
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <NavLink
              className="logo-font"
              to={pathKeys.home}
              style={{
                color: 'var(--cds-interactive-01)',
                fontSize: '1.25rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <img src="/Bob.svg" alt="Bob Logo" width="20" height="20" style={{ marginRight: '8px' }} />
              Bobverse
            </NavLink>
          </div>
        </Column>
      </Grid>
    </footer>
  );
}

function UserNavigationSkeleton() {
  return (
    <Stack spacing={16} alignItems="center" justifyContent="flex-end" style={{ height: '38px' }}>
      <Skeleton width={40} />
      <Skeleton width={90} />
      <Skeleton width={70} />
      <Stack alignItems="center" spacing={4}>
        <Skeleton variant="circular" width={26} height={26} />
        <Skeleton />
      </Stack>
    </Stack>
  );
}

// Made with Bob
