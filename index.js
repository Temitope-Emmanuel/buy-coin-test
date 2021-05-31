// Select the image tags
const avatarDisplay = document.querySelectorAll(".profile-Image");
// Select containing bio for profile detail
const ownerDetail = document.querySelector(".repo-owner");
// To display thr extra owner detail
const followingAmount = document.querySelector("#following-amount");
const followerAmount = document.querySelector("#follower-amount");
const starredAmount = document.querySelector("#starredAmount");
const locationDetail = document.querySelector("#location-detail");

// Form selector
const formInput = document.querySelector("#input-field")
const formButton = document.querySelector("#submit-form")

// Select display for the amount of repo
const repoAmount = document.querySelectorAll(".repo-amount");

// Get Tag to display mini detail
const miniDetail = document.querySelector(".mini-detail");

// Main Repo container
const mainRepoContainer = document.querySelector("#repo-main-container")

const newContainer = ({
  repoName,
  primaryLanguage,
  likeAmount,
  branchAmount,
  date,
  languageColor
}) =>  `<li class="repo-container" >
<div>
    <h4 class="repo-name" >
        ${repoName}
    </h4>
    <button>
        <i class="far fa-star"></i>
        <p>Star</p>
    </button>
</div>
<div>
    <span>
        <span class="language-color" style="background-color: ${languageColor};" ></span>
        <p class="primary-language" >
            ${primaryLanguage}
        </p>
    </span>
    <span >
        <i class="far fa-star"></i>
        <p class="like-amount">
            ${likeAmount}
        </p>
    </span>
    <span>
        <i class="fas fa-code-branch"></i>
        <p class="branch-amount" >
            ${branchAmount}
        </p>
    </span>
    <span class="update-date" >
        ${date}
    </span>
</div>
</li>`;

const addElementToDom = (payload) => {
  const repositories = payload.data.user.repositories.edges;
  const repositoriesAmount = payload.data.user.repositories.edges.length;
  ownerDetail.children[0].textContent = payload.data.user.name;
  ownerDetail.children[1].textContent = payload.data.user.login;
  miniDetail.children[1].textContent = payload.data.user.login;
  ownerDetail.children[2].textContent = payload.data.user.bio;
  followingAmount.textContent = payload.data.user.following.totalCount;
  followerAmount.textContent = payload.data.user.followers.totalCount;
  starredAmount.textContent =
    payload.data.user.starredRepositories.totalCount;
  locationDetail.textContent = payload.data.user.location;
  mainRepoContainer.innerHTML = ""
  const fragmentContainer = document.createDocumentFragment()
  new Array(20).fill(newContainer).map((item,idx) => {
    const date = new Date(repositories[idx].node.updatedAt)
    .toDateString()
    .split(" ")
    const myFragment = document.createRange().createContextualFragment(item({
      repoName:repositories[idx].node.name,
      primaryLanguage:repositories[idx].node.primaryLanguage?.name || "",
      languageColor:repositories[idx].node.primaryLanguage?.color || "blue",
      likeAmount:repositories[idx].node.stargazerCount,
      branchAmount:repositories[idx].node.forkCount,
      date:`Updated on ${date[2]} ${date[1]}`
    }))
    fragmentContainer.appendChild(myFragment)
  })
  mainRepoContainer.appendChild(fragmentContainer)


  // For setting the image src attr
  for (let i = 0; i < avatarDisplay.length; i++) {
    avatarDisplay[i].setAttribute("src", payload.data.user.avatarUrl);
  }

  // For setting the number being pulled
  for (let i = 0; i < repoAmount.length; i++) {
    repoAmount[i].innerHTML = repositoriesAmount;
  }
}

const getApiRequest = (username = "Temitope-Emmanuel") => {
  const url = "https://api.github.com/graphql";
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer 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`,
    },
    body: JSON.stringify({
      query: `{
                user(login:"${username}"){
                  name
                  login
                  avatarUrl
                  bio
                  followers{
                    totalCount
                  }
                  following{
                    totalCount
                  }
                  location
                  starredRepositories{
                    totalCount
                  }
                  repositories(first:20){
                    edges{
                      node{
                        name
                        updatedAt
                        forkCount
                        stargazerCount
                        primaryLanguage{
                          color
                          name
                        }
                      }
                    }
                  }
                }
            }`,
    }),
  })
    .then((response) => response.json())
    .then(addElementToDom)
  .catch(err => alert(err))
};

const submitForm = () => {
  getApiRequest(formInput.value)
}


formButton.addEventListener('click',submitForm)
formInput.addEventListener("keypress",(e) => {
  if(e.keyCode === 13){
    console.log("calling this func")
    submitForm()
  }
})

document.addEventListener("scroll", function () {
  // const el = document.getElementById("Navigation");
  // let rect = el.getBoundingClientRect();
  let rect = miniDetail.getBoundingClientRect();
  if (rect.top <= 0) {
    miniDetail.classList.add("show");
  } else {
    miniDetail.classList.remove("show");
  }
});

getApiRequest("Temitope-Emmanuel")