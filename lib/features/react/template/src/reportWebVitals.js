/**
 * It's a function that takes a callback function as an argument. It then imports the web-vitals
 * module, which is a set of functions that report various performance metrics to Google Analytics. It
 * then calls the imported functions, passing the callback function as an argument to each
 * @param onPerfEntry - A callback function that takes in a PerformanceEntry object.
 */
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};
