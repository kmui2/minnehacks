export default e => {
  if (e.response !== undefined && e.response.data !== undefined) {
    const error =
      typeof e.response.data === "string"
        ? e.response.data
        : e.response.data.error;
    console.error(error);
  } else {
    console.error(e.message);
  }
};
