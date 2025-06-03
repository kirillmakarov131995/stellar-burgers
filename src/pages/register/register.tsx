import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store/store';
import { Preloader } from '@ui';
import { Modal } from '@components';
import { RequestState } from '@utils-types';
import { registerAsyncThunk } from '../../services/store/features/auth/authSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.app.isLoading);
  // const responseMessage = useSelector((state) => state.user.responseMessage);
  const responseMessage = '';
  const actionState = useSelector((state) => state.user.actionState);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerAsyncThunk({
        name: userName,
        email,
        password
      })
    );
  };

  useEffect(() => {
    switch (actionState) {
      case RequestState.success:
        setUserName('');
        setEmail('');
        setPassword('');
        break;
    }
  }, [actionState]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <RegisterUI
        errorText=''
        email={email}
        userName={userName}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        setUserName={setUserName}
        handleSubmit={handleSubmit}
      />

      {responseMessage ? (
        <Modal
          title={responseMessage}
          onClose={() => {
            // dispatch(resetResponseMessage());
          }}
        />
      ) : null}
    </>
  );
};
