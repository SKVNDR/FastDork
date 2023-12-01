(function() {
    const url = window.location.href;

    const selectors = {
        google: {
            standard: "div.yuRUbf > a:first-child",
            alternative: "div.kb0PBd.cvP2Ce.jGGQ5e > div > div > span > a",
            nextPage: ['a#pnnext', '.GNJvt.ipz2Oe']
        },
        github: {
            selector: () => {
                let gitParam = new URLSearchParams(window.location.search).get('type') === 'code' ? '.search-title a:nth-of-type(2)' : '.search-title a';
                return gitParam;
            },
            nextPage: 'a[rel="next"]'
        },
        hackerOne: {
            selector: ".spec-asset-identifier strong"
        },
        exploitDB: {
            selector: "#exploits-table tbody td:nth-child(2) a",
            nextPage: "#exploits-table_next > a"
        },
        intigriti: {
            selector: ".domain"
        },
        bugcrowd: {
            selector: ".cc-rewards-link-table__endpoint",
            condition: () => document.getElementsByClassName('bc-program-card__header').length > 0
        }
    };

    function scrollToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    function sendData(platform, type, selector, nextPage) {
        if (url.includes(platform)) {
            const elements = [...document.querySelectorAll(selector)];
            const dataVal = type ? elements.map(n => n.href).join() : elements.map(n => n.innerText).join();

            chrome.runtime.sendMessage({ dataResult: dataVal });

            if (nextPage) nextPage();
        }
    }

    function clickElement(selector) {
        const element = document.querySelector(selector);
        if (element) element.click();
    }

    function navigateToNextPage(platform) {
        const { nextPage } = selectors[platform];
        if (Array.isArray(nextPage)) {
            nextPage.some(selector => clickElement(selector));
        } else {
            clickElement(nextPage);
        }
    }

    function githubNextPage() {
        const nextLink = document.querySelector(selectors.github.nextPage);
        if (nextLink) {
            const hrefVal = nextLink.getAttribute('href');
            if (hrefVal) {
                let queryParams = new URLSearchParams(hrefVal.split('?')[1]);
                let pageParam = queryParams.get('p');
                if (pageParam) {
                    let newURL = new URL(window.location.href);
                    newURL.searchParams.set('p', pageParam);
                    document.location = newURL.toString();
                }
            }
        }
    }


    // Google
    if (document.querySelector(selectors.google.alternative)) {
        sendData("https://www.google.com/search", true, selectors.google.alternative, () => {
        scrollToBottom();
        navigateToNextPage('google');
        
        setTimeout(() => {
            scrollToBottom();
        }, 2000); 
    });
    } else {
        sendData("https://www.google.com/search", true, selectors.google.standard, () => navigateToNextPage('google'));
    }

    // GitHub
    sendData("https://github.com/search", true, selectors.github.selector(), githubNextPage);

    // HackerOne
    sendData("https://hackerone.com/", false, selectors.hackerOne.selector);

    // Exploit DB
    sendData("https://www.exploit-db.com/google-hacking-database", false, selectors.exploitDB.selector, () => navigateToNextPage('exploitDB'));

    // Intigriti
    sendData("https://app.intigriti.com/", false, selectors.intigriti.selector);

    // Bugcrowd
    if (selectors.bugcrowd.condition()) {
        sendData("https://bugcrowd.com/", false, selectors.bugcrowd.selector);
    }
})();
