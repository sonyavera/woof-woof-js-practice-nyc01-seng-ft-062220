document.addEventListener('DOMContentLoaded', function(e) {
const pupsUrl = 'http://localhost:3000/pups/'
const dogBar = document.getElementById("dog-bar")
const dogInfo = document.getElementById("dog-info")
const goodDogFilter = document.getElementById("good-dog-filter")
let pupData = {}
let filterGoodDogs = false


    const getDogs = () => {
        fetch(pupsUrl)
        .then(resp => resp.json())
        .then(pups => {
            pups.forEach(renderDogBar)
            pupData = pups
        })
    }

    const renderDogBar = (pupObj) => {
        const dogSpan = document.createElement("span")
        dogSpan.classList.add("dog-span")
        dogSpan.id = pupObj.id
        dogSpan.innerHTML = `${pupObj.name}`
        dogBar.append(dogSpan)
    }
    
    
    const toggleDog = (dogId) => {
        const dogIndex = parseInt(dogId) - 1
        const dog = pupData[dogIndex]
        const option = {
                method: "PATCH",
                headers: {
                  "content-type": "application/json",
                  "accept": "application/json"
                },
                body: JSON.stringify({ isGoodDog: !dog.isGoodDog})
              };
        fetch(pupsUrl + dogId, option)
        .then(response => response.json())
        .then(resp => {
            renderPupFromJson(resp)
            pupData[dogIndex]= resp
        })
    }
    
    const renderPupFromJson = (pupObj) => {
        document.querySelectorAll(".dog").forEach(ele => ele.remove())
        const dogImg = document.createElement("img"); //for next time create this in HTML so that you dont have to add and destroy these elements each time
        const dogName = document.createElement("H2");
        const dogButton = document.createElement("button");
        dogButton.classList.add('dog')
        dogImg.classList.add('dog')
        dogName.classList.add('dog')
        dogButton.id = pupObj.id 
        dogImg.src = pupObj.image
        dogName.innerText = `${pupObj.name}`
        if(pupObj.isGoodDog === true){
            dogButton.innerText = `Good Dog!`
        } else if (pupObj.isGoodDog === false){
            dogButton.innerText = `Bad Dog!`
        }
        dogInfo.append(dogImg, dogName, dogButton)
        dogButton.addEventListener("click", (e) => {
            toggleDog(e.target.id)
        })
    }

    const renderPupInfo = (e) => {
        const pup = pupData[parseInt(e.target.id) - 1]
        renderPupFromJson(pup)
    }
    
    dogBar.addEventListener("click", renderPupInfo)
    

    goodDogFilter.addEventListener("click", (e) => {
        filterGoodDogs = !filterGoodDogs
        if(filterGoodDogs === true){
            goodDogFilter.innerText = `Filter good dogs: ON`
            const goodDogs = pupData.filter(pup => pup.isGoodDog == true)
            document.querySelectorAll(".dog-span").forEach(ele => ele.remove())
            goodDogs.forEach(renderDogBar)
        } else if (filterGoodDogs === false){
            goodDogFilter.innerText = `Filter good dogs: OFF`
            document.querySelectorAll(".dog-span").forEach(ele => ele.remove())
            pupData.forEach(renderDogBar)
        }
    })



getDogs()
})