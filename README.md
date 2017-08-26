# Web Recorder Chrome Extension
Web Recorder is an automated website testing and monitoring service that checks for problems with your website or application. It carries out operations in a browser, the same way a user would, to ensure that everything is working properly.

Your browser tests are going to mimic a user's journey through your website or application, so why not create them via your own journey? Web Recorder provides a free Chrome recorder extension that allows you to record operations and assertions right in your web browser. Once you're done recording a test, it's saved to our cloud service. At that point, you can view, edit and automate the test within your account.

More information about the functionality of the extension can be found [here][documentation].

[documentation]: http://snf-766614.vm.okeanos.grnet.gr:8080/documentation

## Installation
In order to install the Web Recorder Chrome Extension you have to follow these steps:
1) Download and extract the repository locally in your PC
2) Go to Chrome -> More Tools -> Extensions
3) Enable Developer Mode
4) Click Load unpacked extension...
5) Navigate to the downloaded repository and click open

Now you have successfully installed the extension in your PC. You'll see a Web Recorder Extension icon in your toolbar.

## Use Extension with your own server
If you want to use the Extension with your own server you have to modify some files and then refresh the Extension page (step 2 from installation). The files that you have to modify are:
1) background.js (serverURL)
   ```
    var active = false;
    var empty = true;
    var clicked = false;
    var asserting = false;
    var test_seq = [];
    var serverURL = 'http://snf-766614.vm.okeanos.grnet.gr:4000/';

    if (localStorage.getItem('currentUser'))
      screen = 'start';
    else
      screen = 'login';
    ...
    ```
2) popup.js (websiteURL, serverURL)
   ```
    var testName;
    var suiteName;
    var websiteURL = 'http://snf-766614.vm.okeanos.grnet.gr:8080/';
    var serverURL = 'http://snf-766614.vm.okeanos.grnet.gr:4000/';

    function appear(screen) {
      return document.querySelector(screen).style.display = "block";
    }
    ...
   ```
