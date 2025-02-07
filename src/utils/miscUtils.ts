export const findIndexIn2D = (value: number, arr: number[][]) => {
  let x = -1;
  let y = -1;

  x = arr.findIndex((e) => e.includes(value));
  y = arr?.[x]?.findIndex((e) => e == value);

  return { x, y };
};

export const normalizeAngle = (angle: number): number => {
  angle %= 360;
  if (angle < 0) {
    angle += 360;
  }
  return angle;
};

export const degToRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export const dispatchMessage = (eventType: string = "game-ended"): void => {
  const messageChannel = (window as any).gameData;
  if (messageChannel) messageChannel.postMessage(JSON.stringify({ eventType }));
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const filterHiddenCodeAndAwait = (inputCode: string): string => {
  const hiddenCodeRegex = /\/\/ HIDDEN_CODE_START[\s\S]*?\/\/ HIDDEN_CODE_END/g;
  const awaitRegex = /await\s/g;

  // Filter hidden code blocks, await keyword and blank lines
  let filteredCode = inputCode.replace(hiddenCodeRegex, "");
  filteredCode = filteredCode.replace(awaitRegex, "");

  return filteredCode.trim();
};

export const pickKeys = (obj: any, keys = []) => {
  const newOBj = {};
  Object.entries(obj).forEach(([key, val]) => {
    // @ts-ignore
    if (keys.includes(key)) newOBj[key] = val;
  });
  return newOBj;
};

export const objKeysChanged = (obj1: any, obj2: any, keys: any) => {
  let o1 = {},
    o2 = {};
  for (let key of keys) {
    // @ts-ignore
    o1[key] = obj1[key];
    // @ts-ignore
    o2[key] = obj2[key];
  }
  return JSON.stringify(o1) !== JSON.stringify(o2);
};

export const getProxyUrl = (url: any) => `http://localhost:8080/${url}`;

export function detectOS() {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
  const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
  const iosPlatforms = ["iPhone", "iPad", "iPod"];
  let os = null;

  if (macosPlatforms.includes(platform)) {
    os = "Mac OS";
  } else if (iosPlatforms.includes(platform)) {
    os = "iOS";
  } else if (windowsPlatforms.includes(platform)) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (/Linux/.test(platform)) {
    os = "Linux";
  } else if (/CrOS/.test(userAgent)) {
    os = "Chrome OS";
  }

  return os;
}
