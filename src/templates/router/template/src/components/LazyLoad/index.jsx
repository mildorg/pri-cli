import { Suspense, lazy } from 'react';

export const LazyLoad = (props) => {
  const Component = lazy(() => import(`@/views/${props.component}.jsx`));

  return (
    <Suspense fallback={<>loading...</>}>
      <Component />
    </Suspense>
  );
};
