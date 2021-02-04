import create from '../utils/create';

export default class Calendar {
  constructor(members) {
    this.members = members;
    this.root = document.getElementById('root');
    this.days = ['Name', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    this.timeLabels = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  }

  createHeader() {
    const header = create('header', 'header', null, this.root);
    const headerTitle = create('h1', 'header__title', null, header);
    const navContainer = create('div', 'header__form_container', null, header);
    const form = create('form', 'header__form', null, navContainer, ['name', 'members-form']);
    const btnContainer = create('div', 'event-btn__container', null, form);
    const menu = create('div', 'menu', null, form, ['data-state', '']);
    const menuContent = create('div', 'menu__content', null, menu);

    create('div', 'menu__title', null, menu, ['data-default', '']);
    create('p', 'menu__container', menu, form);
    create('input', 'event-btn-add', null, btnContainer, ['type', 'submit'], ['value', 'New Event +']);
    create('input', 'event-btn-reset', null, btnContainer, ['type', 'reset'], ['value', 'Clear it!']);
    create('a', 'header__title_link', 'Calendar', headerTitle, ['href', '#'], ['alt', 'logo link']);

    return menuContent;
  }

  generateMembers(parentElement) {
    this.members.forEach((member, indx) => {
      const option = `
        <input id='select_${indx}' class="menu__input" type="radio" name="select" />
        <label for='select_${indx}' class="menu__label">${member}</label>
      `;
      parentElement.insertAdjacentHTML('beforeend', option);
    });
  }

  createMain() {
    const main = create('main', 'main', null, this.root);
    const rowContainer = create('div', 'row-container', null, main);
    const columnContainer = create('div', 'col-container', null, main);
    create('div', 'content-container', null, main);

    this.days.forEach((dayItem) => {
      create('div', 'main__item', dayItem, rowContainer);
    });

    this.timeLabels.forEach((timeItem) => {
      create('div', 'main__item', timeItem, columnContainer);
    });
  }

  init() {
    const memebersListContainer = this.createHeader();
    this.generateMembers(memebersListContainer);
    this.createMain();
  }

  render() {
    this.init();
  }
}
