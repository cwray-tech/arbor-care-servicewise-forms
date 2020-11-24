(function () {
  var sa = {
    form: {
      rootEl: null,
      init: [],
    },
    utils: {
      fireLayoutChangedEvent(scrollToTop) {
        if (sa.form.rootEl == null) {
          return;
        }
        if (scrollToTop) {
          let target =
            window.parent.document.querySelector("#formDialog")
              ?.parentElement ||
            window.parent.document.querySelector(
              "#viewOverlayBodyRegionContainer"
            );

          if (target) {
            target.scrollTop = 0;
          } else if (
            window.parent.document.querySelector("#formOverlayDomID")
          ) {
            window.parent.scrollTo(0, 0);
          }
        }
        sa.form.rootEl.dispatchEvent(new CustomEvent("formLayoutChanged"));
      },
    },
  };

  function InitializeForm() {
    sa.form.rootEl = document.querySelector(".sa-form");

    for (let i = 0; i < sa.form.init.length; i++) {
      if (typeof sa.form.init[i] === "function") {
        sa.form.init[i]();
      }
    }

    document.removeEventListener("DOMContentLoaded", InitializeForm);
  }

  document.addEventListener("DOMContentLoaded", InitializeForm);
  var SaValidation = {
    text: function (field, isValid, isRequired, inputType) {
      const input = field.querySelector(inputType);
      const overLimit = input.getAttribute("data-limit")
        ? parseInt(input.getAttribute("data-limit")) < input.value.length
        : false;

      input.classList.remove("sa-invalid");

      if (
        !input.checkValidity() ||
        overLimit ||
        (input.value.trim() === "" && isRequired)
      ) {
        isValid.value = false;
        input.classList.add("sa-invalid");
      }
    },
    number: function (field, isValid, isRequired) {
      this.text(field, isValid, isRequired, "input");
    },
    shortText: function (field, isValid, isRequired) {
      this.text(field, isValid, isRequired, "input");
    },
    longText: function (field, isValid, isRequired) {
      this.text(field, isValid, isRequired, "textarea");
    },
    email: function (field, isValid, isRequired) {
      const input = field.querySelector("input");
      input.classList.remove("sa-invalid");
      const div = field.querySelector("div");
      if (
        (input.value === "" && isRequired) ||
        (input.value !== "" && !/(.+)@(.+){2,}\.(.+){2,}/.test(input.value)) ||
        div.classList.contains("sa-character-limit-exceeded")
      ) {
        isValid.value = false;
        input.classList.add("sa-invalid");
      }
    },
    dropdown: function (field, isValid, isRequired) {
      const input = field.querySelector("select");
      input.classList.remove("sa-invalid");

      if (input.selectedIndex === 0 && isRequired) {
        isValid.value = false;
        input.classList.add("sa-invalid");
      }
    },
    checklist: function (field, isValid, isRequired) {
      field.classList.remove("sa-invalid-label");

      const checkboxes = field.querySelectorAll("input");
      var chkValid = false;

      for (let j = 0; j < checkboxes.length; j++) {
        if (checkboxes[j].checked) {
          chkValid = true;
          break;
        }
      }

      if (!chkValid && isRequired) {
        isValid.value = false;
        field.classList.add("sa-invalid-label");
      }
    },
    radio: function (field, isValid, isRequired) {
      field.classList.remove("sa-invalid-label");

      const radioInputs = field.querySelectorAll("input");
      var radioValid = false;
      for (let j = 0; j < radioInputs.length; j++) {
        if (radioInputs[j].checked) {
          radioValid = true;
          break;
        }
      }

      if (!radioValid && isRequired) {
        isValid.value = false;
        field.classList.add("sa-invalid-label");
      }
    },
    rating: function (field, isValid, isRequired) {
      field.classList.remove("sa-invalid-rating");

      const ratingInputs = field.querySelectorAll("input");
      var ratingValid = false;
      for (let j = 0; j < ratingInputs.length; j++) {
        if (ratingInputs[j].checked) {
          ratingValid = true;
          break;
        }
      }

      if (!ratingValid && isRequired) {
        isValid.value = false;
        field.classList.add("sa-invalid-rating");
      }
    },
    review: function (field, isValid, isRequired) {
      const reviewInputs = field.querySelectorAll("input");
      var reviewValid = false;
      for (let j = 0; j < reviewInputs.length; j++) {
        if (reviewInputs[j].checked) {
          reviewValid = true;
          break;
        }
      }

      const reviewTextArea = field.querySelector("textarea");
      reviewTextArea.classList.remove("sa-invalid");

      if (reviewTextArea.value.trim() === "") {
        reviewValid = false;
      }

      if (!reviewValid && isRequired) {
        isValid.value = false;
        reviewTextArea.classList.add("sa-invalid");
      }
    },
    dateTime: function (field, isValid, isRequired) {
      const input = field.querySelector("input");
      input.classList.remove("sa-invalid");

      const settings = JSON.parse(input.getAttribute("data-dateTimeSettings"));

      if (
        settings.noCalendar === true &&
        input.value.trim() === "" &&
        isRequired
      ) {
        isValid.value = false;
        input.classList.add("sa-invalid");
      } else if (settings.noCalendar === false) {
        let parseDate = input.value;
        if (settings.dateFormat === "d-m-Y") {
          const dateParts = parseDate.split("-");
          parseDate = dateParts[1] + "-" + dateParts[0] + "-" + dateParts[2];
        }

        const date = Date.parse(parseDate.replace(/-/g, " "));
        if (isNaN(date) && isRequired) {
          isValid.value = false;
          input.classList.add("sa-invalid");
        }
      }
    },
    ccupdate: function (field, isValid, isRequired) {
      let button = field.querySelector("#Clearent-pay-now");
      if (isRequired) {
        let ccresult = field.getAttribute("data-ccresult");
        if (ccresult === null || ccresult.length === 0) {
          isValid.value = false;
          button.classList.add("sa-invalid");
          return;
        }
        let obj = JSON.parse(ccresult);
        isValid.value = !!obj.token && obj.token.length > 0;
        if (isValid.value) button.classList.remove("sa-invalid");
        else button.classList.add("sa-invalid");
        return;
      }
      if (button != null) button.classList.remove("sa-invalid");
    },
    hidden: function (field, isValid, isRequired) {
      return;
    },
  };

  var SaValidationStyle = {
    number: function (field) {
      const input = field.querySelector("input");
      input.addEventListener("change", function (event) {
        if (event.target.checkValidity())
          event.target.classList.remove("sa-invalid");
        else event.target.classList.add("sa-invalid");
      });
    },
    shortText: function (field) {
      const input = field.querySelector("input");
      input.addEventListener("change", function (event) {
        if (event.target.value.trim() !== "")
          event.target.classList.remove("sa-invalid");
      });
    },
    longText: function (field) {
      const input = field.querySelector("textarea");
      input.addEventListener("change", function (event) {
        if (event.target.value.trim() !== "")
          event.target.classList.remove("sa-invalid");
      });
    },
    email: function (field) {
      const input = field.querySelector("input");
      input.addEventListener("change", function (event) {
        if (/(.+)@(.+){2,}\.(.+){2,}/.test(event.target.value))
          event.target.classList.remove("sa-invalid");
      });
    },
    dropdown: function (field) {
      const input = field.querySelector("select");
      input.addEventListener("change", function (event) {
        if (event.target.selectedIndex !== 0) {
          event.target.classList.remove("sa-invalid");
        }
      });
    },
    checklist: function (field) {
      const checkboxes = field.querySelectorAll("input");

      for (let j = 0; j < checkboxes.length; j++) {
        checkboxes[j].addEventListener("change", function (event) {
          if (event.target.checked) {
            const wrapper = event.target.closest(".sa-invalid-label");
            if (wrapper) wrapper.classList.remove("sa-invalid-label");
          }
        });
      }
    },
    radio: function (field) {
      const radioInputs = field.querySelectorAll("input");

      for (let j = 0; j < radioInputs.length; j++) {
        radioInputs[j].addEventListener("change", function (event) {
          if (event.target.checked) {
            const wrapper = event.target.closest(".sa-invalid-label");
            if (wrapper) wrapper.classList.remove("sa-invalid-label");
          }
        });
      }
    },
    rating: function (field) {
      const ratingInputs = field.querySelectorAll("input");

      for (let j = 0; j < ratingInputs.length; j++) {
        ratingInputs[j].addEventListener("change", function (event) {
          if (event.target.checked) {
            const wrapper = event.target.closest(".sa-invalid-rating");
            if (wrapper) wrapper.classList.remove("sa-invalid-rating");
          }
        });
      }
    },
    review: function (field) {
      const reviewInputs = field.querySelectorAll("input");
      const reviewTextArea = field.querySelector("textarea");

      for (let j = 0; j < reviewInputs.length; j++) {
        reviewInputs[j].addEventListener("change", function (event) {
          if (event.target.checked && reviewTextArea.value.trim() !== "") {
            reviewTextArea.classList.remove("sa-invalid");
          }
        });
      }

      reviewTextArea.addEventListener("change", function (event) {
        if (event.target.value.trim() !== "")
          event.target.classList.remove("sa-invalid");
      });
    },
    dateTime: function (field) {
      const input = field.querySelector("input");
      input.addEventListener("change", function (event) {
        if (event.target.value.trim() !== "")
          event.target.classList.remove("sa-invalid");
      });
    },
    ccupdate: function (field) {
      const config = {
        attributes: true,
        childList: false,
        subtree: false,
        attributeFilter: ["data-ccresult"],
      };

      const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
          let button = mutation.target.querySelector("#Clearent-pay-now");
          let ccresult = mutation.target.getAttribute("data-ccresult");
          if (ccresult.length === 0 || JSON.parse(ccresult).token.length === 0)
            button.classList.add("sa-invalid");
          else button.classList.remove("sa-invalid");
        }
      };

      const observer = new MutationObserver(callback);

      observer.observe(field, config);
    },
    hidden: function (field, isValid, isRequired) {
      return;
    },
  };

  var SaValidateNavRules = {
    text: function (field, rule, inputType) {
      const input = field.querySelector(inputType);
      const value = rule.values[0];

      switch (rule.condition) {
        case 10:
          return input.value === value;
        case 11:
          return input.value.indexOf(value) > -1;
        case 12:
          return input.value.indexOf(value) === 0;
        case 13:
          return input.value.indexOf(value) < 0;
        default:
          return false;
      }
    },
    numeric: function (condition, inputValue, value) {
      switch (condition) {
        case 0:
          return inputValue === value;
        case 1:
          return inputValue < value;
        case 2:
          return inputValue > value;
        case 3:
          return inputValue <= value;
        case 4:
          return inputValue >= value;
        default:
          return false;
      }
    },
    number: function (field, rule) {
      const input = field.querySelector("input");
      const inputValue = parseInt(input.value);
      const value = parseInt(rule.values[0]);

      return this.numeric(rule.condition, inputValue, value);
    },
    shortText: function (field, rule) {
      return this.text(field, rule, "input");
    },
    longText: function (field, rule) {
      return this.text(field, rule, "textarea");
    },
    email: function (field, rule) {
      return this.text(field, rule, "input");
    },
    dropdown: function (field, rule) {
      const input = field.querySelector("select");
      const value = rule.values[0];
      const selectedOption = input[input.selectedIndex];
      let selectedValue = selectedOption.getAttribute("data-value").toString();
      if (
        selectedValue.length !== value.length &&
        isNaN(parseInt(selectedValue))
      ) {
        selectedValue = input.selectedIndex.toString();
      }
      /*
       * the following switch block can be replaced with "return selectedValue === value;"
       *
       * I did not do this because by the time I realized it was like this, the R1 release was a few days away.
       */
      switch (rule.condition) {
        case 10:
          return selectedValue === value;
        default:
          return false;
      }
    },
    checklist: function (field, rule) {
      const inputs = field.querySelectorAll("input");

      switch (rule.condition) {
        case 20:
          for (let i = 0; i < rule.values.length; i++) {
            let index = parseInt(rule.values[i]);
            if (!inputs[index].checked) return false;
          }
          return true;
        case 21:
          for (let i = 0; i < rule.values.length; i++) {
            let index = parseInt(rule.values[i]);
            if (inputs[index].checked) return true;
          }
          return false;
        case 23:
          for (let i = 0; i < rule.values.length; i++) {
            let index = parseInt(rule.values[i]);
            if (inputs[index].checked) return false;
          }
          return true;
        default:
          return false;
      }
    },
    radio: function (field, rule) {
      const value = rule.values[0];
      const inputs = field.querySelectorAll("input");
      let selectedValue = "";
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
          selectedValue = inputs[i].getAttribute("data-value").toString();
          if (
            selectedValue.length !== value.length &&
            isNaN(parseInt(selectedValue))
          )
            selectedValue = (i + 1).toString();
          break;
        }
      }
      /*
       * the following switch block can be replaced with "return selectedValue === value;"
       *
       * I did not do this because by the time I realized it was like this, the R1 release was a few days away.
       */
      switch (rule.condition) {
        case 10:
          return selectedValue === value;
        default:
          return false;
      }
    },
    rating: function (field, rule) {
      const inputs = field.querySelectorAll("input");
      const value = parseInt(rule.values[0]);

      var inputValue = 0;
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
          inputValue = i;
          break;
        }
      }

      return this.numeric(rule.condition, inputValue, value);
    },
    review: function (field, rule) {
      const inputs = field.querySelectorAll("input");
      const value = parseInt(rule.values[0]);

      var inputValue = 0;
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
          inputValue = parseInt(inputs[i].value);
          break;
        }
      }

      return this.numeric(rule.condition, inputValue, value);
    },
    dateTime: function (field, rule) {
      const input = field.querySelector("input");
      const settings = JSON.parse(input.getAttribute("data-dateTimeSettings"));
      let value = new Date(rule.values[0]);
      value = new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate()
      ).getTime();

      if (settings.noCalendar === true && input.value.trim() === "")
        return false;
      else if (settings.noCalendar === false) {
        let day = -1;
        let month = -1;
        let year = -1;

        let parseDate = input.value;

        const dateParts = parseDate.split("-");
        let monthIndex = 0;
        let dayIndex = 1;
        if (settings.dateFormat === "d-m-Y") {
          dayIndex = 0;
          monthIndex = 1;
        }

        day = parseInt(dateParts[dayIndex]);
        month = parseInt(dateParts[monthIndex]) - 1;
        let yearString = dateParts[2].split(" ")[0];
        if (yearString.length === 2) yearString = "20" + yearString;
        year = parseInt(yearString);

        let date = new Date(year, month, day).getTime();

        switch (rule.condition) {
          case 30:
            return date === value;
          case 31:
            return date < value;
          case 32:
            return date > value;
          case 33:
            return date <= value;
          case 34:
            return date >= value;
          default:
            return false;
        }
      }

      return false;
    },
    ccupdate: function (field, rule) {
      return false;
    },
  };

  function ValidateFields(page) {
    const isValid = { value: true };
    const fields = page.querySelectorAll("[data-fieldtype]");
    var scrolledToInvalidField = false;

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const fieldType = field.getAttribute("data-fieldtype");

      let isRequired = false;
      const reqValue = field.getAttribute("required");
      if (reqValue === "") isRequired = true;

      if (SaValidation[fieldType] == null) continue;

      SaValidation[fieldType](field, isValid, isRequired);

      if (!scrolledToInvalidField && !isValid.value) {
        field.scrollIntoView();
        scrolledToInvalidField = true;
      }
    }

    if (isValid.value === true) UpdatePageNavigation(page);

    return isValid.value;
  }

  function UpdateInputValidStyle() {
    const fields = document.querySelectorAll("[data-fieldtype]");
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const fieldType = field.getAttribute("data-fieldtype");
      if (fieldType !== "attachment") SaValidationStyle[fieldType](field);
    }
  }

  function UpdatePageNavigation(page) {
    var nextPage = page.getAttribute("data-next-page-default");
    const fields = page.querySelectorAll("[data-fieldtype]");
    for (let i = 0; i < fields.length; i++) {
      var field = fields[i];
      const fieldType = field.getAttribute("data-fieldtype");
      var serialized = field.getAttribute("data-jump-rules");
      if (serialized === undefined || serialized === null) continue;
      var jumpRules = JSON.parse(serialized);
      for (let j = 0; j < jumpRules.length; j++) {
        var validator = SaValidateNavRules[fieldType];
        if (validator === undefined || validator === null) continue;

        var rule = jumpRules[j];
        if (SaValidateNavRules[fieldType](field, rule)) {
          nextPage = rule.jumpTo;
          break;
        }
      }
    }
    page.setAttribute("data-next-page", nextPage);
  }

  sa.form.init.push(UpdateInputValidStyle);
  function LoadSubmitButton(confirmationType, data) {
    var submitBtn = document.getElementById("sa-form-submit");

    switch (confirmationType) {
      case "Document":
      case "URL":
        submitBtn.addEventListener("click", function () {
          var isDisabled = submitBtn.classList.contains("disabled");
          if (isDisabled) return;

          const page = submitBtn.parentElement.parentElement;
          if (ValidateFields(page)) {
            SubmitForm(page, function () {
              GoToConfirmationUrl(data);

              let progressIndicator = document.querySelector(
                "#sa-submission-progress-container"
              );
              progressIndicator.style.display = "none";
              EnablePaging();
            });
          }
        });
        break;
      case "SimpleMessage":
        submitBtn.addEventListener("click", function () {
          var isDisabled = submitBtn.classList.contains("disabled");
          if (isDisabled) return;

          const page = submitBtn.parentElement.parentElement;
          if (ValidateFields(page)) {
            SubmitForm(page, DisplayConfirmation);
          }
        });
        break;
    }
  }

  function DisablePaging() {
    let nextButtons = document.getElementsByClassName("sa-form-page-next");
    for (let i = 0; i < nextButtons.length; i++)
      nextButtons[i].classList.add("disabled");
    let previousButtons = document.getElementsByClassName("sa-form-page-prev");
    for (let i = 0; i < previousButtons.length; i++)
      previousButtons[i].classList.add("disabled");
    let submitBtn = document.getElementById("sa-form-submit");
    submitBtn.classList.add("disabled");
  }

  function EnablePaging() {
    let nextButtons = document.getElementsByClassName("sa-form-page-next");
    for (let i = 0; i < nextButtons.length; i++)
      nextButtons[i].classList.remove("disabled");
    let previousButtons = document.getElementsByClassName("sa-form-page-prev");
    for (let i = 0; i < previousButtons.length; i++)
      previousButtons[i].classList.remove("disabled");
    let submitBtn = document.getElementById("sa-form-submit");
    submitBtn.classList.remove("disabled");
  }

  function DisplayConfirmation() {
    let progressIndicator = document.querySelector(
      "#sa-submission-progress-container"
    );
    progressIndicator.style.display = "none";
    EnablePaging();

    const formEl = document.getElementsByClassName("sa-form");
    if (formEl !== null) formEl[0].style.display = "none";
    document.getElementById("sa-form-confirmation").style.display = "block";
    sa.utils.fireLayoutChangedEvent();
  }

  function GoToConfirmationUrl(data) {
    if (data !== "") {
      data = data.startsWith("http") ? data : "http://" + data;
      window.location = data;
    } else {
      DisplayConfirmation();
    }
  }

  function Post(url, data, success, failure) {
    var xhr = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("POST", url);
    xhr.onreadystatechange = function () {
      if (xhr.readyState > 3) {
        if (xhr.status == 200) success(xhr.response);
        else if (!!failure && typeof failure === "function")
          failure(xhr.response);
      }
    };
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("x-CompanyID", "02fb34c6-0e7a-409b-b564-c88b36db60ae");
    xhr.responseType = "json";
    xhr.withCredentials = false;
    xhr.crossDomain = true;
    xhr.send(JSON.stringify(data));
    return xhr;
  }

  function GetUrlVars() {
    var vars = {};
    window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        vars[key] = value;
      }
    );
    return vars;
  }

  var saFormUploads = saFormUploads || { Pending: [] };

  function SubmitForm(page, success) {
    if (saFormUploads !== undefined && saFormUploads.Pending.length > 0) return;

    DisablePaging();

    var docTop = document.querySelector(".sa-form");
    window.scrollTo(window.scrollX, docTop.offsetTop);
    document.querySelector("html").style = "overflow: hidden";

    let progressIndicator = document.querySelector(
      "#sa-submission-progress-container"
    );
    progressIndicator.style.display = "block";

    AddPageFormData(page);

    let error = function (response) {
      let progressIndicator = document.querySelector(
        "#sa-submission-progress-container"
      );
      progressIndicator.style.display = "none";

      alert("We were unable to submit the form. Try again in a few moments.");
      console.error(response);

      EnablePaging();
    };

    /*@begincap@*/
    let viewState = document.querySelector("#saFormData");
    let saFormData = viewState.value;
    const urlVars = GetUrlVars();
    const submitData = JSON.parse(saFormData);
    const data = {
      request: {
        formTemplateId: "3323eec2-4045-43a7-8883-d57ea6fbe13b",
        submittedById: urlVars["sId"],
        submittedByType: urlVars["sType"],
        parentId: urlVars["pId"],
        parentType: urlVars["pType"],
        source: urlVars["source"],
        data: submitData,
      },
    };
    Post(
      "https://my.serviceautopilot.com/MarketingBFF/Form/SubmitForm",
      data,
      success,
      error
    );
    /*@endcap@*/
  }

  function ApplyTagsOnClick() {
    const urlVars = GetUrlVars();
    const data = {
      request: {
        formTemplateId: "3323eec2-4045-43a7-8883-d57ea6fbe13b",
        companyId: "02fb34c6-0e7a-409b-b564-c88b36db60ae",
        parentId: urlVars["pId"],
        parentType: urlVars["pType"],
      },
    };
    Post(
      "https://my.serviceautopilot.com/MarketingBFF/Form/ApplyTagsOnClick",
      data,
      function () {}
    );
  }

  function InitializeSubmit() {
    ApplyTagsOnClick();
    LoadSubmitButton(
      "SimpleMessage",
      "<div><span style=&quot;font-size: 16px; color: rgb(0, 0, 0);&quot;><span style=&quot;font-family: Helvetica;&quot;>Thank you for reaching out to Arbor Care!</span></span><br><span style=&quot;color: rgb(0, 122, 255);&quot;><br></span><span style=&quot;font-size: 16px; color: rgb(0, 122, 255);&quot;><span style=&quot;font-family: Helvetica;&quot;><a href=&quot;http://www.facebook.com/arborcarewa&quot; rel=&quot;noopener noreferrer&quot; target=&quot;_blank&quot;><strong>Like us on Facebook!</strong></a></span></span></div>"
    );
  }

  sa.form.init.push(InitializeSubmit);
  function InitializeCharacterCounters() {
    const counters = document.getElementsByClassName("sa-character-counter");
    for (let i = 0; i < counters.length; i++) {
      const inputId = counters[i].getAttribute("for");
      const input = document.getElementById(inputId);

      if (input === null || input === undefined) continue;

      input.addEventListener("keyup", function () {
        const maxValue = this.getAttribute("data-limit");
        const count = this.value.length;
        const value = count / maxValue;
        this.nextSibling.style.display = "none";
        if (value >= 0.75) {
          this.nextSibling.textContent = count + "/" + maxValue;
          this.nextSibling.style.display = "";
        }

        if (count > maxValue) {
          this.parentElement.classList.add("sa-character-limit-exceeded");
        } else {
          this.parentElement.classList.remove("sa-character-limit-exceeded");
        }
      });
    }
  }

  sa.form.init.push(InitializeCharacterCounters);
  var saFormUploads = saFormUploads || { Pending: [] };

  function GetPageElementById(id) {
    return document.querySelector('.sa-form-page[data-index="' + id + '"]');
  }

  function InitializePaging() {
    let viewState = document.createElement("input");
    viewState.id = "saFormData";
    viewState.setAttribute("type", "hidden");
    let saFormData = JSON.stringify({ pages: [] });
    viewState.value = saFormData;
    document.body.appendChild(viewState);

    let firstPageIndex = document
      .querySelectorAll(".sa-form-page")[0]
      .getAttribute("data-index");

    sessionStorage.setItem("navTrail", JSON.stringify([]));
    sessionStorage.setItem("currentPageId", firstPageIndex);

    var previousButtons = document.getElementsByClassName("sa-form-page-prev");
    for (var i = 0; i < previousButtons.length; i++) {
      var el = previousButtons[i];
      el.onclick = function () {
        if (saFormUploads !== undefined && saFormUploads.Pending.length > 0)
          return;

        var isDisabled = el.classList.contains("disabled");
        if (isDisabled) return;

        RemovePageFromData();
        var currentPageId = sessionStorage.getItem("currentPageId");
        var currentPageElement = GetPageElementById(currentPageId);
        currentPageElement.style.display = "none";

        var trail = JSON.parse(sessionStorage.getItem("navTrail"));
        if (trail.length === 0) return;

        var previousPageIndex = trail.pop();
        var pageElement = GetPageElementById(previousPageIndex);
        pageElement.style.display = "block";

        var docTop = document.querySelector(".sa-form");
        window.scrollTo(window.scrollX, docTop.offsetTop);

        sa.utils.fireLayoutChangedEvent();

        sessionStorage.setItem("navTrail", JSON.stringify(trail));
        sessionStorage.setItem("currentPageId", previousPageIndex);
      };
    }

    var nextButtons = document.getElementsByClassName("sa-form-page-next");
    for (var i = 0; i < nextButtons.length; i++) {
      var el = nextButtons[i];
      el.onclick = function () {
        if (saFormUploads !== undefined && saFormUploads.Pending.length > 0)
          return;

        var isDisabled = el.classList.contains("disabled");
        if (isDisabled) return;

        var currentPageId = sessionStorage.getItem("currentPageId");
        var currentPageElement = GetPageElementById(currentPageId);
        if (ValidateFields(currentPageElement)) {
          AddPageFormData(currentPageElement);
          currentPageElement.style.display = "none";

          var nextPageId = currentPageElement.getAttribute("data-next-page");
          var nextPageElement = GetPageElementById(nextPageId);
          nextPageElement.style.display = "block";

          var docTop = document.querySelector(".sa-form");
          window.scrollTo(window.scrollX, docTop.offsetTop);

          sa.utils.fireLayoutChangedEvent();

          var trail = JSON.parse(sessionStorage.getItem("navTrail"));
          trail.push(currentPageId);
          sessionStorage.setItem("navTrail", JSON.stringify(trail));

          sessionStorage.setItem("currentPageId", nextPageId);
        }
      };
    }
  }

  function RemovePageFromData() {
    let viewState = document.querySelector("#saFormData");
    let formData = JSON.parse(viewState.value);
    formData.pages.pop();
    viewState.value = JSON.stringify(formData);
  }

  function AddPageFormData(page) {
    let viewState = document.querySelector("#saFormData");
    let pageIndex = parseInt(page.getAttribute("data-index"));
    let formData = JSON.parse(viewState.value);
    if (formData.pages.findIndex((x) => x.page === pageIndex) < 0) {
      formData.pages.push(new PageModel(pageIndex, page));
      viewState.value = JSON.stringify(formData);
    }
  }

  function PageModel(pageIndex, pageElement) {
    let self = this;
    self.page = pageIndex;
    self.fields = [];

    self.GetFieldValues = function () {
      const inputs = pageElement.querySelectorAll("[data-fieldtype]");

      if (window.saUploadFiles === null) window.saUploadFiles = [];

      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const fieldId = parseInt(input.getAttribute("data-field"));

        switch (input.getAttribute("data-fieldtype")) {
          case "longText":
            self.fields.push({
              fieldId: fieldId,
              value: input.querySelector("textarea").value,
            });
            break;
          case "dropdown":
            self.fields.push({
              fieldId: fieldId,
              value: input.querySelector("select").value,
            });
            break;
          case "radio":
          case "rating":
            {
              let value = "";
              const radio = input.querySelector("input:checked");
              if (radio !== undefined && radio !== null && radio.value)
                value = radio.value;
              self.fields.push({ fieldId: fieldId, value: value });
            }
            break;
          case "checklist":
            {
              const fieldValues = [];
              const checkedItems = input.querySelectorAll("input:checked")
                ? input.querySelectorAll("input:checked")
                : [];

              for (let j = 0; j < checkedItems.length; j++) {
                fieldValues.push(checkedItems[j].value);
              }

              self.fields.push({ fieldId: fieldId, values: fieldValues });
            }
            break;
          case "review":
            {
              const reviewValue = input.querySelector("input:checked")
                ? input.querySelector("input:checked").value
                : 0;
              self.fields.push({
                fieldId: fieldId,
                values: [reviewValue, input.querySelector("textarea").value],
              });
            }
            break;
          case "attachment":
            {
              if (
                saFormUploads === undefined ||
                saFormUploads === null ||
                saFormUploads.Uploads === undefined ||
                saFormUploads.Uploads === null ||
                saFormUploads.Uploads.length === 0
              )
                break;
              const model = saFormUploads.Uploads.find(
                (x) => x.FieldId == fieldId
              );
              if (model == null) break;
              const uploads = model.Uploads;
              const fieldValues = [];
              for (let j = 0; j < uploads.length; j++)
                fieldValues.push(JSON.stringify(uploads[j].data));
              self.fields.push({ fieldId: fieldId, values: fieldValues });
            }
            break;
          case "ccupdate":
            {
              let value = input.getAttribute("data-ccresult");
              self.fields.push({ fieldId: fieldId, value: value });
            }
            break;
          case "hidden":
            self.fields.push({ fieldId: fieldId, value: input.value });
            break;
          default:
            self.fields.push({
              fieldId: fieldId,
              value: input.querySelector("input").value,
            });
            break;
        }
      }
    };

    self.GetFieldValues(pageElement);
  }

  sa.form.init.push(InitializePaging);
})(); //# sourceURL=SaForms.js</script>
