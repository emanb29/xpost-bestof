let storedSubreddit;

let snoo;

chrome.contextMenus.onClicked.addListener((event) => {
  let link = event.linkUrl;
  fetch(link + ".json").then((resp) =>
    resp.json().then((data) => {
      let originalId = data[0].data.children[0].data.name;
      console.log("clicked.", originalId);
      let original = snoo.getSubmission(originalId);
      original.title.then((title) => {
        original.subreddit.display_name.then((originalSub) => {
          console.log(original);
          let titleSafe;
          if (title.length < 300 - (" (x-)".length + originalSub.length)) {
            titleSafe = title + " (x-" + originalSub + ")";
          } else {
            titleSafe = title;
          }
          original
            .submitCrosspost({
              subredditName: storedSubreddit,
              title: titleSafe,
            })
            .permalink.then((newPostUrl) => {
              chrome.tabs.create({
                url: "https://reddit.com" + newPostUrl,
                active: false,
              });
            });
        });
      });
    })
  );
});

let updateContextMenu = () => {
  chrome.contextMenus.removeAll(() => {
    chrome.storage.sync.get(
      {
        subreddit: "",
      },
      ({ subreddit }) => {
        storedSubreddit = subreddit;
        console.log("settings loaded. Sub:", storedSubreddit);
        chrome.contextMenus.create({
          id: "ctxMenu",
          title: `Share as best of to /r/${subreddit}`,
          contexts: ["link"],
          documentUrlPatterns: ["*://*.reddit.com/*", "*://reddit.com/*"],
          targetUrlPatterns: ["*://*.reddit.com/r/*", "*://reddit.com/r/*"],
          visible: true,
        });
      }
    );
  });
};

let setupSnoo = (callback) => {
  chrome.storage.sync.get(
    {
      name: "",
      id: "",
      secret: "",
      user: "",
      pass: "",
    },
    ({ name, id, secret, user, pass }) => {
      snoo = new window.snoowrap({
        userAgent: `chrome-ext:bestof:v0.0.1 (${name} operated by ${user}) (by /u/BeardedCrake)`,
        clientId: id,
        clientSecret: secret,
        username: user,
        password: pass,
      });
      try {
        callback(snoo);
      } catch (e) {}
    }
  );
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: "../src/options/index.html" });
  updateContextMenu();
  setupSnoo();
});
chrome.storage.onChanged.addListener((_changes, area) => {
  if (area == "sync") {
    updateContextMenu();
    setupSnoo();
  }
});
