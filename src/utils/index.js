export const getRandomInteger = (
  min = 0,
  max = 100,
) =>
  Math.floor(Math.random() * (max - min + 1)) +
  min;

export const getRandomNumber = (
  min = 0,
  max = 100,
) => Math.random() * (max - min + 1) + min;

export const getRandomData = (
  length = getRandomInteger(25, 50),
) => {
  const randomData = [];

  for (let x = 0; x < length; x += 1) {
    const m = getRandomInteger(-10, 10);
    const c = getRandomInteger(-10, 10);
    randomData.push([x, m * x + c]);
  }

  return randomData;
};

export const getRandomColor = () =>
  `rgba(${getRandomInteger(
    0,
    255,
  )}, ${getRandomInteger(
    0,
    255,
  )}, ${getRandomInteger(0, 255)}, 1)`;

export const createCopy = (obj) => {
  if (
    typeof obj === 'object' ||
    obj instanceof Array
  ) {
    return JSON.parse(JSON.stringify(obj));
  }

  return obj;
};

export const getStringHash = (s) => {
  let h;

  for (let i = 0; i < s.length; i += 1) {
    h = Math.imul(31, h) + s.charCodeAt(i) || 0;
  }

  return h.toString();
};

export const shuffleArray = arr =>
  arr.sort(() => 0.5 - Math.random());

export const compareArrays = (arr1, arr2) => {
  if (arr1.length === arr2.length) {
    for (
      let i = 0, len1 = arr1.length;
      i < len1;
      i += 1
    ) {
      let valid = false;

      for (
        let j = 0, len2 = arr2.length;
        j < len2;
        j += 1
      ) {
        if (arr1[i] === arr2[j]) {
          valid = true;
          break;
        }
      }

      if (valid === false) {
        return false;
      }
    }

    return true;
  }

  return false;
};
