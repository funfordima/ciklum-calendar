import create from '../utils/create';

const createFooter = (parentElement) => {
  const footer = create('footer', 'footer', null, parentElement);
  const authorContainer = create('div', 'author__container', null, footer);
  const author = create('div', 'author', null, authorContainer);
  create('a', '', 'Dima Litvinov', author, ['href', 'https://github.com/funfordima']);
  const svgContainer = create('div', 'author hvr-buzz', null, authorContainer);
  const shareContainer = create('div', 'author', null, authorContainer, ['id', 'my-share']);
  const script = document.createElement('script');
  script.src = 'https://yastatic.net/share2/share.js';
  const yandexShare = `
  <div class="ya-share2" data-curtain data-color-scheme="blackwhite" data-limit="3" data-services="telegram,skype,linkedin">
  </div>
  `;
  shareContainer.append(script);
  shareContainer.insertAdjacentHTML('beforeend', yandexShare);
  const obj = `
  <object type="image/svg+xml" data="../src/assets/image/git.svg" width="70" height="70">
    <img src="../src/assets/image/git.png" width="200" height="200" alt="image format png" />
  </object>
`;
  svgContainer.insertAdjacentHTML('beforeend', obj);
};

export default createFooter;
