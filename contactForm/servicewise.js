(function () {
  var ViewForm = ViewForm || {};

  ViewForm.ViewModel = function () {
    var self = this;

    self.Post = function (url, data, success) {
      var xhr = window.XMLHttpRequest
        ? new XMLHttpRequest()
        : new ActiveXObject('Microsoft.XMLHTTP');
      xhr.open('POST', url);
      xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status == 200) {
          success(xhr.response);
        }
      };
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      xhr.responseType = 'json';
      xhr.withCredentials = true;
      xhr.crossDomain = true;
      xhr.send(JSON.stringify(data));
      return xhr;
    };

    self.GetUrlVars = function () {
      var vars = {};
      var parts = window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
          vars[key] = value;
        }
      );
      return vars;
    };

    self.GetLoadData = function () {
      self.urlVariables = self.GetUrlVars();
      self.formID = self.urlVariables['id'];
      self.websiteHostType = self.urlVariables['websiteHost']
        ? parseInt(self.urlVariables['websiteHost'])
        : 0;
      self.formResponseID = self.urlVariables['fr'];
      self.parentID = self.urlVariables['pId'];
      self.parentType = self.urlVariables['pType'];
      self.isOffice = self.urlVariables['office'];
      self.isDeferred = self.urlVariables['defer'];

      var sendData = new Object();

      if (self.parentID != undefined) {
        sendData.ParentID = self.parentID;
        sendData.ParentType = self.parentType;
      }

      sendData.FormId = self.formID;
      sendData.IsOffice = false;
      if (self.isOffice != undefined) {
        sendData.IsOffice = self.isOffice === '1';
      }

      if (self.isDeferred != undefined) {
        sendData.IsDeferred = self.isDeferred === '1';
      }

      return sendData;
    };

    self.RenderForm = function () {
      var sendData = self.GetLoadData();

      //Review form
      if (self.websiteHostType === 9) {
        self.Post(
          '/MarketingBFF/Form/GetRenderedFormReview',
          { data: sendData },
          self.RenderHtml
        );
      } else if (!!self.formID) {
        self.Post(
          '/MarketingBFF/Form/GetRenderedForm',
          { data: sendData },
          self.RenderHtml
        );
      } else {
        self.Post(
          '/MarketingBFF/FormResponse/GetResponse',
          { FormResponseID: self.formResponseID, IsOffice: sendData.IsOffice },
          self.RenderResponseHtml
        );
      }
    };

    self.RenderResponseHtml = function (data) {
      document.open();
      document.write(data.ResponseRenderedHtml);
      document.close();

      document.body.style.backgroundColor = 'rgb(225,225,225)';
      document.body.firstElementChild.className += ' sa-form';
    };

    self.RenderHtml = function (data) {
      document.open();
      document.write(data.RenderedHtml);
      document.close();

      if (self.websiteHostType === 0) {
        var interval = setInterval(function () {
          if (document.body === null || document.body === undefined) return;
          document.body.style.backgroundColor = '#e1e1e1';
          clearInterval(interval);
        }, 25);
      }

      sessionStorage.setItem('formTemplateId', data.FormTemplateId);
    };

    self.OpenGatewayIframe = function () {
      var iFrameContainer = document.getElementById('iFrameID22Container');
      iFrameContainer.style.display = '';
      var iFrame = document.getElementById('iFrameID22');
      iFrame.style.display = '';
      iFrame.src = 'ViewIframeID22.aspx?rk=' + self.formID;
    };

    self.CloseGatewayIFrame = function () {
      var iFrameContainer = document.getElementById('iFrameID22Container');
      iFrameContainer.style.display = 'none';
      var iFrame = document.getElementById('iFrameID22');
      iFrame.style.display = 'none';
      iFrame.src = 'about: blank';
    };

    self.ReceiveGatewayMessage = function (message) {
      var parsedResult = null;
      if (message != undefined) {
        parsedResult = JSON.parse(decodeURIComponent(message));
      }

      if (parsedResult != undefined) {
        var iFrameMessage = document.getElementsByName('IframeID22Message')[0];

        if (parsedResult.result == '1' || parsedResult.result == 'APPROVED') {
          var inputIFrame = document.getElementsByName('InputIframeID22')[0];
          if (typeof inputIFrame !== 'undefined') {
            inputIFrame.value = JSON.stringify(parsedResult);
          }

          if (typeof iFrameMessage !== 'undefined') {
            iFrameMessage.innerHTML =
              'Credit card information successfully updated!';
            iFrameMessage.style.color = 'green';
            iFrameMessage.style.visibility = 'visible';
          }
        } else {
          if (typeof iFrameMessage !== 'undefined') {
            alert(parsedResult.message);

            var iFrame = document.getElementById('iFrameID22');
            var originalSrc = iFrame.src;
            iFrame.src = 'about: blank';
            iFrame.src = originalSrc;
          }
        }
      }
    };
  };

  document.addEventListener('DOMContentLoaded', function () {
    ViewForm.VM = new ViewForm.ViewModel();
    ViewForm.VM.RenderForm();
  });
})();
