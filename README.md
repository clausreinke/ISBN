== ISBN

Identify and organize books by their ISBN barcodes: scan barcode, fetch
book info by ISBN, edit info, store info in local SQLite database.

Uses Ionic framework, AngularJS, ngCordova, Cordova (with plugins:
BarcodeScanner, SQLite, splashscreen).

Tested on Android (Nexus 7, 2012); install ionic and build with `ionic platform
add android; ionic build`.

Feel free to browse and copy my own code here (mostly in index.html, app.js),
while respecting the licenses of included software packages. I can't give you
permission to use this project -other than for testing- because I still haven't
found a permissive source of ISBN information (the obvious candidates Amazon
and Google had very restrictive TOS last time I checked, preventing use on
mobile devives or long-term storage of information retrieved; the WorldCat one
I've included here doesn't allow for "cataloging").

So please read their <a
href="http://www.oclc.org/worldcat/policies/terms/">Terms and Conditions</a>
before using this project for anything but testing, and let me know if you find
a useful ISBN catalogue without such restrictions..
