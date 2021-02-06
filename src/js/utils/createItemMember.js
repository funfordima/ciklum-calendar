const createItemMember = (members, parentElement) => {
  members.forEach((member) => {
    const option = `
      <input id='select_${member}' class="menu__input" type="radio" name="select" />
      <label for='select_${member}' class="menu__label">${member}</label>
    `;

    parentElement.insertAdjacentHTML('beforeend', option);
  });
};

export default createItemMember;
