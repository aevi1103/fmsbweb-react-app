warning: LF will be replaced by CRLF in package.json.
The file will have its original line endings in your working directory
warning: LF will be replaced by CRLF in src/App.js.
The file will have its original line endings in your working directory
[1mdiff --git a/package.json b/package.json[m
[1mindex 240bc8a..2cbfbf7 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -29,7 +29,11 @@[m
   },[m
   "scripts": {[m
     "start": "react-app-rewired start",[m
[31m-    "build": "react-app-rewired build",[m
[32m+[m[32m    "build": "react-app-rewired build && npm run post-build",[m
[32m+[m[32m    "delete-post-build-dir": "rm -r /z/src/react.app/",[m
[32m+[m[32m    "copy-build-to-prod-dir": "cp -a /c/Users/rontoa20/source/repos/fmsbweb3/fmsbweb.react-app/build/. /z/src/react.app/",[m
[32m+[m[32m    "copy-web-config": "cp /c/Users/rontoa20/source/repos/fmsbweb3/fmsbweb.react-app/web.config /z/src/react.app/",[m
[32m+[m[32m    "post-build": "npm run delete-post-build-dir && npm run copy-build-to-prod-dir && npm run copy-web-config",[m
     "test": "react-app-rewired test",[m
     "eject": "react-scripts eject"[m
   },[m
[1mdiff --git a/src/API.js b/src/API.js[m
[1mindex 7b7b131..fa7a21e 100644[m
[1m--- a/src/API.js[m
[1m+++ b/src/API.js[m
[36m@@ -1,7 +1,10 @@[m
 import axios from "axios";[m
 [m
[32m+[m[32mlet url = 'https://localhost:44384/api/';[m
[32m+[m[32m// let url = 'http://10.129.224.149:81/api/';[m
[32m+[m
 export default axios.create({[m
[31m-    baseURL: "https://localhost:44384/api/",[m
[32m+[m[32m    baseURL: url,[m
     headers: {[m
         'Accept': 'application/json'[m
     }[m
[1mdiff --git a/src/components/logistics/stock-overview-sloc-chart/stock-overview-sloc-chart.component.jsx b/src/components/logistics/stock-overview-sloc-chart/stock-overview-sloc-chart.component.jsx[m
[1mindex de01d31..d15d90d 100644[m
[1m--- a/src/components/logistics/stock-overview-sloc-chart/stock-overview-sloc-chart.component.jsx[m
[1m+++ b/src/components/logistics/stock-overview-sloc-chart/stock-overview-sloc-chart.component.jsx[m
[36m@@ -22,7 +22,7 @@[m [mconst StockOverViewSlocChart = ({stockOVerviewSlocCollection, isStockOverviewSlo[m
         //group array by key[m
         const dataSetByKey = _.groupBy(data, o => o.program); [m
 [m
[31m-        console.log('dataSetByKey', dataSetByKey)[m
[32m+[m[32m        // console.log('dataSetByKey', dataSetByKey)[m
 [m
         // transform datasetbykey to a object that fusion chart understands[m
         const dataSet = Object.keys(dataSetByKey).map(key => {[m
