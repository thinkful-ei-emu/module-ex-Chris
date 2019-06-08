
/* eslint-disable no-console */
'use strict';

/*eslint-env jquery*/

const STORE = {
  items: [
    {id: cuid(), name: 'apples', checked: false, beingEdited: false},
    {id: cuid(), name: 'oranges', checked: false, beingEdited: false},
    {id: cuid(), name: 'milk', checked: true, beingEdited: false},
    {id: cuid(), name: 'bread', checked: false, beingEdited: false}
  ],
  hideCompleted: false,
  searchEntry: null
};
  
/**
 * For the name change, the question becomes, how do we grab the edited name?
 * This should happen in the generateItemElement section as this is where the
 * name is initially generated as well. 
 */
function generateItemElement(item) {
  let itemTitleName;
  if (item.beingEdited) {
    itemTitleName = `
      <form id="edit-name-form">
        <input type="text" name="edit-name" class="js-edit-name" value="${item.name}" />
      </form>`;
  }
  else {
    itemTitleName = 
    `<span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>`;
  }
  return `
      <li data-item-id="${item.id}">
        ${itemTitleName}
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

  $('.js-shopping-list-search-entry').val(STORE.searchEntry);
  if (STORE.searchEntry) {
    filteredItems = filteredItems.filter(item => item.name.includes(STORE.searchEntry));
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

// Toggle the STORE.searchEntry property
function setSearchEntry(searchEntry) {
  STORE.searchEntry = searchEntry;
}

//Places an event listener on the search button
function handleNewSearch() {
  $('#js-search-form').on('submit', event => {
    event.preventDefault();
    console.log('`handleNewSearch` ran');
    const searchEntry = $('.js-search-entry').val();
    setSearchEntry(searchEntry);
    renderShoppingList();
  });
}
//Places an event listener on the clear button
function handleClearSearch() {
  $('#reset').on('click', () => {
    setSearchEntry('');
    renderShoppingList();    
  });
}
/**
 * Once we click on the text, we want the system to recognize that we are going to be
 * manipulating that information on the page. We need to alter the current state of
 * the object. This has to be done for each one individually like when we did the check
 * and uncheck.
 */
function itemBeingEdited (itemId, beingEdited) {
  const targetItem = STORE.items.find(item => item.id === itemId);
  targetItem.beingEdited = beingEdited;
}

// Place an event listener on an item name to set to editing mode
function handleItemNameClick() {
  $('.js-shopping-list').on('click', '.js-shopping-item', event => {
    const id = getItemIdFromElement(event.target);//recognize the id of the clicked object
    itemBeingEdited(id,true);
    renderShoppingList();
  });
}

/**
 * Now that we are in the process of submitting the edit, we need to make sure the object
 * resets itself to it's original state without altering the text edits.
 */
function editedName(itemId, nameEdit) {
  const targetItem = STORE.items.find(item => item.id === itemId);
  targetItem.name = nameEdit;
}

// Place an event listener on the edit item name form and
//ultimately setting the id back to false after the process has ran.
function handleEditItemForm() {
  $('.js-shopping-list').on('submit', '#edit-name-form', event => {
    event.preventDefault();
    const id = getItemIdFromElement(event.target);
    const nameChange = $('.js-edit-name').val();
    editedName(id, nameChange);
    itemBeingEdited(id,false);
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
  handleClearSearch();
  handleItemNameClick();
  handleEditItemForm();
}
  
// when the page loads, call `handleShoppingList`
$(handleShoppingList);