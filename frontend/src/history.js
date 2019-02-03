import createHistory from 'history/createBrowserHistory';

export const history = createHistory();
history.listen(location => {
  const { hash } = location;
  if (!hash) {
    return;
  }
  const elem = document.querySelector(hash);
  if (!elem) {
    return;
  }
  elem.scrollIntoView(true);
});

export default history;
