import React, { useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";
import "firebase/auth";

import "./style.css";

/* Stepper dependencies */
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDhxD4Oj3EaADjTWZcCkquoHzoxnhBq888",
  authDomain: "synergetics-16054.firebaseapp.com",
  databaseURL: "https://synergetics-16054.firebaseio.com",
  projectId: "synergetics-16054",
  storageBucket: "synergetics-16054.appspot.com",
  messagingSenderId: "549849275036",
  appId: "1:549849275036:web:c17664e24d4de0b4"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
//firebase.initializeApp(firebaseConfig);
console.log(firebase);

var profile = firebase.database().ref("profiles");

const supportedBanks = ["ANZ", "BOQ", "CBA", "westpac"];

function getSteps() {
  return [
    "Account Setup",
    "How does it work?",
    "Utilities",
    "Transport",
    "Spending",
    "Finish"
  ];
}

function saveProfile(
  email,
  name,
  password,
  consentUtility,
  energyName,
  energyNMI,
  energyMeterNum,
  energyUse,
  consentBank,
  personalBank,
  groceriesSpent,
  eatingOutSpent,
  otherSpent,
  foodHabits,
  meatConsump
) {
  //Hugo's changes, need firebase auth update

  let newProfile = profile.child(`${firebase.auth().currentUser.uid}`);
  newProfile.set({
    email: email,
    name: name,
    password: password,
    consentUtility: consentUtility,
    energyName: energyName,
    energyNMI: energyNMI,
    energyMeterNum: energyMeterNum,
    energyUse: energyUse,
    consentBank: consentBank,
    personalBank: personalBank,
    groceriesSpent: groceriesSpent,
    eatingOutSpent: eatingOutSpent,
    otherSpent: otherSpent,
    foodHabits: foodHabits,
    meatConsump: meatConsump
  });
}

// Sign up form start
export default class MasterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      activeStep: 0,
      email: "",
      name: "",
      password: "",
      consentUtility: "",
      energyName: "",
      energyNMI: "",
      energyMeterNum: "",
      energyUse: "",
      consentBank: "",
      personalBank: "",
      groceriesSpent: "",
      eatingOutSpent: "",
      otherSpent: "",
      foodHabits: "",
      meatConsump: "",
      error: true,
      errorMessage: "",
      errorStep: "",
      isTransactionUplded: false,
      bankFilePath: ""
      /* needs updteing every updated step */
      /* Saves errors */
    };
  }

  handleChange = event => {
    const { name, value } = event.target;
    /* if name === foodHabits && foodHabits !== 'omnivore' -> make meatConsump = 0 
    answer question of default values */
    this.setState({
      [name]: value
    });
    //console.log(this.state);
  };

  handleSubmit = event => {
    event.preventDefault();
    /*saveProfile(this.state.email, this.state.name, this.state.password, this.state.consent, this.state.energyName, this.state.energyNMI, this.state.energyMeterNum, this.state.energyUse, this.state.foodHabits, this.state.meatConsump); */
    // check that submitted not by enter - disable this
    const {
      email,
      name,
      password,
      consentUtility,
      energyName,
      energyNMI,
      energyMeterNum,
      energyUse,
      consentBank,
      personalBank,
      groceriesSpent,
      eatingOutSpent,
      otherSpent,
      foodHabits,
      meatConsump
    } = this.state;
    saveProfile(
      email,
      name,
      password,
      consentUtility,
      energyName,
      energyNMI,
      energyMeterNum,
      energyUse,
      consentBank,
      personalBank,
      groceriesSpent,
      eatingOutSpent,
      otherSpent,
      foodHabits,
      meatConsump
    );

    /*fill in to check if all data is saved */

    alert(
      `Thanks for signing up, ${name}! We appreciate your support, you can now close this tab.`
    );
    /*alert(`Your registration detail: \n 
           Email: ${email} \n 
           name: ${name} \n
           Password: ${password} \n
           Consent: ${consent} \n
           Name on energy bill: ${energyName} \n
           NMI: ${energyNMI} \n
           Energy Meter Number: ${energyMeterNum} \n
           Number of residents in household: ${energyUse} \n
           Diet: ${foodHabits} \n
           Meat consumption/week: ${meatConsump}
            
    `)*/
  };

  setActiveStep = step => {
    this.setState({
      activeStep: step
    });
  };

  setErrorState = (step, booleanVal, str) => {
    this.setState({
      error: booleanVal,
      errorMessage: str,
      errorStep: step
    });
  };

  setTransactionUplded = isUploaded => {
    this.setState({
      isTransactionUplded: isUploaded
    });
  };

  /************************ Navigation Logic ******************************/
  _next = () => {
    let currentStep = this.state.currentStep;
    /* needs updteing every updated step */
    this.setState({ error: true });

    if (currentStep === 3) {
      currentStep = 14;

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .catch(function(error) {
          //

          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === "auth/weak-password") {
            alert("The password is too weak.");
          } else {
            alert(errorMessage);
          }
          console.log(error);
        });
    } else if (currentStep === 4) {
      /* conditional rendering based on user input on Step4Consent */
      if (this.state.consentUtility === "consentTrue") {
        currentStep = 6;
      } else if (this.state.consentUtility === "consentFalse") {
        currentStep = 5;
      }
    } else if (currentStep === 5) {
      /* render next step */
      if (this.state.energyUse) {
        currentStep = 7;
      }
    } else if (currentStep === 6) {
      if (
        this.state.energyName &&
        this.state.energyNMI &&
        this.state.energyMeterNum
      ) {
        currentStep = 5;
      }
    } else if (currentStep === 8) {
      /* render based on user choice during Step8TransactionUpload */
      if (this.state.consentBank === "consentTrue") {
        currentStep = 13;
      } else if (this.state.consentBank === "consentFalse") {
        currentStep = 11;
      }
    } else if (currentStep === 13) {
      if (
        !supportedBanks.includes(this.state.personalBank) &&
        Boolean(this.state.personalBank)
      ) {
        currentStep = 11;
      } else if (supportedBanks.includes(this.state.personalBank)) {
        currentStep = 9;
      }
    } else if (currentStep === 11) {
      /* needs changing, disable next from first landing */
      currentStep = 9;
    } else if (currentStep === 9) {
      if (
        this.state.foodHabits === "vegetarian" ||
        this.state.foodHabits === "vegan"
      ) {
        currentStep = 12;
      } else if (this.state.foodHabits === "omnivore") {
        currentStep = 10;
      }
    } else if (currentStep === 10) {
      if (this.state.meatConsump) {
        currentStep = 12;
      }
    } else if (currentStep === 14) {
      currentStep = 4;
    } else {
      currentStep = currentStep >= 11 ? 12 : currentStep + 1;
    }
    this.setState({
      currentStep: currentStep
    });
    /* enable next for transport */
    if (currentStep === 7) {
      this.setState({ error: false });
    }
  };

  _prev = () => {
    let currentStep = this.state.currentStep;
    this.setState({ error: false });
    if (currentStep === 5 || currentStep === 6) {
      /* need to update changes */
      /* conditional rendering based on user input on Step4Consent */
      currentStep = 4;
    } else if (currentStep === 7) {
      /* render next step */
      /* needs to change to accomodate for asking for numResidence */
      if (this.state.consentUtility === "consentTrue") {
        currentStep = 6;
      } else if (this.state.consentUtility === "consentFalse") {
        currentStep = 5;
      }
    } else if (currentStep === 8) {
      /* render based on user choice during Step8TransactionUpload */
      currentStep = 7;
    } else if (currentStep === 9) {
      if (supportedBanks.includes(this.state.personalBank)) {
        currentStep = 13;
      } else {
        currentStep = 11;
      }
    } else if (currentStep === 11) {
      if (this.state.personalBank) {
        currentStep = 13;
      } else if (this.state.consentBank === "consentFalse") {
        currentStep = 8;
      }
    } else if (currentStep === 12) {
      if (
        this.state.foodHabits === "vegetarian" ||
        this.state.foodHabits === "vegan"
      ) {
        currentStep = 9;
      } else if (this.state.foodHabits === "omnivore") {
        currentStep = 10;
      }
    } else if (currentStep === 13) {
      currentStep = 8;
    } else if (currentStep === 4) {
      currentStep = 14;
    } else if (currentStep === 14) {
      currentStep = 3;
    } else {
      currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    }
    this.setState({
      currentStep: currentStep
    });
  };
  /***************************** Navigation Logic end ***************************************** */

  displayError() {
    if (this.state.currentStep === this.state.errorStep) {
      return (
        <div className="errorMsg">
          <sub>{this.state.errorMessage}</sub>
        </div>
      );
    }
    return null;
  }

  /*
   * the functions for our button
   */
  previousButton() {
    let currentStep = this.state.currentStep;
    if (currentStep !== 1) {
      return (
        <button
          className="btn btn-secondary"
          type="button"
          onClick={this._prev}
        >
          Previous
        </button>
      );
    }
    return null;
  }

  nextButton() {
    let currentStep = this.state.currentStep;
    /* needs updteing every updated step */
    if (currentStep === 12) {
      return null;
    }
    return (
      <button
        className="btn btn-primary float-right"
        type="button"
        onClick={this._next}
        disabled={this.state.error}
      >
        Next
      </button>
    );
    return null;
  }

  returnCat() {
    let currentStep = this.state.currentStep;
    console.log(this.state.currentStep);
    if (currentStep >= 4 && currentStep <= 6) {
      return "Utilities";
    } else if (currentStep === 7) {
      return "Transport";
    } else if (/*needs fixing */ currentStep >= 8 && currentStep <= 11) {
      if (currentStep === 11 && this.state.foodHabits !== "omnivore") {
        return "";
      } else {
        return "Consumption";
      }
    }
    return "";
  }

  render() {
    return (
      <React.Fragment>
        <h1>PEP Sign up Form 🍃</h1>

        <form
          onSubmit={this.handleSubmit}
          onKeyPress={event => {
            if (event.which === 13 /* Enter */) {
              /* disables submit on enter press, goes to next step instead*/
              event.preventDefault();
              if (!this.state.error) {
                this._next();
              }
            }
          }}
        >
          {/* 
        render the form steps and pass required props in Step this.state.currentStep
      */}
          {/* Progress bar */}
          <HorizontalLabelPositionBelowStepper
            currentStep={this.state.currentStep}
            activeStep={this.state.activeStep}
          />

          <h4> {this.returnCat()}</h4>

          <Step1Email
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            email={this.state.email}
            setErrorState={this.setErrorState}
            error={this.state.error}
            setActiveStep={this.setActiveStep}
            activeStep={0}
          />
          <Step2name
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            name={this.state.name}
            setErrorState={this.setErrorState}
            setActiveStep={this.setActiveStep}
            activeStep={0}
          />
          <Step3Password
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            password={this.state.password}
            setErrorState={this.setErrorState}
            setActiveStep={this.setActiveStep}
            activeStep={0}
          />
          <Step14Buffer
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            setErrorState={this.setErrorState}
            setActiveStep={this.setActiveStep}
            activeStep={1}
          />
          <Step4UtilConsent
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            consentUtility={this.state.consentUtility}
            setErrorState={this.setErrorState}
            setActiveStep={this.setActiveStep}
            activeStep={2}
          />
          <Step5NumPeopleResidence
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            consentUtility={this.state.consentUtility}
            numPeopleResidence={this.state.energyUse}
            setErrorState={this.setErrorState}
            setActiveStep={this.setActiveStep}
            activeStep={2}
          />
          {/* include numPeople residence questionnaire as its own step */}
          <Step6UtilMeterDetails
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            consentUtility={this.state.consentUtility}
            energyName={this.state.energyName}
            energyNMI={this.state.energyNMI}
            energyMeterNum={this.state.energyMeterNum}
            setErrorState={this.setErrorState}
            setActiveStep={this.setActiveStep}
            activeStep={2}
          />
          <Step7TransportUpload
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            name={this.state.name}
            setErrorState={this.setErrorState}
            setActiveStep={this.setActiveStep}
            activeStep={3}
          />
          <Step8TransactionConsent
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            name={this.state.name}
            consentBank={this.state.consentBank}
            personalBank={this.state.personalBank}
            setErrorState={this.setErrorState}
            setActiveStep={this.setActiveStep}
            activeStep={4}
          />
          <Step13TransactionUpload
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            name={this.state.name}
            consentBank={this.state.consentBank}
            personalBank={this.state.personalBank}
            bankFilePath={this.state.bankFilePath}
            setErrorState={this.setErrorState}
            setTransactionUplded={this.setTransactionUplded}
            isTransactionUplded={this.state.isTransactionUplded}
            setActiveStep={this.setActiveStep}
            activeStep={4}
          />
          <Step9Diet
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            foodHabits={this.state.foodHabits}
            setErrorState={this.setErrorState}
            setActiveStep={this.setActiveStep}
            activeStep={4}
          />
          <Step10MeatConsump
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            foodHabits={this.state.foodHabits}
            meatConsump={this.state.meatConsump}
            setErrorState={this.setErrorState}
            setActiveStep={this.setActiveStep}
            activeStep={4}
          />
          <Step11Spending
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            personalBank={this.state.personalBank}
            groceriesSpent={this.state.groceriesSpent}
            eatingOutSpent={this.state.eatingOutSpent}
            otherSpent={this.state.otherSpent}
            setErrorState={this.setErrorState}
            setActiveStep={this.setActiveStep}
            activeStep={4}
          />
          <Step12Signup
            currentStep={this.state.currentStep}
            setErrorState={this.setErrorState}
            setActiveStep={this.setActiveStep}
            activeStep={5}
          />
          {/* needs updating for every new step: To create a new step, 
          make a new function and follow the template of pre-existing functions.
          Then add new steps here as above so they can be rendered. */}

          {this.displayError()}
          {this.previousButton()}
          {this.nextButton()}
        </form>
      </React.Fragment>
    );
  }
}

function HorizontalLabelPositionBelowStepper(props) {
  const steps = getSteps();

  /* set activeStep as for the following steps*/
  /* Account Setup: Step1Email, Step2name = 0
    How Does it work?: = 1
    Utilities: Step4-Step6 = 2
    Transport: Step7 = 3
    Spending: Step 8-13, except for Step12 = 4
    Finish: Step12 = 5
  */

  return (
    <div>
      <Stepper activeStep={props.activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}

function Step14Buffer(props) {
  if (props.currentStep !== 14) {
    return null;
  }

  useEffect(() => {
    props.setErrorState(14, false, "");
    props.setActiveStep(props.activeStep);
  });

  return (
    <div>
      <div>
        <p>
          The three major categories that affect how much you emit fall under
          Utilities, Transport and Consumption. Please fill in the following
          details requested for each category.
        </p>
      </div>
      <div class="grid-container">
        <figure>
          <img src="https://image.flaticon.com/icons/svg/167/167745.svg" />
          <h4>Utilites</h4>
        </figure>
        <figure>
          <img src="https://image.flaticon.com/icons/svg/214/214280.svg" />
          <h4>Transport</h4>
        </figure>
        <figure>
          <img src="https://image.flaticon.com/icons/svg/1086/1086741.svg" />
          <h4>Spendings</h4>
        </figure>
      </div>
    </div>
  );
}

function Step1Email(props) {
  if (props.currentStep !== 1) {
    return null;
  }

  const validator = () => {
    let emailInput = document.querySelector("input");
    let inputBool = emailInput.checkValidity();
    /* set error state to true */
    /* each step needs an error state */
    if (inputBool) {
      props.setErrorState(1, false, "");
    } else {
      props.setErrorState(1, true, "Please enter a valid email.");
    }
  };

  useEffect(() => {
    validator();
    props.setActiveStep(props.activeStep);
  });

  return (
    <div className="form-group">
      <p>
        Thank you for your interest in measuring your emissions with us.
        <br />
        <br />
        Before we start, please create an account.
      </p>
      <label htmlFor="email">Email address</label>
      <input
        className="form-control"
        id="email"
        name="email"
        type="email"
        placeholder="Enter email"
        value={props.email}
        onChange={e => {
          props.handleChange(e);
          validator();
        }}
        required
      />
    </div>
  );
}

function Step2name(props) {
  if (props.currentStep !== 2) {
    return null;
  }

  const validator = () => {
    let input = document.querySelector("input").value;
    const userCheck = /^[a-z]{2,}\d*(?!.)/i;
    let result = userCheck.test(input);

    /* set error state to true */
    /* each step needs an error state*/
    if (result) {
      props.setErrorState(2, false, "");
    } else {
      props.setErrorState(
        2,
        true,
        "The name field only allows alphanumeric characters, must be greater than 2 characters in length and must not start with a number."
      );
    }
  };

  useEffect(() => {
    validator();
    props.setActiveStep(props.activeStep);
  });

  return (
    <div className="form-group">
      <label htmlFor="name">Name</label>
      <input
        className="form-control"
        id="name"
        name="name"
        type="text"
        placeholder="Enter name"
        value={props.name}
        onChange={e => {
          props.handleChange(e);
          validator();
        }}
        required
      />
    </div>
  );
}

function Step3Password(props) {
  if (props.currentStep !== 3) {
    return null;
  }

  const validator = () => {
    let input = document.querySelector("input").value;

    /* set error state to true */
    /* each step needs an error state*/
    if (input.length >= 6) {
      props.setErrorState(3, false, "");
    } else {
      props.setErrorState(
        3,
        true,
        "Your password must contain at least 6 characters."
      );
    }
  };

  useEffect(() => {
    validator();
    props.setActiveStep(props.activeStep);
  });

  return (
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <input
        className="form-control"
        id="password"
        name="password"
        type="password"
        placeholder="Enter password"
        value={props.password}
        onChange={e => {
          props.handleChange(e);
          validator();
        }}
        required
      />
    </div>
  );
}

function Step4UtilConsent(props) {
  if (props.currentStep !== 4) {
    return null;
  }

  const validator = () => {
    let chx = document.getElementsByTagName("input");
    let selected = false;
    for (var i = 0; i < chx.length; i++) {
      // If you have more than one radio group, also check the name attribute
      // for the one you want as in && chx[i].name == 'choose'
      // Return true from the function on first match of a checked item
      if (chx[i].type === "radio" && chx[i].checked) {
        selected = true;
      }
    }

    /* change state to enable next */
    if (selected || Boolean(props.consentUtility)) {
      props.setErrorState(4, false, "");
    } else {
      props.setErrorState(4, true, "Please select an option.");
    }
  };

  useEffect(() => {
    validator();
    props.setActiveStep(props.activeStep);
  });

  return (
    <React.Fragment>
      <div className="form-group">
        <label htmlFor="consent">
          In order for us to access your smart-meter data, please express your
          consent below.
          <br />
          <br />
          <strong>
            You agree to give Synergetics Pty Ltd access to your household smart
            meter data. This permission is sustained until you revoke it, which
            you can do at any time by emailing{" "}
            <ins>
              <a href="mailto:thebigpush@synergetics.com.au">
                thebigpush@synergetics.com.au
              </a>
            </ins>
          </strong>
        </label>
        <br />
        <div className="radio-group">
          <label className="radio-inline" htmlFor="consentFalse">
            <input
              className="form-control"
              id="consentFalse"
              name="consentUtility"
              type="radio"
              value="consentFalse"
              onChange={e => {
                props.handleChange(e);
                validator();
              }}
              checked={props.consentUtility === "consentFalse" ? true : false}
              required
            />
            I do not consent
          </label>

          <label className="radio-inline" htmlFor="consentTrue">
            {" "}
            <input
              className="form-control"
              id="consentTrue"
              name="consentUtility"
              type="radio"
              value="consentTrue"
              checked={props.consentUtility === "consentTrue" ? true : false}
              onChange={e => {
                props.handleChange(e);
                validator();
              }}
            />
            I consent
          </label>
        </div>
      </div>
    </React.Fragment>
  );
}

function Step5NumPeopleResidence(props) {
  if (props.currentStep !== 5) {
    return null;
  }
  /* radio button, atleast 1 checked validator */
  const validator = () => {
    let chx = document.getElementsByTagName("input");
    let selected = false;
    for (var i = 0; i < chx.length; i++) {
      // If you have more than one radio group, also check the name attribute
      // for the one you want as in && chx[i].name == 'choose'
      // Return true from the function on first match of a checked item
      if (chx[i].type === "radio" && chx[i].checked) {
        selected = true;
      }
    }

    /* change state to enable next */
    if (selected || Boolean(props.numPeopleResidence)) {
      props.setErrorState(5, false, "");
    } else {
      props.setErrorState(5, true, "Please select an option.");
    }
  };

  useEffect(() => {
    validator();
    props.setActiveStep(props.activeStep);
  });
  return (
    <div className="form-group">
      <label htmlFor="energyUse">How many people live in your residence?</label>
      <div className="radio-group">
        <label className="radio-inline" htmlFor="energyUse1">
          <input
            className="form-control"
            id="energyUse1"
            name="energyUse"
            type="radio"
            value="1"
            checked={props.numPeopleResidence === "1" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          1
        </label>
        <label className="radio-inline" htmlFor="energyUse2">
          <input
            className="form-control"
            id="energyUse2"
            name="energyUse"
            type="radio"
            value="2"
            checked={props.numPeopleResidence === "2" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          2
        </label>
        <label className="radio-inline" htmlFor="energyUse3">
          <input
            className="form-control"
            id="energyUse3"
            name="energyUse"
            type="radio"
            value="3"
            checked={props.numPeopleResidence === "3" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          3
        </label>
        <label className="radio-inline" htmlFor="energyUse4">
          <input
            className="form-control"
            id="energyUse4"
            name="energyUse"
            type="radio"
            value="4"
            checked={props.numPeopleResidence === "4" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          4
        </label>
        <label className="radio-inline" htmlFor="energyUse5">
          <input
            className="form-control"
            id="energyUse5"
            name="energyUse"
            type="radio"
            value="5"
            checked={props.numPeopleResidence === "5" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          5
        </label>
        <label className="radio-inline" htmlFor="energyUse6">
          <input
            className="form-control"
            id="energyUse6"
            name="energyUse"
            type="radio"
            value="6"
            checked={props.numPeopleResidence === "6" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          6
        </label>
        <label className="radio-inline" htmlFor="energyUse7">
          <input
            className="form-control"
            id="energyUse7"
            name="energyUse"
            type="radio"
            value="7"
            checked={props.numPeopleResidence === "7" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          7
        </label>
        <label className="radio-inline" htmlFor="energyUse8">
          <input
            className="form-control"
            id="energyUse8"
            name="energyUse"
            type="radio"
            value="8"
            checked={props.numPeopleResidence === "8" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          8
        </label>
        <label className="radio-inline" htmlFor="energyUse9">
          <input
            className="form-control"
            id="energyUse9"
            name="energyUse"
            type="radio"
            value="9"
            checked={props.numPeopleResidence === "9" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          9
        </label>
        <label className="radio-inline" htmlFor="energyUse10">
          <input
            className="form-control"
            id="energyUse10"
            name="energyUse"
            type="radio"
            value="10"
            checked={props.numPeopleResidence === "10" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          10
        </label>
      </div>
    </div>
  );
}

function Step6UtilMeterDetails(props) {
  if (props.currentStep !== 6) {
    return null;
  }

  /* text input validator, all 3 fields filled in */
  const validator = () => {
    let chx = document.getElementsByTagName("input");
    let missing = true;
    let selected = 0;
    for (var i = 0; i < chx.length; i++) {
      // If you have more than one radio group, also check the name attribute
      // for the one you want as in && chx[i].name == 'choose'
      // Return true from the function on first match of a checked item

      /* use state to do validation instead of searching for the input fields? */
      if (chx[i].type === "text" && Boolean(chx[i].value)) {
        selected += 1;
      }
    }

    /* change state to enable next */
    if (selected === 3) {
      props.setErrorState(6, false, "");
    } else {
      props.setErrorState(6, true, "Please fill in the missing fields.");
    }
  };

  useEffect(() => {
    validator();
    props.setActiveStep(props.activeStep);
  });
  return (
    <div>
      <div>
        <p>
          Thanks for consenting! Please provide the following Smart Meter
          details
        </p>
        <label htmlFor="energyName">Full name on energy bill:</label>
        <input
          className="form-control"
          id="energyName"
          name="energyName"
          type="text"
          placeholder=""
          value={props.energyName}
          onChange={e => {
            props.handleChange(e);
            validator();
          }}
        />
        <label htmlFor="energyNMI">
          NMI:
          <span className="field-tip">
            <i className="far fa-question-circle" />
            <span className="tip-content">
              The NMI, or National Meter Identifier, is a unique number for your
              home. You can find it on your electricity bill on the front of the
              first or second page of your bill. The NMI is eleven digits.
              <img
                src="https://www.ausgrid.com.au/-/media/Images/connections/metering/ORGNexample2.jpg?la=en&hash=42329981D84E17D43F9E6AA83A2243D85EAF6AB5"
                alt="NMI on bill"
                height=""
                width=""
              />
            </span>
          </span>
        </label>
        <input
          className="form-control"
          id="energyNMI"
          name="energyNMI"
          type="text"
          placeholder=""
          value={props.energyNMI}
          onChange={e => {
            props.handleChange(e);
            validator();
          }}
        />
        <label htmlFor="energyMeterNum">Meter Number:</label>
        <input
          className="form-control"
          id="energyMeterNum"
          name="energyMeterNum"
          type="text"
          placeholder=""
          value={props.energyMeterNum}
          onChange={e => {
            props.handleChange(e);
            validator();
          }}
        />
      </div>
    </div>
  );
}

function Step8TransactionConsent(props) {
  if (props.currentStep !== 8) {
    return null;
  }

  /* radio button validator, atleast 1 selected */
  const validator = () => {
    let chx = document.getElementsByTagName("input");
    let selected = false;
    for (var i = 0; i < chx.length; i++) {
      // If you have more than one radio group, also check the name attribute
      // for the one you want as in && chx[i].name == 'choose'
      // Return true from the function on first match of a checked item
      if (chx[i].type === "radio" && chx[i].checked) {
        selected = true;
      }
    }

    /* change state to enable next */
    if (selected || Boolean(props.consentBank)) {
      props.setErrorState(8, false, "");
    } else {
      props.setErrorState(8, true, "Please select an option.");
    }
  };

  useEffect(() => {
    validator();
    props.setActiveStep(props.activeStep);
  });

  return (
    /* needs updating, add choice to upload their transaction summary or answer a questionnaire */
    <div className="form-group">
      <label htmlFor="csvUploader">
        Using your recent transaction data, we can estimate your carbon
        footprint based on a spending breakdown by industry. Please upload your
        transaction summary so we can analyse your spending breakdown and how
        this affects your emissions. Links instructing how to download a{" "}
        <b>.csv</b> file for a single account can be found here:
        <a
          href="https://www.commbank.com.au/business/online-business-services/commbiz/faqs/how-to-export-transactions.html"
          target="_blank"
        >
          {" "}
          CBA
        </a>
        ,{" "}
        <a
          href="https://www.westpac.com.au/business-banking/online-banking/support-faqs/export-detailed-transaction-history/"
          target="_blank"
        >
          Westpac
        </a>
        ,{" "}
        <a
          href="https://www.anz.com/internet-banking/help/accounts/transactions/download/"
          target="_blank"
        >
          ANZ
        </a>
        ,{" "}
        <a href="https://www.boq.com.au/IBHelp/TL03Help" target="_blank">
          BOQ
        </a>
        .
      </label>
      <br />
      <br />

      <label htmlFor="consentBank">
        If you are uncomfortable with uploading this information, you can answer
        a questionnaire instead. Please select which method you prefer:
      </label>
      <div className="radio-group">
        <label className="" htmlFor="uploadSummary">
          <input
            className="form-control"
            id="uploadSummary"
            type="radio"
            name="consentBank"
            value="consentTrue"
            checked={props.consentBank === "consentTrue" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          Upload transaction summary
        </label>
        <label className="" htmlFor="answerQBank">
          <input
            className="form-control"
            id="answerQBank"
            type="radio"
            name="consentBank"
            value="consentFalse"
            checked={props.consentBank === "consentFalse" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          Answer Consumption Questionnaire
        </label>
      </div>
    </div>
  );
}

/* upload transaction summary or answer questionnaire */
function Step9Diet(props) {
  if (props.currentStep !== 9) {
    return null;
  }
  /* radio button validator, atleast 1 selected */
  const validator = () => {
    let chx = document.getElementsByTagName("input");
    let selected = false;
    for (var i = 0; i < chx.length; i++) {
      // If you have more than one radio group, also check the name attribute
      // for the one you want as in && chx[i].name == 'choose'
      // Return true from the function on first match of a checked item
      if (chx[i].type === "radio" && chx[i].checked) {
        selected = true;
      }
    }

    /* change state to enable next */
    if (selected || Boolean(props.foodHabits)) {
      props.setErrorState(9, false, "");
    } else {
      props.setErrorState(9, true, "Please select an option.");
    }
  };

  useEffect(() => {
    validator();
    props.setActiveStep(props.activeStep);
  });

  return (
    <div className="form-group">
      <label htmlFor="foodHabits">Which one best describes your diet?</label>
      <br />
      <div className="radio-group">
        <label className="radio-inline" htmlFor="vegetarian">
          <input
            className="form-control"
            id="vegetarian"
            name="foodHabits"
            type="radio"
            value="vegetarian"
            checked={props.foodHabits === "vegetarian" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          Vegetarian
        </label>
        <label className="radio-inline" htmlFor="vegan">
          <input
            className="form-control"
            id="vegan"
            name="foodHabits"
            type="radio"
            value="vegan"
            checked={props.foodHabits === "vegan" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          Vegan
        </label>
        <label className="radio-inline" htmlFor="omnivore">
          <input
            className="form-control"
            id="omnivore"
            name="foodHabits"
            type="radio"
            value="omnivore"
            checked={props.foodHabits === "omnivore" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          Omnivore
        </label>
      </div>
    </div>
  );
}

function Step10MeatConsump(props) {
  if (props.currentStep !== 10) {
    return null;
  }
  /* radio button validator, atleast one option selected */
  const validator = () => {
    let chx = document.getElementsByTagName("input");
    let selected = false;
    for (var i = 0; i < chx.length; i++) {
      // If you have more than one radio group, also check the name attribute
      // for the one you want as in && chx[i].name == 'choose'
      // Return true from the function on first match of a checked item
      if (chx[i].type === "radio" && chx[i].checked) {
        selected = true;
      }
    }

    /* change state to enable next */
    if (selected || Boolean(props.meatConsump)) {
      props.setErrorState(10, false, "");
    } else {
      props.setErrorState(10, true, "Please select an option.");
    }
  };

  React.useEffect(() => {
    validator();
    props.setActiveStep(props.activeStep);
  });

  return (
    <div className="radio-group-container">
      <label htmlFor="meatConsump">
        How many times a week do you eat meat?
      </label>
      <br />
      <div className="custom-control custom-radio radio-group-diet">
        <div className="">
          <input
            className="form-control custom-control-input"
            id="meatConsump1"
            name="meatConsump"
            type="radio"
            value=">2/day"
            checked={props.meatConsump === ">2/day" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          <label className="custom-control-label" htmlFor="meatConsump1">
            More than twice a day
          </label>
        </div>
        <div className="">
          <input
            className="form-control custom-control-input"
            id="meatConsump2"
            name="meatConsump"
            type="radio"
            value="2/day"
            checked={props.meatConsump === "2/day" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          <label className="custom-control-label" htmlFor="meatConsump2">
            Twice a day
          </label>
        </div>
        <div className="">
          <input
            className="form-control custom-control-input"
            id="meatConsump3"
            name="meatConsump"
            type="radio"
            value="1/day"
            checked={props.meatConsump === "1/day" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          <label className="custom-control-label" htmlFor="meatConsump3">
            Once a day
          </label>
        </div>
      </div>
      <div className="custom-control custom-radio radio-group-diet">
        <div className="">
          <input
            className="form-control custom-control-input"
            id="meatConsump4"
            name="meatConsump"
            type="radio"
            value="4-6x/week"
            checked={props.meatConsump === "4-6x/week" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          <label className="custom-control-label" htmlFor="meatConsump4">
            4-6 times a week
          </label>
        </div>
        <div className="">
          <input
            className="form-control custom-control-input"
            id="meatConsump5"
            name="meatConsump"
            type="radio"
            value="2-3x/week"
            checked={props.meatConsump === "2-3x/week" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          <label className="custom-control-label" htmlFor="meatConsump5">
            2-3 times a week
          </label>
        </div>
        <div className="">
          <input
            className="form-control custom-control-input"
            id="meatConsump6"
            name="meatConsump"
            type="radio"
            value="1/week"
            checked={props.meatConsump === "1/week" ? true : false}
            onChange={e => {
              props.handleChange(e);
              validator();
            }}
          />
          <label className="custom-control-label" htmlFor="meatConsump6">
            Once a week
          </label>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}

function Step11Spending(props) {
  if (props.currentStep !== 11) {
    return null;
  }
  /* number input validator, all 3 fields must be filled in */
  const validator = () => {
    let chx = document.getElementsByTagName("input");
    let missing = true;
    let selected = 0;
    for (var i = 0; i < chx.length; i++) {
      // If you have more than one radio group, also check the name attribute
      // for the one you want as in && chx[i].name == 'choose'
      // Return true from the function on first match of a checked item
      if (chx[i].type === "number" && Boolean(chx[i].value)) {
        selected += 1;
      }
    }

    /* change state to enable next */
    if (selected === 3) {
      props.setErrorState(11, false, "");
    } else {
      props.setErrorState(11, true, "Please fill in the missing fields.");
    }
  };
  useEffect(() => {
    validator();
    props.setActiveStep(props.activeStep);
  });

  return (
    <div className="form-group">
      <label htmlFor="spending">
        Thank you for choosing to answer the questionnaire. Below are the
        information we require to analyse your spending habits.
      </label>
      <div id="spending">
        <label htmlFor="groceriesSpent">
          Approximately how much would you spend a week on groceries?
        </label>
        <input
          className="form-control"
          id="groceriesSpent"
          name="groceriesSpent"
          type="number"
          min="0"
          placeholder="50"
          value={props.groceriesSpent}
          onChange={e => {
            props.handleChange(e);
            validator();
          }}
        />
        <label htmlFor="eatingOutSpent">
          Approximately how much would you spend a week on eating out?
        </label>
        <input
          className="form-control"
          id="eatingOutSpent"
          name="eatingOutSpent"
          type="number"
          min="0"
          placeholder="50"
          value={props.eatingOutSpent}
          onChange={e => {
            props.handleChange(e);
            validator();
          }}
        />
        <label htmlFor="otherSpent">
          Approximately how much would you spend a week on anything else?
        </label>
        <input
          className="form-control"
          id="otherSpent"
          name="otherSpent"
          type="number"
          min="0"
          placeholder="50"
          value={props.otherSpent}
          onChange={e => {
            props.handleChange(e);
            validator();
          }}
        />
      </div>
    </div>
  );
}

function Step12Signup(props) {
  if (props.currentStep !== 12) {
    return null;
  }

  useEffect(() => {
    props.setActiveStep(props.activeStep);
  });

  return (
    <React.Fragment>
      <p>
        Thanks for your time! We will be in contact with you soon. Click Sign up
        to submit your details.
      </p>
      <button className="btn btn-success btn-block" type="submit">
        Sign up
      </button>
    </React.Fragment>
  );
}

function Step13TransactionUpload(props) {
  if (props.currentStep !== 13) {
    return null;
  }

  const uploadFile_bank = files => {
    const userRef = firebase
      .storage()
      .ref()
      .child(`${firebase.auth().currentUser.uid}`);
    var metadata = {
      contentType: "text/csv"
    };

    let csvRef = userRef.child(`transactions.csv`);
    const file = files.item(0);
    const task = csvRef.put(file, metadata);

    props.setTransactionUplded(true);
    validator();
  };

  /* needs validator, atleast 1 button selected, and detect if file is uploaded */
  /* radio button validator, atleast one option selected */
  const radioValidator = () => {
    let chx = document.getElementsByTagName("input");
    let selected = false;
    for (var i = 0; i < chx.length; i++) {
      // If you have more than one radio group, also check the name attribute
      // for the one you want as in && chx[i].name == 'choose'
      // Return true from the function on first match of a checked item
      if (chx[i].type === "radio" && chx[i].checked) {
        selected = true;
      }
    }
    if (!selected) {
      props.setErrorState(13, true, "Please select an option");
    }
  };

  const validator = () => {
    /* change state to enable next */
    if (Boolean(props.personalBank) && props.isTransactionUplded) {
      props.setErrorState(13, false, "");
    } else {
      props.setErrorState(13, true, "Please upload your transaction summary");
    }
  };
  //this.validator();
  // doesn't update how i want it to
  useEffect(() => {
    validator();
    props.setActiveStep(props.activeStep);
  });
  return (
    <div className="form-group">
      <label htmlFor="personalBank">
        Thank you for choosing to upload your transaction summary.
        <br />
        Which bank are you with?
      </label>
      <div className="radio-group">
        <label className="radio-inline" htmlFor="ANZ">
          <input
            className="form-control"
            id="ANZ"
            name="personalBank"
            type="radio"
            value="ANZ"
            onChange={e => {
              props.handleChange(e);
              radioValidator();
              validator();
            }}
          />
          ANZ
        </label>
        <label className="radio-inline" htmlFor="BOQ">
          <input
            className="form-control"
            id="BOQ"
            name="personalBank"
            type="radio"
            value="BOQ"
            onChange={e => {
              props.handleChange(e);
              radioValidator();
              validator();
            }}
          />
          BOQ
        </label>
        <label className="radio-inline" htmlFor="CBA">
          <input
            className="form-control"
            id="CBA"
            name="personalBank"
            type="radio"
            value="CBA"
            onChange={e => {
              props.handleChange(e);
              radioValidator();
              validator();
            }}
          />
          Commbank
        </label>
        <label className="radio-inline" htmlFor="westpac">
          <input
            className="form-control"
            id="westpac"
            name="personalBank"
            type="radio"
            value="westpac"
            onChange={e => {
              props.handleChange(e);
              radioValidator();
              validator();
            }}
          />
          Westpac
        </label>
        <label className="" htmlFor="other">
          <input
            className="form-control"
            id="other"
            name="personalBank"
            type="radio"
            value="other"
            onChange={e => {
              props.handleChange(e);
              radioValidator();
              validator();
            }}
          />
          Other please specify:
          <br />{" "}
          <input
            name="personalBank"
            type="text"
            value={props.personalBank}
            onChange={e => {
              props.handleChange(e);
              radioValidator();
              validator();
            }}
            placeholder="other"
          />
        </label>
      </div>
      <br />

      <label className="" htmlFor="bankFilePath">
        Upload your transaction summary below:
      </label>
      <input
        id="bankFilePath"
        className="btn btn-block btn-outline-success"
        name="bankFilePath"
        type="file"
        accept=".CSV"
        onChange={e => {
          uploadFile_bank(e.target.files);
          props.handleChange(e);
          validator();
        }}
      />
    </div>
  );
}

function Step7TransportUpload(props) {
  if (props.currentStep !== 7) {
    return null;
  }

  let daycounter = 1;
  const launch_download = () => {
    let today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - daycounter);

    var dd = yesterday.getDate();
    var mm = yesterday.getMonth() + 1; //January is 0!
    var yyyy = yesterday.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    dd = String(dd);
    mm = String(Number(mm) - 1);
    yyyy = String(yyyy);
    console.log(dd, mm, yyyy);
    window.open(
      "https://www.google.com/maps/timeline/kml?authuser=0&pb=!1m8!1m3!1i" +
        yyyy +
        "!2i" +
        mm +
        "!3i" +
        dd +
        "!2m3!1i" +
        yyyy +
        "!2i" +
        mm +
        "!3i" +
        dd
    );
    daycounter += 1;
  };

  const uploadFile_transport = files => {
    const userRef = firebase
      .storage()
      .ref()
      .child(`${firebase.auth().currentUser.uid}`);
    var metadata = {
      contentType: "application/vnd.google-earth.kml+xml"
    };

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      var temp_name = file.name.split("-");
      var file_name = temp_name[1].concat(
        "",
        temp_name[2],
        temp_name[3].slice(0, 2)
      );
      let kmlRef = userRef.child(file_name);
      const task = kmlRef.put(file, metadata);
    }
  };

  useEffect(() => {
    props.setActiveStep(props.activeStep);
  });

  return (
    <div className="form-group">
      <p>
        We measure your transport emissions by analysing your Google Maps
        location history. This data provides us with how much you drive, take
        public transport or walk.
        <br />
        <br />
        Click <strong>each</strong> day button to download your Google location
        data for the past week. Please upload these files when they have
        finished downloading.
        <br />
        <br />
        If you get an <strong>error 404</strong> by clicking any of these
        buttons, please ensure that the browser you are using is logged in the
        Google account that is connected with Google maps on your phone.
        <span className="field-tip">
          <i className="far fa-question-circle" />
          <span className="tip-content">
            We measure your transport emissions by analysing your Google Maps
            location history. This data provides us with how much you drive,
            take public transport or walk.
          </span>
        </span>
      </p>
      <div id="dayButtons">
        <button
          id="clickMe1"
          className="btn btn-dark"
          type="button"
          value="Day 1"
          onClick={launch_download}
        >
          Day 1
        </button>
        <button
          id="clickMe2"
          className="btn btn-dark"
          type="button"
          value="Day 2"
          onClick={launch_download}
        >
          Day 2
        </button>
        <button
          id="clickMe3"
          className="btn btn-dark"
          type="button"
          value="Day 3"
          onClick={launch_download}
        >
          Day 3
        </button>
        <button
          id="clickMe4"
          className="btn btn-dark"
          type="button"
          value="Day 4"
          onClick={launch_download}
        >
          Day 4
        </button>
        <button
          id="clickMe5"
          className="btn btn-dark"
          type="button"
          value="Day 5"
          onClick={launch_download}
        >
          Day 5
        </button>
        <button
          id="clickMe6"
          className="btn btn-dark"
          type="button"
          value="Day 6"
          onClick={launch_download}
        >
          Day 6
        </button>
        <button
          id="clickMe7"
          className="btn btn-dark"
          type="button"
          value="Day 7"
          onClick={launch_download}
        >
          Day 7
        </button>
      </div>
      <input
        id="kmlUploader"
        className="btn btn-block btn-outline-success"
        type="file"
        accept=".KML"
        onChange={
          e =>
            uploadFile_transport(
              e.target.files
            ) /*also needs changing, save in state first? */
        }
        multiple
      />
    </div>
  );
}

class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayTooltip: false
    };
    this.hideTooltip = this.hideTooltip.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
  }

  hideTooltip() {
    this.setState({ displayTooltip: false });
  }
  showTooltip() {
    this.setState({ displayTooltip: true });
  }

  render() {
    let message = this.props.message;
    let position = this.props.position;
    return (
      <span className="tooltip" onMouseLeave={this.hideTooltip}>
        {this.state.displayTooltip && (
          <div className={`tooltip-bubble tooltip-${position}`}>
            <div className="tooltip-message">{message}</div>
          </div>
        )}
        <span className="tooltip-trigger" onMouseOver={this.showTooltip}>
          {this.props.children}
        </span>
      </span>
    );
  }
}
