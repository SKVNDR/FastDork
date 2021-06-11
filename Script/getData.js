(function() {

    var url = window.location.href;

    function getScopeFromHackerOne(){
        let h1scope = [...document.querySelectorAll('.spec-asset strong')].map(n=>n.innerText);
        h1scope = h1scope.join();

        chrome.extension.sendMessage({
            scopeh1: h1scope
        });
    }

    function getScopeFromBugcrowd(){
        let bugCrowdScope = [...document.querySelectorAll('.cc-rewards-link-table__endpoint')].map(n=>n.innerText);
        bugCrowdScope = bugCrowdScope.join();

        chrome.extension.sendMessage({
            scopebc: bugCrowdScope
        });
    }

    function getLinksFromGoogle(){
        let googleLinks = [...document.querySelectorAll('div.yuRUbf>a:first-child')].map(n=>n.href);
        googleLinks = googleLinks.join();

        chrome.extension.sendMessage({
            goo_lnk: googleLinks
        });

        document.location=document.querySelectorAll('a#pnnext')[0].href;
    }

    function getLinksFromGithub(){
        let githubLinks = [...document.querySelectorAll('div.f4.text-normal a')].map(n=>n.href);
        githubLinks = githubLinks.join();

        chrome.extension.sendMessage({
            git_lnk: githubLinks
        });

        document.location=document.querySelectorAll('a.next_page')[0].href;
    }

    function getDorkFromGHD(){
        let dorksGHD = [...document.querySelectorAll('#exploits-table tbody td:nth-child(2) a')].map(n=>n.text);
        dorksGHD = dorksGHD.join();

        chrome.extension.sendMessage({
            dork_ghd: dorksGHD
        });

        document.querySelector("#exploits-table_next > a").click();
    }

    function detectUrl(target,func){
        if (url.indexOf(target) > -1) {
            func();
        }
    }

    detectUrl("https://www.exploit-db.com/google-hacking-database", getDorkFromGHD);
    detectUrl("https://github.com/search", getLinksFromGithub);
    detectUrl("https://www.google.com/search", getLinksFromGoogle);

    if (document.getElementsByClassName('bc-program-card__header').length > 0) {
        getScopeFromBugcrowd();
    }

    if (url.indexOf("https://hackerone.com/") > -1) {
        if (url.indexOf("?type=team") > -1) {
            getScopeFromHackerOne();
        }
    }

})();