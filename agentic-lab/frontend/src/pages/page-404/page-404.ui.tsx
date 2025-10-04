import { useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { Button } from '~shared/ui/button/button.ui';
import * as styles from './page-404.module.css';

export default function Page404() {
  const navigate = useNavigate();

  return (
    <div className={styles['outer-wrapper']}>
      <div className={styles['inner-wrapper']}>
        <div className="container">
          <h1 className="logo-font" data-test="not-found-title">
            Page not found
          </h1>
          <p>Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
          <Button color="primary" size="sm" onClick={() => navigate(pathKeys.home)} data-test="go-home-link">
            Go back home
          </Button>
        </div>
      </div>
    </div>
  );
}
