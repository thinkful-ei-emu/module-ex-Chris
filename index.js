/* eslint-disable no-undef */
/* eslint-disable no-console */
'use strict';

/*eslint-env jquery*/

const STORE = {
  items: [
    {id: cuid(), name: 'apples', checked: false},
    {id: cuid(), name: 'oranges', checked: false},
    {id: cuid(), name: 'milk', checked: true},
    {id: cuid(), name: 'bread', checked: false}
  ],
  hideCompleted: false,
  searchCompleted: null
};
  
  
function generateItemElement(item) {
  return `
      <li data-item-id="${item.id}">
        <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}" contenteditable="true">${item.name}</span>
        <div class="shopping-item-controls">
          <button class="shopping-item-toggle js-item-toggle">
              <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
              <span class="button-label">delete</span>
          </button>
        </div>
      </li>`;
}
  
  
function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  
  const items = shoppingList.map((item) => generateItemElement(item));
    
  return items.join('');
}
  
  
function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  let filteredItems = [...STORE.items];
  
  if (STORE.hideCompleted) {
    filteredItems = filteredItems.filter(item => !item.checked);
  }

  $('.js-shopping-list-search-entry').val(STORE.searchTerm);
  if (STORE.searchCompleted) {
    filteredItems = filteredItems.filter(item => item.name.includes(STORE.searchTerm));
  }

  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}
  
  
function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({id: cuid(), name: itemName, checked: false});
}
  
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}
  
function toggleCheckedForListItem(itemId) {
  console.log('Toggling checked property for item with id ' + itemId);
  const item = STORE.items.find(item => item.id === itemId);
  item.checked = !item.checked;
}
  
  
function getItemIdFromElement(item) {
  return $(item)
    .closest('li')
    .data('item-id');
}
  
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    renderShoppingList();
  });
}
  

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click','.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const delID = getItemIdFromElement(event.currentTarget);
    const delIndex = STORE.items.map(x => x.id).indexOf(delID);
    STORE.items.splice(delIndex,1);
    renderShoppingList();
  }); 
}

// Toggles the STORE.hideCompleted property
function toggleHideFilter() {
  STORE.hideCompleted = !STORE.hideCompleted;
}
  
// Places an event listener on the checkbox for hiding completed items
function handleToggleHideFilter() {
  $('.js-hide-completed-toggle').on('click', () => {
    toggleHideFilter();
    renderShoppingList();
  });
}

// Toggle the STORE.searchCompleted property
function setSearchFilter(searchTerm) {
  STORE.searchCompleted = searchTerm;
}

//Places an event listener on the search button
function handleNewSearch() {
  $('#js-shopping-list-search-form').on('submit', event => {
    event.preventDefault();
    console.log('`handleNewSearch` ran');
    const searchTerm = $('.js-shopping-list-search-entry').val();
    setSearchFilter(searchTerm);
    renderShoppingList();
  });
}
//Places an event listener on the clear button
function clearSearch() {
  $('#js-shopping-list-search-form').click( () => {
    setSearchFilter('');
    renderShoppingList();    
  });
}
// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideFilter();
  handleNewSearch();
  clearSearch();
}
  
// when the page loads, call `handleShoppingList`
$(handleShoppingList);