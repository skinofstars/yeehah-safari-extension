import { store } from "./user-defaults-store";

/**
 * Example
 */

// (() => {
console.log("yeehah!!!! 🤠");

// set
setTimeout(async () => {
  console.log("test set - 'blah blah' to store 'testItem'");
  await store().setItem("testItem", "blah blah");
}, 5000);

// get
setTimeout(async () => {
  const testItem = await store().getItem("testItem");
  console.log("test get", testItem);
}, 10000);

// remove
setTimeout(async () => {
  await store().removeItem("testItem");
  console.log("test remove ... check local storage");
}, 15000);

// get removed
setTimeout(async () => {
  const testItem = await store().getItem("testItem");
  console.log("test get after removed", testItem);
}, 17000);
// })();
