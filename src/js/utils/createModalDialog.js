import create from './create';
import { successMsg, errorMsg } from '../components/statusMsg';

const createModalDialog = (parentElement, msg, callback, child = null) => {
  const overlay = create('div', 'overlay', null, parentElement);
  const modal = create('div', 'modal msg', null, overlay);
  const textContainer = create('div', 'modal-form_line -column', null, modal);
  const buttonContainer = create('div', 'modal-form_line', null, modal);
  create('h3', 'modal__text', msg, textContainer, ['tabindex', '1']);
  const btnSubmit = create('input', 'modal-form__btn submit-button state-0', null, buttonContainer,
    ['type', 'button'], ['value', 'Confirm'], ['name', 'modal-submit'], ['tabindex', '2'], ['aria-label', 'Confirm']);
  create('input', 'modal-form__btn cancel-button', null, buttonContainer,
    ['type', 'button'], ['value', 'Cancel'], ['name', 'modal-cancel'], ['tabindex', '3'], ['aria-label', 'Cancel']);

  if (child) {
    textContainer.insertAdjacentElement('beforeend', child);

    const inputUser = textContainer.querySelector('.modal-form__input');
    inputUser && inputUser.focus();

    textContainer.querySelector('.modal-form').addEventListener('submit', (event) => {
      event.preventDefault();
    });
  }

  overlay.addEventListener('click', ({ target }) => {
    if (target.classList.contains('submit-button')) {
      const name = textContainer.querySelector('.modal-form__input').value.trim();
      callback(name);
      parentElement.removeChild(overlay);
    }

    if (target.classList.contains('cancel-button') || target.classList.contains('overlay')) {
      parentElement.removeChild(overlay);
    }
  });

  const inputUser = textContainer.querySelector('.modal-form__input');
  inputUser && inputUser.addEventListener('blur', ({ target }) => {
    const newName = target.value;
    const minNameLength = 2;

    if (newName.trim().length < minNameLength) {
      const msg = errorMsg('Please type correct name', textContainer);
      btnSubmit.disabled = true;

      setTimeout(() => {
        textContainer.removeChild(msg);
      }, 2000);
    }
  });

  inputUser && inputUser.addEventListener('change', ({ target }) => {
    const members = JSON.parse(localStorage.getItem('members'));
    const condition = members.find(({ name }) => name === target.value);

    if (condition) {
      const msg = errorMsg('Entered name already exists', textContainer);
      btnSubmit.disabled = true;

      setTimeout(() => {
        textContainer.removeChild(msg);
      }, 2000);
    } else {
      btnSubmit.disabled = false;
    }
  });
};

export default createModalDialog;
