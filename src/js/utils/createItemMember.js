const createItemMember = (members, parentElement) => {
  members.forEach((member, indx) => {
    const option = `
      <input id='select_${indx}' class="menu__input" type="radio" name="select" />
      <label for='select_${indx}' class="menu__label">${member}</label>
    `;
    parentElement.insertAdjacentHTML('beforeend', option);
  });
};

export default createItemMember;
