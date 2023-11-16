import { Button, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import { theme, quizTheme } from "./theme";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// The main quiz section

// list of all questions
const questions = [
  {
    question:
      "If you wash your face and don't apply any products, how does your skin behave 30 minutes after?",
    options: [
      "It feels dry",
      "It feels calm, smooth, and soft",
      "It feels uneven (oily in some parts and dry on the other parts)",
      "It feels shiny and oily",
    ],
  },
  {
    question: "What does your skin typically look like at the end of the day?",
    options: [
      "My forehead and nose are very shiny and oily but my cheeks are matte.",
      "Crazy oily.",
      "Tight or splotchy. Like the desert. I need to put moisturizer on ASAP!",
      "Dull and tired. It feels mostly dry.",
      "My complexion is only slightly oily at the end of the day.",
      "I have some redness and irritation when exposed to skincare products or other environmental factors.",
      "It looks normal. Not overly dry or oily.",
    ],
  },
  {
    question: "Describe your pores.",
    options: [
      "My pores are large, visible, and sometimes clogged all over my face.",
      "Depends on where they are on my face. My pores are medium to large around my T-zone.",
      "Small to medium-sized. My pores are small and not visible.",
      "They seem to change with the day. My pores are visible but small.",
    ],
  },
  {
    question: "How frequently do you have breakouts or active acne lesions?",
    options: ["Frequent", "Seldom"],
  },
  {
    question:
      "Have you ever had a sunburn or noticed pigmentation changes after sun exposure?",
    options: ["Yes", "No"],
  },
];

// steps for the stepper
const steps = [
  {
    label: "Guidelines",
  },
  {
    label: "Test",
  },
  {
    label: "Result",
  },
];

function connectToDatabase() {
  console.log("I am at connectToDatabase()");
  let userData = {
    sessionId: "sampleSessionId",
  };
  fetch("/api/start", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

function storeResponse(currentQuestion, letter) {
  console.log("I am at storeResponse()");
  let userData = {
    currentQuestion: currentQuestion,
    letter: letter,
  };
  fetch("/api/storeResponse", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

function storeEmail(email) {
  console.log("I am at storeEmail()");
  let userData = {
    email: email,
  };
  fetch("/api/storeEmail", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

// store the results and send the email
function storeResults(email, skin_type, acne_prone, sun_sensitive) {
  console.log("I am at storeResults()");
  sendEmail(email, skin_type, acne_prone, sun_sensitive);
  let userResults = {
    skin_type: skin_type,
    acne_prone: acne_prone,
    sun_sensitive: sun_sensitive,
  };
  fetch("/api/storeResults", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userResults),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

function sendEmail(email, skin_type, acne_prone, sun_sensitive) {
  console.log("I am at sendEmail()");
  let userResults = {
    email: email,
    skin_type: skin_type,
    acne_prone: acne_prone,
    sun_sensitive: sun_sensitive,
  };
  fetch("/api/sendEmail", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userResults),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

function Test() {
  // Declaration of variables
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [showTest, setShowTest] = useState(false);
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState([]);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [skinType, setSkinType] = useState(null);
  const [acneProne, setAcneProne] = useState(null);
  const [sunSensitive, setSunSensitive] = useState(null);
  const [guidelines, setGuidelines] = useState(true);

  // When the start test button is clicked
  const handleStartTest = () => {
    console.log("I am at handleStartTest()");
    connectToDatabase();
    setShowTest(true);
  };

  // Landing page shown before the test starts
  if (!showTest) {
    return (
      <div className="flex flex-row justify-center mb-24">
        <ThemeProvider theme={theme}>
          <Button
            variant="outlined"
            color="primary"
            className="text-emerald-900"
            onClick={handleStartTest}
          >
            Start Test
          </Button>
        </ThemeProvider>
      </div>
    );
  }

  // When a test option is clicked
  const handleAnswer = (option) => {
    console.log("I am at handleAnswer");
    const index = options.indexOf(option);
    const letter = String.fromCharCode(index + 65);
    setAnswers([...answers, letter]);
    storeResponse(currentQuestion, letter);
    setCurrentQuestion(currentQuestion + 1);
  };

  // When email form is submitted
  const handleEmailSubmit = (event) => {
    console.log("I am  at handleEmailSubmit");
    event.preventDefault();
    storeEmail(email);
    console.log(email);
    setEmailSubmitted(true);
  };

  // When email input is changed
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Goes back 1 question
  const handleBack = () => {
    setCurrentQuestion(currentQuestion - 1);
    setAnswers(answers.slice(0, -1));
  };

  // Process a get request to /api/getResults and return the JSON result
  function getAnswers() {
    return fetch("/api/getAnswers", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  }

  // Process the answers and return the final result
  const processAnswers = (answers) => {
    let skin_type, acne_prone, sun_sensitive;

    getAnswers()
      .then((data) => {
        // Get answers to each question
        const q1 = data.option0;
        const q2 = data.option1;
        const q3 = data.option2;
        const q4 = data.option3;
        const q5 = data.option4;

        if (q1 === "A") {
          if (q2 === "C" || q2 === "D") {
            skin_type = "Dry";
          } else if (q2 === "G") {
            skin_type = "Normal";
          } else if (q2 === "A" || q2 === "B" || q2 === "E") {
            skin_type = "Combination";
          } else if (q2 === "F") {
            skin_type = "Sensitive";
          }
        } else if (q1 === "B") {
          if (q2 === "B") {
            if (q3 === "A") {
              skin_type = "Oily";
            } else {
              skin_type = "Normal";
            }
          } else if (q2 === "C" || q2 === "D") {
            if (q3 === "B") {
              skin_type = "Combination";
            } else {
              skin_type = "Dry";
            }
          } else if (q2 === "A" || q2 === "E") {
            skin_type = "Combination";
          } else if (q2 === "F") {
            skin_type = "Sensitive";
          }
        } else if (q1 === "C") {
          if (q2 === "F") {
            skin_type = "Sensitive";
          } else if (q2 === "B") {
            if (q3 === "A" || q3 === "B") {
              skin_type = "Oily";
            } else if (q3 === "C" || q3 === "D") {
              skin_type = "Combination";
            }
          } else {
            skin_type = "Combination";
          }
        } else if (q1 === "D") {
          if (q2 === "F") {
            skin_type = "Sensitive";
          } else if (q2 === "A" || q2 === "E") {
            skin_type = "Combination";
          } else if (q2 === "G") {
            if (q3 === "A" || q3 === "B") {
              skin_type = "Oily";
            } else {
              skin_type = "Combination";
            }
          } else {
            skin_type = "Oily";
          }
        }

        if (q4 === "A") {
          acne_prone = "Acne Prone";
        } else {
          acne_prone = "Not Acne Prone";
        }

        if (q5 === "A") {
          sun_sensitive = "Sun Sensitive";
        } else {
          sun_sensitive = "Not Sun Sensitive";
        }

        storeResults(email, skin_type, acne_prone, sun_sensitive);

        setSkinType(skin_type);
        setAcneProne(acne_prone);
        setSunSensitive(sun_sensitive);

        console.log("Results stored as:", skin_type, acne_prone, sun_sensitive);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });

    // Return results if email has been submitted
    return (
      <div className="flex rounded-lg bg-emerald-900 m-8 mx-20 p-5">
        {/* progress */}
        <div className="flex items-center px-24">
          <ThemeProvider theme={quizTheme}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </ThemeProvider>
        </div>

        <div className="flex-1 bg-white mx-5 rounded-md">
          <div className="px-52 py-5">
            <h2 className="font-bold text-center">Here's your diagnosis:</h2>

            <div className="flex flex-row mx-16 py-2 justify-center">
              <p className="py-1">Skin Type:</p>
              <h2 className="font-semibold text-white rounded-full bg-emerald-600 px-3 py-1 ml-3">
                {skinType}
              </h2>
            </div>

            <div className="flex flex-row mx-16 py-2 justify-center">
              <p className="py-1">Acne Prone:</p>
              <h2 className="font-semibold text-white rounded-full bg-emerald-600 px-3 py-1 ml-3">
                {acneProne}
              </h2>
            </div>

            <div className="flex flex-row mx-16 py-2 justify-center">
              <p className="py-1">Sun-sensitive:</p>
              <h2 className="font-semibold text-white rounded-full bg-emerald-600 px-3 py-1 ml-3">
                {sunSensitive}
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // When all questions have been asked
  if (currentQuestion >= questions.length) {
    if (!emailSubmitted) {
      return (
        <div className="flex rounded-lg bg-emerald-900 m-8 mx-20 p-5">
          {/* progress */}
          <div className="flex items-center px-24">
            <ThemeProvider theme={quizTheme}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </ThemeProvider>
          </div>

          <div className="flex-1 bg-white mx-5 rounded-md">
            <div className="px-52">
              <h2 className="font-bold text-center py-4">
                Want to save your result? We would gladly email it to you
              </h2>
              <form
                onSubmit={(e) => {
                  handleEmailSubmit(e);
                  setActiveStep(3);
                }}
              >
                <input
                  className="ring-2 ring-emerald-500 rounded outline-none w-full h-7 p-3 py-4"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                />

                <div className="flex justify-center py-10">
                  <button
                    className="block rounded-md bg-emerald-600 my-5 px-12 py-3 text-center font-semibold text-white hover:bg-emerald-700"
                    type="submit"
                    disabled={email.trim() === ""}
                  >
                    Next
                  </button>
                </div>
              </form>

              <div className="flex justify-center items-end pb-5">
                <p className="text-center text-xs">
                  *By entering your email, you consent to receive marketing
                  emails. For further informtation, please consult our Privacy
                  Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div>{processAnswers(answers)}</div>;
    }
  }

  // Render the current question and options
  const { question, options } = questions[currentQuestion];

  // Display the current question and options
  return (
    <div className="flex rounded-lg bg-emerald-900 m-8 mx-20 p-5">
      {/* progress */}
      <div className="flex items-center px-24">
        <ThemeProvider theme={quizTheme}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </ThemeProvider>
      </div>

      {/* question */}
      <div className="flex-1 bg-white mx-5 rounded-md">
        {/* show guidelines first */}
        {guidelines ? (
          <div className="px-52">
            <h2 className="font-bold text-center py-4">
              For more accurate result, please answer the questions as
              truthfully as you can.
            </h2>

            <div className="flex justify-center">
              <button
                className="block rounded-md bg-emerald-600 my-5 px-12 py-3 text-center font-semibold text-white hover:bg-emerald-700"
                onClick={() => {
                  setGuidelines(false);
                  setActiveStep(1);
                }}
              >
                Got it!
              </button>
            </div>
          </div>
        ) : (
          <div className="px-52">
            <h2 className="font-bold text-center py-4">{question}</h2>
            <ul>
              {options.map((option) => (
                // wrap li in button
                <button
                  className="block w-full rounded-md bg-emerald-600 my-5 px-12 py-3 text-center font-semibold text-white hover:bg-emerald-700"
                  key={option}
                  onClick={() => {
                    handleAnswer(option);
                    if (currentQuestion >= questions.length - 1) {
                      setActiveStep(2);
                    }
                  }}
                >
                  <li>{option}</li>
                </button>
              ))}
            </ul>

            {currentQuestion > 0 && (
              <ThemeProvider theme={theme}>
                <Button
                  variant="text"
                  className="my-5 font-semibold text-emerald-700 hover:text-emerald-800"
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                >
                  Back
                </Button>
              </ThemeProvider>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Test;
