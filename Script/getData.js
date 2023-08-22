(function() {

    const url = window.location.href;

    function sendData(platform, type, selector, nextPage){
        if (url.indexOf(platform) > -1) {
            let dataVal;

            if (type) {
                dataVal = [...document.querySelectorAll(selector)].map(n => n.href);
            } else {
                dataVal = [...document.querySelectorAll(selector)].map(n => n.innerText);
            }

            dataVal = dataVal.join();

            chrome.extension.sendMessage({
                dataResult: dataVal
            });

            if (nextPage) {
                nextPage();
            }
        }
    }

    function nextPageGoogle(){
        document.location=document.querySelectorAll('a#pnnext')[0].href;
    }

    function nextPageExploitDB(){
        document.querySelector("#exploits-table_next > a").click();
    }

    function nextPageGithub() {
        //I got a 404 error when using .click(), but it still works via the URL..
        let currentURL = window.location.href;
        let pValue = new URLSearchParams(window.location.search).get('p');
        pValue = pValue ? parseInt(pValue) + 1 : 2;
        let newURL = new URL(currentURL);
        newURL.searchParams.set('p', pValue);
        window.location.href = newURL.toString();
    }

    function multiSelector(){
        let gitParam = new URLSearchParams(window.location.search).get('type') === 'code' ? '.search-title a:nth-of-type(2)' : '.search-title a';
        return gitParam;
    }

    //get Github links
    sendData("https://github.com/search",true, multiSelector(), nextPageGithub);

    //get HackerOne links
    sendData("https://hackerone.com/",false,".spec-asset strong");

    //get Exploit DB dorks
    sendData("https://www.exploit-db.com/google-hacking-database",false,"#exploits-table tbody td:nth-child(2) a", nextPageExploitDB);

    //get Google links
    sendData("https://www.google.com/search",true,"div.yuRUbf>a:first-child", nextPageGoogle);

    //get Intigriti links
    sendData("https://app.intigriti.com/", false, ".domain");

    //get Bugcrowd links
    if (document.getElementsByClassName('bc-program-card__header').length > 0) {
        sendData("https://bugcrowd.com/",false,".cc-rewards-link-table__endpoint");
    }

})();


