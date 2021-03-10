const createItemMember = (items, parentElement) => {
  items.forEach((item) => {
    let option = null;
    if (typeof item === 'object') {
      option = `
      <input id='select_${item.name}' class="menu__input" type="radio" name="select" />
      <label for='select_${item.name}' class="menu__label" tab-index="0">${item.name}</label>
    `;
    } else {
      option = `
      <input id='select_${item}' class="menu__input" type="radio" name="select" />
      <label for='select_${item}' class="menu__label"  tab-index="0">${item}</label>
    `;
    }

    parentElement.insertAdjacentHTML('beforeend', option);
  });
};

export default createItemMember;
