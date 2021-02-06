import create from './create';

const createModalDialog = (parentElement, msg, callback) => {
  const overlay = create('div', 'overlay', null, parentElement);
  const modal = create('div', 'modal msg', null, overlay);
  const textContainer = create('div', 'modal-form_line', null, modal);
  const buttonContainer = create('div', 'modal-form_line', null, modal);
  create('h3', 'modal__text', msg, textContainer, ['tab-index', '1']);
  create('input', 'modal-form__btn submit-button state-0', null, buttonContainer, ['type', 'button'], ['value', 'Confirm'], ['name', 'modal-submit'], ['tab-index', '2']);
  create('input', 'modal-form__btn cancel-button', null, buttonContainer, ['type', 'button'], ['value', 'Cancel'], ['name', 'modal-cancel'], ['tab-index', '3']);

  overlay.addEventListener('click', ({ target }) => {
    if (target.classList.contains('submit-button')) {
      callback();
      parentElement.removeChild(overlay);
    }

    if (target.classList.contains('cancel-button') || target.classList.contains('overlay')) {
      parentElement.removeChild(overlay);
    }
  });
};

export default createModalDialog;
