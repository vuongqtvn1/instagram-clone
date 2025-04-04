export const tryParseJson = (str: any) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return {};
  }
};

export const formatErrorYup = (errorYup: any) => {
  const errors: Record<string, Array<{ id: string; message: string }>> = {};

  errorYup.inner.forEach((error: any) => {
    if (error.path !== undefined) {
      errors[error.path] = error.errors.map((message: string) => ({
        id: message,
        message,
      }));
    }
  });

  return errors;
};
