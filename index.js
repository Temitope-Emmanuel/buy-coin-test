// require('isomorphic-unfetch')
const PERSONAL_TOKEN = "c9ee36974b3bf4c57b08eb00dd3a1fda451a59d8"


// Select the image tags
const avatarDisplay = document.querySelectorAll(".profile-Image")
// Select containing bio for profile detail
const ownerDetail = document.querySelector(".repo-owner")
// Select display for the amount of repo
const repoAmount = document.querySelectorAll(".repo-amount")

// Get Tag to display mini detail 
const miniDetail = document.querySelector(".mini-detail")
// Select tag to display the repo detail

const repoNames = document.querySelectorAll(".repo-name")
const primaryLanguages = document.querySelectorAll(".primary-language")
const languageColor = document.querySelectorAll(".language-color")
const likeAmounts = document.querySelectorAll(".like-amount")
const branchAmonuts = document.querySelectorAll(".branch-amount")
const updateDates = document.querySelectorAll(".update-date")


const getApiRequest = () => {
  const url = 'https://api.github.com/graphql'
      fetch(url,{
          method:"POST",
          headers:{
              'Authorization':`Bearer 64f798f88d9b55df41fee1fee72397183b981f7a`
          },
          body:JSON.stringify({
              query:`{
                viewer{
                  name
                  login
                  avatarUrl
                  bio
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
            }`
          })
      })
    .then(response => response.json())
    .then(payload => {
      const repositories = payload.data.viewer.repositories.edges
      const repositoriesAmount = payload.data.viewer.repositories.edges.length
      ownerDetail.children[0].textContent = payload.data.viewer.name
      ownerDetail.children[1].textContent = payload.data.viewer.login
      miniDetail.children[1].textContent = payload.data.viewer.login
      ownerDetail.children[2].textContent = payload.data.viewer.bio
      
      // For setting the image src attr
      for(let i = 0; i < avatarDisplay.length ; i++){
        avatarDisplay[i].setAttribute("src",payload.data.viewer.avatarUrl)
      }
      
      // For setting the number being pulled 
      for(let i = 0; i < repoAmount.length ; i++){
        repoAmount[i].innerHTML = repositoriesAmount
      }
      
      //For setting the details about the repo 
      for(let i = 0; i < repoNames.length;i++){
        // console.log(repositories[i].node.primaryLanguage.name)
        const date = new Date(repositories[i].node.updatedAt).toDateString().split(" ")
        repoNames[i].textContent = repositories[i].node.name
        // To check if the primary language func is null
        if(repositories[i].node.primaryLanguage){
          primaryLanguages[i].textContent = repositories[i].node.primaryLanguage.name || ""
          languageColor[i].style.backgroundColor = repositories[i].node.primaryLanguage.color
        }else{
          languageColor[i].style.display = "none"
          primaryLanguages[i].style.display = "none"
        }
        likeAmounts[i].textContent = repositories[i].node.stargazerCount
        branchAmonuts[i].textContent = repositories[i].node.forkCount
        updateDates[i].textContent = ` Updated on ${date[2]} ${date[1]}`
      }      
    })
    // .catch(err => alert(err))

}

getApiRequest()

document.addEventListener("scroll", function() {
  // const el = document.getElementById("Navigation");
  // let rect = el.getBoundingClientRect();
  let rect = miniDetail.getBoundingClientRect();
  if (rect.top <= 0) {
    miniDetail.classList.add("show");
  } else {
    miniDetail.classList.remove("show");
  }
});