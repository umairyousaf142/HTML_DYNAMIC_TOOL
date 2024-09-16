import { generatePDF } from "./generatePDF.js";


let query = {};
let questions = {};
let ratingText = {
    "1": "Strongly Disagree",
    "2": "Disagree",
    "3": "Somewhat Disagree",
    "4": "Neither Agree nor Disagree",
    "5": "Somewhat Agree",
    "6": "Agree",
    "7": "Strongly Agree"
  };
let AnswerText = {
    "1": "substantial weakness",
    "2": "moderate weakness",
    "3": "slight weakness",
    "4": "neutral",
    "5": "slight strength",
    "6": "moderate strength",
    "7": "substantial strength"
  };
let positiveQuestions = [];
let negativeQuestions = [];
let newData = [];

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the server
    fetch('http://localhost:3000/api/data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Store the data from the server
        newData = data;

        // Populate positive and negative questions arrays
        newData.forEach((item, index) => {
            if (item.isPositive) {
                positiveQuestions.push(index + 1);
            } else {
                negativeQuestions.push(index + 1);
            }
            // Map `query` as `question` and `questions` as `phrase`
            query[`q${index + 1}`] = item.question;
            questions[`q${index + 1}`] = item.phrase;
        });
        // Populate the form with questions
        const form = document.getElementById('assessmentForm');
        newData.forEach((item, index) => {
            const questionNumber = index + 1;
            const questionHTML = `
                <div class="question">
                    <p>${questionNumber}. ${item.question}</p> <!-- Using phrase as the question text -->
                    <table>
                        <tr>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th>5</th>
                            <th>6</th>
                            <th>7</th>
                        </tr>
                        <tr>
                            <td>
                                <div class='radioDiv'>
                                    <input type="radio" name="q${questionNumber}" value="1">
                                    <span>${ratingText[1]}</span>
                                </div>
                            </td>
                            <td>
                                <div class='radioDiv'>
                                    <input type="radio" name="q${questionNumber}" value="2">
                                    <span>${ratingText[2]}</span>
                                </div>
                            </td>
                            <td>
                                <div class='radioDiv'>
                                    <input type="radio" name="q${questionNumber}" value="3">
                                    <span>${ratingText[3]}</span>
                                </div>
                            </td>
                            <td>
                                <div class='radioDiv'>
                                    <input type="radio" name="q${questionNumber}" value="4">
                                    <span>${ratingText[4]}</span>
                                </div>
                            </td>
                            <td>
                                <div class='radioDiv'>
                                    <input type="radio" name="q${questionNumber}" value="5">
                                    <span>${ratingText[5]}</span>
                                </div>
                            </td>
                            <td>
                                <div class='radioDiv'>
                                    <input type="radio" name="q${questionNumber}" value="6">
                                    <span>${ratingText[6]}</span>
                                </div>
                            </td>
                            <td>
                                <div class='radioDiv'>
                                    <input type="radio" name="q${questionNumber}" value="7">
                                    <span>${ratingText[7]}</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            `;
            form.innerHTML += questionHTML;
        });

        // Set up event listeners
        document.getElementById('submitButton').addEventListener('click', calculateScore);
        document.getElementById('generatePDFButton').addEventListener('click', generatePDF);
    })
    .catch(error => console.error('Error fetching data:', error));
});

function calculateScore() {
    document.getElementById("spinner").style.display = "block";

    setTimeout(() => {
        let score = 5;
        const answers = {};

        positiveQuestions.forEach(index => {
            const value = document.querySelector(`input[name="q${index}"]:checked`);
            if (value) {
                const val = parseInt(value.value);
                const normalizedVal = (val - 4) * 1.04;
                score += normalizedVal;
                answers[`q${index}`] = (val - 4) * 33.33;
            }
        });

        negativeQuestions.forEach(index => {
            const value = document.querySelector(`input[name="q${index}"]:checked`);
            if (value) {
                const val = parseInt(value.value);
                const normalizedVal = (4 - val) * 1.04;
                score += normalizedVal;
                answers[`q${index}`] = (4 - val) * 33.33;
            }
        });

        score = Math.max(0, Math.min(10, score)).toFixed(1); // Ensure score stays between 0-10

        document.getElementById("score").innerText = `The provider's readiness score is ${score}`;

        // Determine strengths and weaknesses
        const sortedAnswers = Object.entries(answers).sort((a, b) => b[1] - a[1]);
        const strengths = sortedAnswers.slice(0, 2).map(([key]) => {
            const question = questions[key];
            return `${question}: ${ratingText[Math.round((answers[key] / 33.33) + 4)]}`;
        });
        const weaknesses = sortedAnswers.slice(-2).map(([key]) => {
            const question = questions[key];
            return `${question}: ${ratingText[Math.round((answers[key] / 33.33) + 4)]}`;
        });

        document.getElementById("strengths").innerText = strengths.join('\n');
        document.getElementById("weaknesses").innerText = weaknesses.join('\n');

        // Display bar chart
        const barChart = document.getElementById("barChart");
        const elementPosition = barChart.getBoundingClientRect().top + window.scrollY;

        // Scroll to the element's position smoothly
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth' // This adds a smooth scrolling effect
        });
        barChart.innerHTML = `<div class="axis top">
        <span class="left-span" >-100</span><span class="left-span" >-75</span ><span class="left-span" >-50</span><span class="left-span" >-25</span><span class="center-span" style="width: 0;" >0</span><span class="right-span">25</span><span class="right-span" >50</span><span class="right-span">75</span><span class="right-span">100</span>

        </div>
        <div class="axis bottom">
        <span class="left-span" >-100</span><span class="left-span" >-75</span ><span class="left-span" >-50</span><span class="left-span" >-25</span><span class="center-span" style="width: 0;" >0</span><span class="right-span">25</span><span class="right-span" >50</span><span class="right-span">75</span><span class="right-span">100</span>

        </div>`;
        
        Object.keys(answers).forEach((key) => {
            const value = answers[key];
            const color = value > 0 ? 'green' : 'red';
            const width = Math.abs(value) + "%";
            const positionStyle = value > 0 ? `left: 50%; transform: translateX(0);` : `right: 50%; transform: translateX(0);`;
            let bar =``;
            if(value==0){
                bar = `
                <div>
                <span class='spanQuerry'> (${key.split('q')[1]}) ${questions[key]} (${AnswerText[4]}) </span>
                <div class="axis">
                <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ><div class="half-circle"></div></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
            </div>
                    <div class="bar">
                        <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                    </div>
                    </div>
                `; 
            }
            else if (value==-99.99){
             bar = `
            <div>
            <span class='spanQuerry'>(${key.split('q')[1]})  ${questions[key]} (${AnswerText[1]}) </span>
            <div class="axis">
            <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
        </div>
                <div class="bar">
                    <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                </div>
                </div>
            `;
        }
        else if (value==-66.66){
             bar = `
            <div>
            <span class='spanQuerry'>(${key.split('q')[1]})  ${questions[key]} (${AnswerText[2]}) </span>
            <div class="axis">
            <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
        </div>
                <div class="bar">
                    <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                </div>
                </div>
            `;
        }
        else if (value==-33.33){
             bar = `
            <div>
            <span class='spanQuerry'>(${key.split('q')[1]})  ${questions[key]} (${AnswerText[3]}) </span>
            <div class="axis">
            <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
        </div>
                <div class="bar">
                    <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                </div>
                </div>
            `;
        }
            else if (value==33.33){
             bar = `
            <div>
            <span class='spanQuerry'>(${key.split('q')[1]})  ${questions[key]} (${AnswerText[5]}) </span>
            <div class="axis">
            <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
        </div>
                <div class="bar">
                    <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                </div>
                </div>
            `;
        }
            else if (value==66.66){
             bar = `
            <div>
            <span class='spanQuerry'>(${key.split('q')[1]})  ${questions[key]} (${AnswerText[6]}) </span>
            <div class="axis">
            <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
        </div>
                <div class="bar">
                    <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                </div>
                </div>
            `;
        }
            else if (value==99.99){
             bar = `
            <div>
            <span class='spanQuerry'>(${key.split('q')[1]})  ${questions[key]} (${AnswerText[7]}) </span>
            <div class="axis">
            <span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span class="vertical-line left-span" ></span><span  class="vertical-line left-span" ></span><span  class="vertical-line center-span" style="width: 0;"  ></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span"></span><span class="vertical-line right-span" ></span><span class="vertical-line right-span" ></span>
        </div>
                <div class="bar">
                    <div class="${color}" style="width: 0%; ${positionStyle};"></div>
                </div>
                </div>
            `;
        }
            barChart.innerHTML += bar;
        });
        
        // Trigger the animation by setting the width after rendering
        setTimeout(() => {
            const bars = document.querySelectorAll('.bar div');
            bars.forEach((bar, index) => {
                const value = answers[Object.keys(answers)[index]];
                const width = (value/100)*50
                bar.style.width = Math.abs(width) + "%";
            });
        
            document.getElementById("spinner").style.display = "none";
        }, 1000); // Slight delay to ensure the DOM is fully updated
})       
    }






