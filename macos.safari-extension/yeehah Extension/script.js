/**
 * This is pretty much the basis of the interactions
 */

// safari.extension.dispatchMessage("UDSetItem", { key: "userId", value: "XXX" });
// safari.extension.dispatchMessage("UDGetItem", { key: "userId" });
// safari.extension.dispatchMessage("UDRemoveItem", { key: "userId" });

// safari.self.addEventListener("message", (messageEvent) => {
//   const { message, name } = messageEvent;
//   if (name === "UDGetItem") {
//     const { key, value } = Object.keys(message)[0];
//     window.localStorage.setItem(key, value);
//   }
//   // TODO implement UDSetItem and UDRemoveItem
// });

/**
 * Storage API similar to localStorage, but returns a promise
 */

const storeAction = (action, actionMessage) => {
  const result = new Promise((resolve, reject) => {
    // IDEA - pass the ID to the backend and return it from there with the result,
    // You can then use the ID in a requests Set, avoiding race conditions.

    // DEBUG - an ID is useful to track events. Use with consoles below.
    // const id = Math.floor(Math.random() * 1000);

    // console.log("the action", id, action, actionMessage);

    let complete = false;

    // IDEA - try localStorage first?

    safari.extension.dispatchMessage(action, actionMessage);

    const listener = safari.self.addEventListener("message", (messageEvent) => {
      const { message, name } = messageEvent;

      // console.log("the message", id, name, message);

      if (name === action) {
        const { key: UDKey, value: UDValue } = message;

        if (UDKey === actionMessage.key) {
          if (action === "UDGetItem" || action === "UDSetItem") {
            window.localStorage.setItem(UDKey, UDValue);
            complete = true;
            resolve(UDValue);
          }
          if (action == "UDRemoveItem") {
            window.localStorage.removeItem(UDKey);
            complete = true;
            resolve();
          }
        }
      }
    });

    // give up after a couple of seconds
    setTimeout(() => {
      // not 100% sure on removing the listener through removeEventListener
      // trying to avoid race condition, but would it remove other listeners?
      // safari.self.removeEventListener("message");

      // Maybe...
      delete listener;

      if (!complete) {
        reject();
      }
    }, 2000);
  });

  return result;
};

const store = () => {
  return {
    getItem: (key) => {
      return storeAction("UDGetItem", { key });
    },
    setItem: (key, value) => {
      return storeAction("UDSetItem", { key, value });
    },
    removeItem: (key) => {
      return storeAction("UDRemoveItem", { key });
    },
  };
};

/**
 * Example
 */

(() => {
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
})();
