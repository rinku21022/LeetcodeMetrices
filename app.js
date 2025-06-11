document.addEventListener("DOMContentLoaded",function (){

const searchBtn = document.getElementById("search-btn")
const usernameInput = document.getElementById("user-input")
const  statsContainer = document.querySelector(".stats-container")
const  easyProgressCircle = document.querySelector(".easy-progress")
const  mediumProgressCircle = document.querySelector(".medium-progress")
const  hardProgressCircle = document.querySelector(".hard-progress")
const  statsCard = document.querySelector(".stats-card")
const  easyLabel = document.getElementById("easy-label")
const  mediumLabel = document.getElementById("medium-label")
const  hardLabel = document.getElementById("hard-label")





   

    async function fetchUserDetails(username){

        try{
            searchBtn.textContent = "Searching..."
            searchBtn.disabled = true;

            const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the user details")
            }
            const ParsedData = await response.json();
            console.log("Logging Data: ",ParsedData);

            displayUserData(ParsedData);
        }
        catch(err){
            statsContainer.innerHTML = `<p>Data does not found.</p>`
        }
        finally{
            searchBtn.textContent = "Search"
            searchBtn.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved / total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent = `${solved} / ${total}`;

    }


    function displayUserData(ParsedData){

        const totalQuestions = ParsedData.totalQuestions;
        const totalEasyQuestions = ParsedData.totalEasy;
        const totalMediumQuestions = ParsedData.totalMedium;
        const totalHardQuestions = ParsedData.totalHard;

        const solvedTotalQues = ParsedData.totalSolved;
        const solvedTotalEasyQues = ParsedData.easySolved;
        const solvedTotalMediumQues = ParsedData.mediumSolved;
        const solvedTotalHardQues = ParsedData.hardSolved;

        updateProgress(solvedTotalEasyQues,totalEasyQuestions,easyLabel,easyProgressCircle);
        updateProgress(solvedTotalMediumQues,totalMediumQuestions,mediumLabel,mediumProgressCircle);
        updateProgress(solvedTotalHardQues,totalHardQuestions,hardLabel,hardProgressCircle);

        // calculaate Submissions
        const totalSolved = ParsedData.totalSolved;
        const easySolved = ParsedData.easySolved;
        const mediumSolved = ParsedData.mediumSolved;
        const hardSolved = ParsedData.hardSolved;

        const totalSubmissions = Object.values(ParsedData.submissionCalendar).reduce((sum, count) => sum + count, 0);

        const totalEasySubmissions = Math.round((easySolved / totalSolved) * totalSubmissions);
        const totalMediumSubmissions = Math.round((mediumSolved / totalSolved) * totalSubmissions);
        const totalHardSubmissions = Math.round((hardSolved / totalSolved) * totalSubmissions);

       

        const cardsData = [
            { label: "Overall Submissions", value: totalSubmissions },
            { label: "Overall Easy Submissions", value: totalEasySubmissions },
            { label: "Overall Medium Submissions", value: totalMediumSubmissions },
            { label: "Overall Hard Submissions", value: totalHardSubmissions }
        ]
        console.log(cardsData);
        
        statsCard.innerHTML = cardsData.map(
            data => 
                ` <div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                </div> `
        ).join("");
        
    };

function validateUsername(username){

    if(username.trim() === ""){
        alert("Username should not be empty!")
        return false;
    }
    const regex =  /^[a-zA-Z][a-zA-Z0-9_-]{3,15}(?<![-_])$/;
    const isMatching = regex.test(username);
    if(!isMatching){
        alert("Invalid Username")
    }
    return isMatching;

}

searchBtn.addEventListener("click",function(){
    const username = usernameInput.value;
    console.log("logging username is: ",username);
    if(validateUsername(username)){
        fetchUserDetails(username);
    }
    
})


})