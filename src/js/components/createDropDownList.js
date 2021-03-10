import create from '../utils/create';
import createItemMember from '../utils/createItemMember';

const createDropDownList = (container, data) => {
  const menu = create('div', 'menu', null, container, ['data-state', ''], ['tabindex', '3']);
  const menuContent = create('div', 'menu__content', null, menu);
  const menuTitle = create('div', 'menu__title', null, menu, ['data-default', ''], ['tabindex', '0']);
  createItemMember(data, menuContent);

  return menuTitle;
};

export default createDropDownList;
