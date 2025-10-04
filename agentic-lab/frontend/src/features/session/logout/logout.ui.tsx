import { Button } from '@carbon/react';
import { useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { useLogoutMutation } from './logout.mutation';

export default function LogoutButton() {
  const navigate = useNavigate();

  const { mutate } = useLogoutMutation({
    onSuccess() {
      navigate(pathKeys.home);
    },
  });

  const handleClick = () => {
    mutate();
  };

  return (
    <Button kind="danger" onClick={handleClick} data-test="logout-button">
      Or click here to logout.
    </Button>
  );
}
