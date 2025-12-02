const searchParams = new URLSearchParams(window.location.search);

const initParams = Object.fromEntries(searchParams) as InitParams;

console.log("initParams", initParams);

export { initParams };
