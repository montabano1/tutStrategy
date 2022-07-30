function latexTapped(id) {
  var $input = document.getElementById(id);
  // $input.onfocus = function () {
  //    $input.setSelectionRange($input.value.length - 9, $input.value.length - 9);
  // }
  $input.value += "LATEX "
  $input.focus();
}

function endlatexTapped(id) {
  var $input = document.getElementById(id);

  $input.value += "ENDLATEX "
  $input.focus();
}

function fracTapped(id) {
  var $input = document.getElementById(id);
  $input.onfocus = function () {
     $input.setSelectionRange($input.value.length - 6, $input.value.length - 6);
  }
  $input.value += "\\frac{  }{  }"
  $input.focus();
}

function sqrtTapped(id) {
  var $input = document.getElementById(id);
  $input.onfocus = function () {
     $input.setSelectionRange($input.value.length - 2, $input.value.length - 2);
  }
  $input.value += "\\sqrt{  }"
  $input.focus();
}

$(document).ready(function() {
  const textareas = document.getElementsByClassName("stratInput")
  console.log("ok2")
  for (let i = 0; i < textareas.length; i++) {
    const textarea = textareas[i]
    textarea.addEventListener("input", event => {
        const target = event.currentTarget;
        var currentValue = target.value;
        const result = document.getElementById(`result${i}`)

        while (result.firstChild) {
          result.removeChild(result.lastChild);
        }

        newLines(currentValue, i)


    });
  }


})

function newLines(currentValue, input) {
  const arr = currentValue.split("\\n")
  for(i = 0; i < arr.length; i++) {
    replaceLatex(arr[i], input)
    replaceLatex(".", input)
  }
}

function replaceLatex(currentValue, input) {

  currentValue = currentValue.split("ENDLATEX").join("**")
  currentValue = currentValue.split("LATEX").join("**LATEX")

  const arr = currentValue.split("**")
  const result = document.getElementById(`result${input}`)
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
