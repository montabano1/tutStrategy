

const firebaseConfig = {
  apiKey: "AIzaSyAwLSWglGGD0ZYj1P_0-sg3HzYAoR88Kls",
  authDomain: "tutorious-dfc74.firebaseapp.com",
  databaseURL: "https://tutorious-dfc74.firebaseio.com",
  projectId: "tutorious-dfc74",
  storageBucket: "tutorious-dfc74.appspot.com",
  messagingSenderId: "875855454828",
  appId: "1:875855454828:web:20f0005882a1c422d7ee49",
  measurementId: "G-PML15L11TH"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

function submitStrategy() {
  let strategyName = document.getElementById("stratName").value
  let pageNum = document.getElementById("pageNum").value
  let textsValue = document.getElementById("stratInput").value
  let texts = textsValue.split("**")
  let formulasValue = document.getElementById("formulaInput").value
  let formulas = formulasValue.split("**")
  let question = document.getElementById("questionInput").value
  let matchesValue = document.getElementById("matchesInput").value
  var matches = matchesValue.split("**")
  let matching = document.getElementById("matching").checked
  let answer = document.getElementById("answer").value
  let hint = document.getElementById("hint").value

  var strategyRef = db.collection('Strategies').doc(strategyName);

  var page =  `${pageNum}`


  var pageInfo = {
    answer: answer,
    hint: hint == "" ? null : hint,
    text: textsValue == "" ? null : texts,
    formula: formulasValue == "" ? null : formulas,
    matching: matching,
    matches: matchesValue == "" ? null : matches,
    question: question
  }



  var content = {
    [page]: pageInfo,
  }



  strategyRef.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }

    var allofit = {
      content: content,
      pages: Math.max(parseInt(pageNum),doc.exists ? doc.data()["pages"] : 1),
      premium: true,
      title: strategyName,
    }
    var setWithMerge = strategyRef.set(allofit, { merge: true }).then((docRef) => {
      console.log("Document successfully Updated");
      console.log(allofit)
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });
}).catch((error) => {
    console.log("Error getting document:", error);
});


}

function getStrategy() {
  const tutorfreeID = document.getElementById("stratName").value
  var question = db.collection('Strategies').doc(tutorfreeID);
  question.get().then((doc) => {
    let pageNum = document.getElementById("pageNum").value

    const area = document.getElementById("stratInput")
    area.value = ""
    const formarea = document.getElementById("formulaInput")
    formarea.value = ""
    const matchesarea = document.getElementById("matchesInput")
    matchesarea.value = ""
    document.getElementById("questionInput").value = ""
    document.getElementById("hint").value = ""
    document.getElementById("answer").value = ""

    const data = doc.data()["content"][pageNum]


    const questionText = data["text"]

    var i = 0
    if (questionText) {
      while (i < questionText.length) {
        if (i != 0) {
          area.value += "**"
        }
        area.value += questionText[i]
        i++
      }
    }


    const formulas = data["formula"]

    i = 0
    if (formulas) {
      while (i < formulas.length) {
        if (i != 0) {
          formarea.value += "**"
        }
        formarea.value += formulas[i]
        i++
      }
    }

    document.getElementById("questionInput").value = data["question"]
    document.getElementById("hint").value = data["hint"]
    document.getElementById("answer").value = data["answer"]


    const matches = data["matches"]
    if (matches) {
      matchesarea.value = ""
      i = 0
      while (i < matches.length) {
        if (i != 0) {
          matchesarea.value += "**"
        }
        matchesarea.value += matches[i]
        i++
      }
    }

    if (data["matching"] == true) {
      document.getElementById("matching").checked = true
    } else {
      document.getElementById("notmatching").checked = true
    }

  })
}


function getQuestion() {
  const tutorfreeID = document.getElementById("tutorfreeID").value
  if (tutorfreeID == "") {
    db.collection("Explanations").where("MonteWay", "!=", null).get().then((querySnapshot) => {
      var id = increaseTutorFreeIDby1(querySnapshot.docs[querySnapshot.docs.length - 1].id)
      document.getElementById("tutorfreeID").value = id
      doStuff(id)

  });
  } else {
    doStuff(tutorfreeID)
  }
}

function increaseTutorFreeIDby1(tut) {
  let num = tut ? tut : document.getElementById("tutorfreeID").value
  let newQ = "q" + String(parseInt(num.split("q")[1]) + 100001).substring(1)
  return newQ
}

function nextQuestion() {
  newQ = increaseTutorFreeIDby1()
  document.getElementById("tutorfreeID").value = newQ
  getQuestion()
  document.getElementById("result0").value = ""
  document.getElementById("result1").value = ""
}

function doStuff(tutorfreeID) {
  var question = db.collection('MathQuestion').doc(tutorfreeID);
  question.get().then((doc) => {
    const data = doc.data()
    const questionText = data["Question"]
    const area = document.getElementById("questionText")
    while (area.firstChild) {
      area.removeChild(area.lastChild);
    }
    newQuestionLines(questionText, area)
    var i = 1
    while (i < 5) {
      const ans = document.getElementById(`ans${i}`)
      while (ans.firstChild) {
        ans.removeChild(ans.lastChild);
      }
      newQuestionLines(data[`Choice${i}`],ans)
      i ++
    }
    var explanation = db.collection('Explanations').doc(tutorfreeID);
    explanation.get().then((doc) => {
      if (doc.exists) {
        document.getElementById("explanationInput").value = doc.data()["explanation"]
        if (doc.data()["MonteWay"]) {
          document.getElementById("montewayInput").value = doc.data()["MonteWay"]
        } else {
          document.getElementById("montewayInput").value = ""
        }
      } else {
        document.getElementById("explanationInput").value = ""
        document.getElementById("montewayInput").value = ""
      }
    })

  })
}

function newQuestionLines(currentValue, input) {
  const arr = currentValue.split("\\n")
  for(i = 0; i < arr.length; i++) {
    replaceQuestionLatex(arr[i], input)
    replaceQuestionLatex(".", input)
  }
}

function replaceQuestionLatex(currentValue, area) {

  currentValue = currentValue.split("ENDLATEX").join("**")
  currentValue = currentValue.split("LATEX").join("**LATEX")

  const arr = currentValue.split("**")
  const result = area
  const newDiv = document.createElement("div")
  newDiv.className = "flexMe"

  var i = 0
  while (i < arr.length) {
    const para = document.createElement("div");
    if (arr[i].startsWith("LATEX")) {
      var changeMe = arr[i]
      changeMe = changeMe.split("LATEX").join("")
      para.innerHTML = katex.renderToString(changeMe)
    } else {
      para.innerHTML = arr[i]
    }
    newDiv.appendChild(para)
    result.appendChild(newDiv)
    i ++
  }
}

function submitExplanation() {
  let tutorfreeID = document.getElementById("tutorfreeID").value
  let explanation = document.getElementById("explanationInput").value
  let monteWay = document.getElementById("montewayInput").value
  let expTutorFreeID = tutorfreeID.replaceAll("q","e")


  var explanationRef = db.collection('Explanations').doc(tutorfreeID);



  var pageInfo = {
    MonteWay: monteWay,
    explanation: explanation,
    tutorFreeID: expTutorFreeID
  }

  explanationRef.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        console.log("No such document!");
    }
    var setWithMerge = explanationRef.set(pageInfo, { merge: true }).then((docRef) => {
      console.log("Document successfully Updated");
      console.log(pageInfo)
      nextQuestion()
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });
}).catch((error) => {
    console.log("Error getting document:", error);
});


}
