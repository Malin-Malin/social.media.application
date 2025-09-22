// Reusable save(), load(), remove() functions

/**
 * Saves a given value to the given key in localStorage
 * @param {string} key 
 * @param {string} value 
 * @example 
 * 
 js

 * // on save
 * const enteredText = textboxElement.innerText
 * save('previouslyEnteredText', enteredText);
 * 
 */
export function save(key, value) {
    localStorage.setItem(key, value);    
}

/**
 * 
 * @param {string} key 
 * @returns 
 * @example
 * 
 js
 * 
 * // on reload
 * const enteredText = load('previouslyEnteredText');
 * textboxElement.innerText = enteredText;
 * 
 */
export function load(key, parse = false) {
    let result = localStorage.getItem(key);

    if (parse && result) {
        result = JSON.parse(result);
    }
    
    return result;
}

/**
 * 
 * @param {string} key
 * @example
 * 
 
js
 * remove('previouslyEnteredText');
 */
export function remove(key) {
    localStorage.removeItem(key)
}