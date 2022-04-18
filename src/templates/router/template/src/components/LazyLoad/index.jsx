import PropTypes from 'prop-types';
import { Suspense, lazy } from 'react';

export function LazyLoad({ component }) {
  const Component = lazy(() => import(`@/views/${component}.jsx`));

  return (
    <Suspense fallback={<>loading...</>}>
      <Component />
    </Suspense>
  );
}

LazyLoad.propTypes = {
  component: PropTypes.string.isRequired,
};
