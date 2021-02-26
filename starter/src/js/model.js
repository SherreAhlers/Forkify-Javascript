///////////////////////////////
// LECTURE

import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';

import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    //   `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    // const data = await res.json();

    // if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    // console.log(state.recipe);
  } catch (err) {
    //   temporary error hadling
    console.error(`${err} !!!`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await getJSON(
      //   `https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza`
      `${API_URL}?search=${query}`
    );
  } catch (err) {
    console.error(`${err} !!!`);
    throw err;
  }
};
// loadSearchResults('pizza');
