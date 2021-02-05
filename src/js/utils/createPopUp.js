import create from './create';
import createItemMember from './createItemMember';

const createPopUp = (main, members, days, times) => {
  const overlay = create('div', 'overlay', null, main);
  const modal = create('div', 'modal', null, overlay);
  const form = create('form', 'modal-form', null, modal);

  const titleContainer = create('div', 'modal-form_line', null, form);
  const memberContainer = create('div', 'modal-form_line', null, form);
  const dayContainer = create('div', 'modal-form_line', null, form);
  const timeContainer = create('div', 'modal-form_line', null, form);
  const buttonContainer = create('div', 'modal-form_line', null, form);

  create('p', 'modal-form_label', 'Name of event', titleContainer);
  create('p', 'modal-form_label', 'Participants', memberContainer);
  create('p', 'modal-form_label', 'Day', dayContainer);
  create('p', 'modal-form_label', 'Time', timeContainer);

  const titleInput = create('input', 'modal-form__input', null, titleContainer, ['type', 'text'], ['tab-index', '1'], ['name', 'eventName'], ['placeholder', 'Event']);

  // Members input
  const menuMember = create('div', 'menu', null, memberContainer, ['data-state', '']);
  const menuContentMember = create('div', 'menu__content', null, menuMember);
  const menuTitleMember = create('div', 'menu__title', null, menuMember, ['data-default', '']);
  menuTitleMember.setAttribute('tab-index', '2');
  createItemMember(members, menuContentMember);

  // Day input
  const menuDays = create('div', 'menu', null, dayContainer, ['data-state', '']);
  const menuContentDays = create('div', 'menu__content', null, menuDays);
  const menuTitleDays = create('div', 'menu__title', null, menuDays, ['data-default', '']);
  menuTitleMember.setAttribute('tab-index', '3');
  createItemMember(days, menuTitleDays);

  // Time input
  const menuTime = create('div', 'menu', null, timeContainer, ['data-state', '']);
  const menuContentTime = create('div', 'menu__content', null, menuTime);
  const menuTitleTime = create('div', 'menu__title', null, menuTime, ['data-default', '']);
  menuTitleMember.setAttribute('tab-index', '4');
  createItemMember(times, menuTitleTime);

  // Buttons
  const btnSubmit = create('button', 'modal-form__btn submit-button state-0', null, buttonContainer, ['type', 'submit'], ['name', 'modal-form-submit'], ['tab-index', '5']);
  const btnCancel = create('input', 'modal-form__btn cancel-button', null, buttonContainer, ['type', 'button'], ['value', 'Cancel'], ['name', 'modal-form-cancel'], ['tab-index', '6']);
  const btnCloseModal = create('button', 'modal__close-btn', '&times', modal, ['type', 'button'], ['tab-index', '7']);
  create('span', 'pre-state-msg', 'Submit', btnSubmit);
  create('span', 'current-state-msg hide', 'Sending...', btnSubmit);
  create('span', 'done-state-msg hide', 'Done!', btnSubmit);

  // Handle click Button
  const setInitialButtonState = () => {
    btnSubmit.classList.remove('state-1', 'state-2', 'animated');
  };

  const finalButtonMsg = () => {
    btnSubmit.classList.add('state-2');

    setTimeout(setInitialButtonState, 2000);
  };

  const updateButtonMsg = (event) => {
    event.preventDefault();
    btnSubmit.classList.add('state-1', 'animated');

    setTimeout(finalButtonMsg, 2000);
  };

  btnSubmit.addEventListener('click', updateButtonMsg);

  overlay.addEventListener('click', ({ target }) => {
    if (target.classList.contains('modal__close-btn') || target.classList.contains('overlay')) {
      main.removeChild(overlay);
    }
  });
};

export default createPopUp;
