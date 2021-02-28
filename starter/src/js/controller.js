import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationViews.js';
import bookmarksView from './views/bookmarksViews.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('ðŸ’¥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

// import * as model from './model.js';
// import recipeView from './views/recipeView.js';
// import searchView from './views/SearchView.js';
// import resultsView from './views/resultsView.js';

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// const controlRecipes = async function () {
//   try {
//     const id = window.location.hash.slice(1);

//     if (!id) return;
//     recipeView.renderSpinner();

//     // 1) Loading recipe
//     await model.loadRecipe(id);

//     // 2) Rendering recipe
//     recipeView.render(model.state.recipe);
//   } catch (err) {
//     recipeView.renderError();
//   }
// };

// const controlSearchResults = async function () {
//   try {
//     resultsView.renderSpinner();
//     // console.log(resultsView);

//     // 1) Get search query
//     const query = searchView.getQuery();
//     if (!query) return;

//     // 2) Load search results
//     await model.loadSearchResults(query);

//     // 3) Render results
//     // console.log(model.state.search.results);
//     resultsView.render(model.state.search.results);
//   } catch (err) {
//     console.log(err);
//   }
// };
// // controlSearchResults();

// const init = function () {
//   recipeView.addHandlerRender(controlRecipes);
//   searchView.addHandlerSearch(controlSearchResults);
// };
// init();

///////////////////////////////////////
// LECTURE
// https://forkify-api.herokuapp.com/v2

// import * as model from './model.js';
// import recipeView from './views/recipeView.js';

// import icons from '../img/icons.svg' // Parcel 1
// import icons from 'url:../img/icons.svg'; // Parcel 2
// console.log(icons);

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// import { async } from 'regenerator-runtime';

// const recipeContainer = document.querySelector('.recipe');

// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

// console.log('TEST');
// const renderSpinner = function (parentEl) {
//   const markup = `
//     <div class="spinner">
//       <svg>
//         <use href="${icons}#icon-loader"></use>
//       </svg>
//     </div>
//         `;
//   parentEl.innerHTML = '';
//   parentEl.insertAdjacentHTML('afterbegin', markup);
// };

// const controlRecipes = async function () {
// try {
// const id = window.location.hash.slice(1);
// console.log(id);

// if (!id) return;
// this is a guard clause -- if there is no id return immediatly
// recipeView.renderSpinner();

// 1) Loading Recipe
// await model.loadRecipe(id);
// this is an async function that will return a promise.

// const { recipe } = model.state;

// Rendering recipe
// recipeView.render(model.state.recipe);

// const res = await fetch(
//   `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
//   // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcb34' // this is a specific recipe
// );
// const data = await res.json();
// // this is available on all resonse objects

// if (!res.ok) throw new Error(`${data.message} (${res.status})`);

// // console.log(res, data);

// let { recipe } = data.data;
// recipe = {
//   id: recipe.id,
//   title: recipe.title,
//   publisher: recipe.publisher,
//   sourceUrl: recipe.source_url,
//   image: recipe.image_url,
//   servings: recipe.servings,
//   cookingTime: recipe.cooking_time,
//   ingredients: recipe.ingredients,
// };
// console.log(recipe);

// const markup = `
//     <figure class="recipe__fig">
//       <img src="${recipe.image}" alt="${
//   recipe.title
// }" class="recipe__img" />
//       <h1 class="recipe__title">
//         <span>${recipe.title}</span>
//       </h1>
//     </figure>

//     <div class="recipe__details">
//       <div class="recipe__info">
//         <svg class="recipe__info-icon">
//           <use href="${icons}#icon-clock"></use>
//         </svg>
//         <span class="recipe__info-data recipe__info-data--minutes">${
//           recipe.cookingTime
//         }</span>
//         <span class="recipe__info-text">minutes</span>
//       </div>
//       <div class="recipe__info">
//         <svg class="recipe__info-icon">
//           <use href="${icons}#icon-users"></use>
//         </svg>
//         <span class="recipe__info-data recipe__info-data--people">${
//           recipe.servings
//         }</span>
//         <span class="recipe__info-text">servings</span>

//         <div class="recipe__info-buttons">
//           <button class="btn--tiny btn--increase-servings">
//             <svg>
//               <use href="${icons}#icon-minus-circle"></use>
//             </svg>
//           </button>
//           <button class="btn--tiny btn--increase-servings">
//             <svg>
//               <use href="${icons}#icon-plus-circle"></use>
//             </svg>
//           </button>
//         </div>
//       </div>

//       <div class="recipe__user-generated">
//         <svg>
//           <use href="${icons}#icon-user"></use>
//         </svg>
//       </div>
//       <button class="btn--round">
//         <svg class="">
//           <use href="${icons}#icon-bookmark-fill"></use>
//         </svg>
//       </button>
//     </div>

//     <div class="recipe__ingredients">
//       <h2 class="heading--2">Recipe ingredients</h2>
//       <ul class="recipe__ingredient-list">
//           ${recipe.ingredients
//             .map(ing => {
//               return `
//         <li class="recipe__ingredient">
//           <svg class="recipe__icon">
//             <use href="${icons}#icon-check"></use>
//           </svg>
//           <div class="recipe__quantity">${ing.quantity}</div>
//           <div class="recipe__description">
//             <span class="recipe__unit">${ing.unit}</span>
//             ${ing.description}
//           </div>
//         </li>
//             `;
//             })
//             .join('')}
//     </div>

//     <div class="recipe__directions">
//       <h2 class="heading--2">How to cook it</h2>
//       <p class="recipe__directions-text">
//         This recipe was carefully designed and tested by
//         <span class="recipe__publisher">${
//           recipe.publisher
//         }</span>. Please check out
//         directions at their website.
//       </p>
//       <a
//         class="btn--small recipe__btn"
//         href="${recipe.sourceUrl}"
//         target="_blank"
//       >
//         <span>Directions</span>
//         <svg class="search__icon">
//           <use href="${icons}#icon-arrow-right"></use>
//         </svg>
//       </a>
//     </div>
//     `;
// recipeContainer.innerHTML = '';
// recipeContainer.insertAdjacentHTML('afterbegin', markup);
// } catch (err) {
// recipeView.renderError();
// console.log(err);
// }
// };

// controlRecipes();
// // this will output:
// Response {type: "cors", url: "https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886", redirected: false, status: 200, ok: true, …} {status: "success", data: {…}}

// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipes)
// );

// the above code is like having these two lines of code below

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);

// const init = function () {
//   recipeView.addHandlerRender(controlRecipes);
// };
// init();
