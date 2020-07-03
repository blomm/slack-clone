// we can use this function to wrap any errors into an
// error object and send back with a 200 response to be
// interpreted on the frontend (and avoid handingling GraphQL errors)
module.exports = (e) => {
  try {
    return e.errors.map((x) => {
      let { path, message } = x;
      return { path, message };
    });
  } catch (error) {
    return [{ path: "unknown", message: JSON.stringify(e) }];
  }
};
