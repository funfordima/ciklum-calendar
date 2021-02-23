import create from '../utils/create';
import createItemMember from '../utils/createItemMember';
import Data from '../utils/data';
import { URL_EVENTS, message } from '../constants/constants';
import { successMsg, errorMsg } from './statusMsg';

const createNewItem = (main, members, days, times, renderMainFunc, isReplace = false) => {
  const overlay = create('div', 'overlay', null, main);
  const modal = create('div', 'modal', null, overlay);
  const form = create('form', 'modal-form', null, modal, ['name', 'modal-form']);

  const titleContainer = create('div', 'modal-form_line', null, form);
  const memberContainer = create('div', 'modal-form_line', null, form);
  const dayContainer = create('div', 'modal-form_line', null, form);
  const timeContainer = create('div', 'modal-form_line', null, form);
  const buttonContainer = create('div', 'modal-form_line', null, form);

  // Labels for input
  create('p', 'modal-form_label', 'Name of event', titleContainer);
  create('p', 'modal-form_label', 'Participants', memberContainer);
  create('p', 'modal-form_label', 'Day', dayContainer);
  create('p', 'modal-form_label', 'Time', timeContainer);

  const titleInput = create('input', 'modal-form__input', null, titleContainer,
    ['type', 'text'], ['tabindex', '1'], ['name', 'eventName'], ['placeholder', 'Event']);
  titleInput.focus();

  // Members input
  const menuMember = create('div', 'menu', null, memberContainer, ['data-state', ''], ['tabindex', '2']);
  const menuContentMember = create('div', 'menu__content', null, menuMember);
  const menuTitleMember = create('div', 'menu__title', null, menuMember, ['data-default', '']);
  menuTitleMember.setAttribute('tabindex', '0');
  createItemMember(members, menuContentMember);

  menuContentMember.querySelectorAll('input').forEach((inputEl) => inputEl.setAttribute('type', 'checkbox'));
  menuContentMember.querySelectorAll('label').forEach((labelEl) => labelEl.classList.add('member'));

  // Day input
  const menuDays = create('div', 'menu', null, dayContainer, ['data-state', ''], ['tabindex', '3']);
  const menuContentDays = create('div', 'menu__content', null, menuDays);
  const menuTitleDays = create('div', 'menu__title', null, menuDays, ['data-default', '']);
  menuTitleDays.setAttribute('tabindex', '0');
  createItemMember(days.slice(1), menuContentDays);

  // Time input
  const menuTime = create('div', 'menu', null, timeContainer, ['data-state', ''], ['tabindex', '4']);
  const menuContentTime = create('div', 'menu__content', null, menuTime);
  const menuTitleTime = create('div', 'menu__title', null, menuTime, ['data-default', '']);
  menuTitleTime.setAttribute('tabindex', '0');
  createItemMember(times, menuContentTime);

  // Buttons
  const btnSubmit = create('button', 'modal-form__btn submit-button state-0', null, buttonContainer,
    ['type', 'submit'], ['name', 'modal-form-submit'], ['tabindex', '5']);
  create('input', 'modal-form__btn cancel-button', null, buttonContainer,
    ['type', 'button'], ['value', 'Cancel'], ['name', 'modal-form-cancel'], ['tabindex', '6']);
  create('button', 'modal__close-btn', '&times', modal, ['type', 'button'], ['tabindex', '7']);
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

  const updateButtonMsg = () => {
    btnSubmit.classList.add('state-1', 'animated');

    setTimeout(finalButtonMsg, 2000);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const minLengthInput = 2;
    const inputEvent = titleInput.value.trim();
    const newMembers = menuTitleMember.textContent.split(' ');
    const newDay = menuTitleDays.textContent.trim();
    const newTime = menuTitleTime.textContent.trim();
    let isLoad = false;

    // Check input
    switch (true) {
      case (inputEvent.length < minLengthInput): {
        const msg = errorMsg(message.noEvent, form);

        setTimeout(() => form.removeChild(msg), 2000);
        break;
      }

      case (!newMembers.length): {
        const msg = errorMsg(message.noMember, form);

        setTimeout(() => form.removeChild(msg), 2000);
        break;
      }

      case (!newDay): {
        const msg = errorMsg(message.noDay, form);

        setTimeout(() => form.removeChild(msg), 2000);
        break;
      }

      case (!newTime): {
        const msg = errorMsg(message.noTime, form);

        setTimeout(() => form.removeChild(msg), 2000);
        break;
      }

      default: {
        const newEvent = {
          title: inputEvent,
          participants: [...newMembers],
          day: newDay,
          time: newTime,
          complete: true,
        };

        const events = JSON.parse(localStorage.getItem('events'));

        const newEvents = events.map((eventItem) => {
          const { day, time, title } = eventItem;
          const condition = newDay === day && newTime === time;

          if (condition && inputEvent === title) {
            if (!isReplace) {
              const msg = errorMsg(message.failure, form);
              isLoad = false;

              setTimeout(() => form.removeChild(msg), 2000);
            } else {
              isLoad = true;

              return newEvent;
            }
          } else if (condition && inputEvent !== title) {
            isLoad = true;

            return newEvent;
          }

          return eventItem;
        });

        if (isLoad) {
          updateButtonMsg();
          Data.sendData(URL_EVENTS, newEvents)
            .then(() => {
              localStorage.setItem('events', JSON.stringify(newEvents));
              const msg = successMsg(message.success, form);
              renderMainFunc();

              setTimeout(() => {
                form.removeChild(msg);
                main.removeChild(overlay);
              }, 2100);
            })
            .catch((error) => {
              const msg = errorMsg(error.message, form);

              setTimeout(() => form.removeChild(msg), 2000);
            })
            .finally(() => {
              titleInput.value = '';
              menuTitleMember.textContent = menuTitleMember.getAttribute('data-default');
              menuTitleDays.textContent = menuTitleDays.getAttribute('data-default');
              menuTitleTime.textContent = menuTitleTime.getAttribute('data-default');
            });
        }

        break;
      }
    }
  });

  // Handle Input
  overlay.addEventListener('click', (event) => {
    const { target } = event;

    if (target.classList.contains('cancel-button')) {
      titleInput.value = '';
      menuTitleMember.textContent = menuTitleMember.getAttribute('data-default');
      menuTitleDays.textContent = menuTitleDays.getAttribute('data-default');
      menuTitleTime.textContent = menuTitleTime.getAttribute('data-default');
    }

    if (target.classList.contains('modal__close-btn') || target.classList.contains('overlay')) {
      main.removeChild(overlay);
    }

    if (target.classList.contains('menu__title')) {
      // Toggle menu
      if (target.parentElement.getAttribute('data-state') === 'active') {
        target.parentElement.setAttribute('data-state', '');
      } else {
        target.parentElement.setAttribute('data-state', 'active');
      }
    }

    if (target.classList.contains('member')) {
      const previousTitle = target.parentElement.nextElementSibling.textContent;
      const nextTitle = target.textContent;

      /* eslint prefer-const: 0 */
      if (previousTitle.includes(nextTitle)) {
        let previousArr = previousTitle.split(' ');
        const indWillDelElem = previousTitle.split(' ').findIndex((el) => el === nextTitle);
        previousArr.splice(indWillDelElem, 1);
        target.parentElement.nextElementSibling.textContent = previousArr.join(' ');
      } else {
        target.parentElement.nextElementSibling.textContent += ` ${target.textContent}`;
      }

      // Close when click to input option
      target.parentElement.parentElement.setAttribute('data-state', '');
    }

    if (target.classList.contains('menu__label') && !target.classList.contains('member')) {
      target.parentElement.nextElementSibling.textContent = target.textContent;

      // Close when click to input option
      target.parentElement.parentElement.setAttribute('data-state', '');
    }
  });
};

export default createNewItem;
