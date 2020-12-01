chrome.storage.sync.get(
  {
    name: "",
    id: "",
    secret: "",
    subreddit: "",
    user: "",
    pass: "",
  },
  (savedSettings) => {

    let inputAppName = document.getElementById("appName");
    let inputId = document.getElementById("appId");
    let inputSecret = document.getElementById("secret");
    let inputSubreddit = document.getElementById("subreddit");
    let inputUser = document.getElementById("user");
    let inputPass = document.getElementById("pass");

    inputAppName.value = savedSettings.name;
    inputId.value = savedSettings.id;
    inputSecret.value = savedSettings.secret;
    inputSubreddit.value = savedSettings.subreddit;
    inputUser.value = savedSettings.user;
    inputPass.value = savedSettings.pass;


    document.getElementById("settings").onsubmit = (e) => {
      e.preventDefault();
      e.stopPropagation();

      let name = inputAppName.value;
      let id = inputId.value;
      let secret = inputSecret.value;
      let subreddit = inputSubreddit.value;
      let user = inputUser.value;
      let pass = inputPass.value;
      console.log("Got settings", { name, id, secret, subreddit, user, pass });

      chrome.storage.sync.set({name, id, secret, subreddit, user, pass})
      return true;
    };
    console.log("loaded. prev settings next. reload all reddit tabs to apply.", savedSettings);
  }
);
