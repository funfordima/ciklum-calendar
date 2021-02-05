import create from '../utils/create';

export default class Calendar {
  constructor(urlToDoData, urlMembersData) {
    this.urlToDoData = urlToDoData;
    this.urlMembersData = urlMembersData;
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
    this.menu = create('div', 'menu', null, form, ['data-state', '']);
    const menuContent = create('div', 'menu__content', null, this.menu);

    this.menuTitle = create('div', 'menu__title', null, this.menu, ['data-default', '']);
    create('p', 'menu__container', this.menu, form);
    create('input', 'event-btn-add', null, btnContainer, ['type', 'submit'], ['value', 'New Event +']);
    this.resetMenuBtn = create('input', 'event-btn-reset', null, btnContainer, ['type', 'reset'], ['value', 'Clear it!']);
    create('a', 'header__title_link', 'Calendar', headerTitle, ['href', '#'], ['alt', 'logo link']);

    return menuContent;
  }

  async getData(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, status: ${response.status}`);
    }

    const json = await response.json();

    return json;
  }

  async generateMembers(parentElement) {
    const members = await this.getData(this.urlMembersData);
    members.forEach((member, indx) => {
      const option = `
        <input id='select_${indx}' class="menu__input" type="radio" name="select" />
        <label for='select_${indx}' class="menu__label">${member}</label>
      `;
      parentElement.insertAdjacentHTML('beforeend', option);
    });
  }

  async generateToDoItems(parentElement) {
    const todos = await this.getData(this.urlToDoData);
    todos.forEach(({
      title,
      dataCol,
      dataRow,
      complete,
    }) => {
      const todoContainer = create('div', 'main__item', null, parentElement, ['data-col', dataCol], ['data-row', dataRow], ['data-complete', complete]);
      create('h3', 'main__item_title', title, todoContainer);
      create('div', 'main__item_btn-close', '&times;', todoContainer);
    });
  }

  createMain() {
    const main = create('main', 'main', null, this.root);
    const rowContainer = create('div', 'row-container', null, main);
    const columnContainer = create('div', 'col-container', null, main);
    const contentContainer = create('div', 'content-container', null, main);

    this.days.forEach((dayItem) => {
      create('div', 'main__item', dayItem, rowContainer);
    });

    this.timeLabels.forEach((timeItem) => {
      create('div', 'main__item', timeItem, columnContainer);
    });

    this.generateToDoItems(contentContainer);
  }

  handlerInputMembers() {
    const menuLabels = document.querySelectorAll('.menu__label');

    // Toggle menu
    this.menuTitle.addEventListener('click', () => {
      if (this.menu.getAttribute('data-state') === 'active') {
        this.menu.setAttribute('data-state', '');
      } else {
        this.menu.setAttribute('data-state', 'active');
      }
    });

    // Close when click to option
    for (let i = 0; i < menuLabels.length; i += 1) {
      menuLabels[i].addEventListener('click', (evt) => {
        this.menuTitle.textContent = evt.target.textContent;
        this.menu.setAttribute('data-state', '');
      });
    }

    // Reset title
    this.resetMenuBtn.addEventListener('click', () => {
      this.menuTitle.textContent = this.menuTitle.getAttribute('data-default');
    });
  }

  init() {
    const memebersListContainer = this.createHeader();
    this.generateMembers(memebersListContainer);
    this.createMain();
    this.handlerInputMembers();
  }

  render() {
    this.init();
  }
}
