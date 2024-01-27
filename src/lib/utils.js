import { PUBLIC_POCKETBASE_URL } from '$env/static/public'  
import gamesData from './games.json';
export const serializeNonPOJOs = (obj) => {
    return structuredClone(obj)
}

export const generateUsername = (name) => {
    const id = Math.floor(Math.random() * 10000)
    return `${name.slice(0, 5)}${id}`
}

export const getImageURL = (collectionId, recordId, fileName, size = '0x0') => {
    return `${PUBLIC_POCKETBASE_URL}api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`
}

 
export const  formBody = (body) => {
    return [...body.entries()].reduce((data, [k, v]) => {
      let value = v;
      if (v === "true") value = true;
      if (v === "false") value = false;
      if (v === "on") value = true;
      if (!isNaN(Number(v))) value = Number(v);
  
      // For grouped fields like multi-selects and checkboxes, we need to
      // store the values in an array.
      if (k in data) {
        const val = data[k];
        value = Array.isArray(val) ? [...val, value] : [val, value];
      }
  
      data[k] = value;
  
      return data;
    }, {});
  }

export const isPowerOfTwo = (n) => {
    // Check if n is zero or negative, which are not powers of 2 
    if (n <= 0) {
      return false;
    }
    // Check if n and n - 1 have any common bits using bitwise AND
    return (n & (n - 1)) === 0;
    }

  export const getGameName = (key, defaultValue = 'Unknown game type') => { 
      const games = gamesData.games;
      const game = games.find(game => game.value === key);
      return game ? game.name : defaultValue;
  };
  