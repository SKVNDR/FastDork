document.addEventListener('DOMContentLoaded', function() {

    tabStructure();

    const errorId = $('#error');
    const msgError = $('.msg-error');
    const payloadInput = $('#payload-input');
    const listTab1 = $('#list-tab1');
    const listTab2 = $('#list-tab2');
    const nbrTab2 =  $('#nbr2');
    const targetTab1 = $('#target');
    const listNameId = $('#listname');
    const selectModTab1 = $('#select-mod');
    const urlGoogle = 'https://www.google.com/search?q=';
    const urlGithub = 'https://github.com/search?q=';

    const sucessCheck = '<div class="success-checkmark" hidden><div class="check-icon"><span class="icon-line line-tip"></span>\
        <span class="icon-line line-long"></span><div class="icon-circle"></div><div class="icon-fix"></div></div><p id="msgsuccess"></p></div>';

    const defaultPayloads = [
        'site:*replace* inurl:installer-log.txt intext:DUPLICATOR INSTALL-LOG',
        'site:*replace* confidential | top secret | classified | undisclosed',
        'site:*replace* intitle:"Index of"',
        'site:*replace* filetype:xls',
        'site:*replace* "<?php"',
        'site:*replace* inurl:redirect',
        'inurl:*replace* site:http://s3.amazonaws.com confidential OR "top secret"',
        'site:"*replace*" ext:(doc | pdf | xls | txt | rtf | odt | ppt | xml)'
    ];

    const reconPayloads = [
        'site:repl.it intext:*replace*',
        'site:zoom.us inurl:*replace*',
        'site:atlassian.net inurl:*replace*',
        'site:s3.amazonaws.com inurl:*replace*',
        'site:trello.com *replace*',
        'site:jsdelivr.net *replace*',
        'site:codeshare.io *replace*',
        'site:pastebin.com *replace*',
        'site:bitbucket.org *replace*',
        'site:*.atlassian.net *replace*',
        'site:gitlab *replace*',
        'site:scribd.com *replace*',
        'site:npmjs.com *replace*'
    ];

    const extension = [
        'site:*replace* ext:php',
        'site:*replace* ext:jsp',
        'site:*replace* ext:axd',
        'site:*replace* ext:ashx',
        'site:*replace* ext:aspx',
        'site:*replace* ext:cfm'
    ];

    const githubDork = [
        '"*replace*" db_password',
        '"*replace*" "Authorization: Bearer"',
        '"*replace*" filename:vim_settings.xml',
        '"*replace*" language:shell',
        '"*replace*" language:python',
        '"*replace*" fb_secret',
        '"*replace*" sendkeys',
        '"*replace*" pwd',
        '"*replace*" mailgun',
        '"*replace*" mailchimp',
        '"*replace*" dotfiles',
        '"*replace*" filename:.dockercfg auth',
        '"*replace*" apikey',
        '"*replace*" ssh language:yaml'
    ];

    const domainExample = [
        'example.com',
        'subdomain.example.com',
        'dev.example.com',
        'test.example.com'
    ];

    function tabStructure() {
        const tabs = document.getElementById('icetab-container').children;
        const tabContents = document.getElementById('icetab-content').children;

        let myFunction = function() {
            let tabChange = this.mynum;
            for (let int = 0; int < tabContents.length; int++) {
                tabContents[int].className = ' tabcontent';
                tabs[int].className = ' icetab';
            }
            tabContents[tabChange].classList.add('tab-active');
            this.classList.add('current-tab');
        };

        for (let index = 0; index < tabs.length; index++) {
            tabs[index].mynum = index;
            tabs[index].addEventListener('click', myFunction, false);
        }
    }

    function validateAnimation(text) {
        $(".sucessCheck").replaceWith(sucessCheck);
        $("#msgsuccess").text(text);
        $(".success-checkmark").show();
        $(".check-icon").hide();
        setTimeout(function() {
            $(".check-icon").show();
        }, 10);
        setTimeout(function() {
            $("#msgsuccess").text("");
        }, 1000);
        $(".success-checkmark").delay(350).fadeOut('slow');
    }

    function choiceTab() {
        $('.switch label').on('click', function() {
            const indicator = $(this).parent('.switch').find('span');
            if ($(this).hasClass('right')) {
                $(indicator).addClass('right');
            } else {
                $(indicator).removeClass('right');
            }
        });
    }
    choiceTab();

    function extractUrlFromString(){
        if (payloadInput.val()){
            const urlRegex = /(?:(?:https?|ftp|file):\/\/|www|\*\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
            let url = payloadInput.val().match(urlRegex);
            if (url){
                url = url.join();
                payloadInput.val(url.replaceAll(',', '\n'));
                removeDuplicate();
            } else {
                payloadInput.val("No links detected");
            }
            getNumberPayload();
        } else {
            payloadInput.val("To extract links, paste raw data here.\nThen click on the link icon.");
        }
    }

    $("#links").click(function() {
        extractUrlFromString();
    });

    function listener(key,value){
        if (value) {
            localStorage.setItem(key, value);
        }
    }

    chrome.extension.onMessage.addListener(function(request) {
        listener('DATA_RESULT',request.dataResult);
    });

    function validateBtn(div, reset) {
        if (reset) {
            $(div).css({border: "1px solid #4CAF50", color: "#4CAF50"});
        } else {
            $(div).css({border: "1px solid #f90", color: "#f90"});
        }
    }

    function getDataFromImportURL(url,textBtn,tab,autoSave){
        if (tabUrl.indexOf(url) > -1) {
            $("#import").text(textBtn);
            $("#import").css("display", "inline-block");
            $("#import").prop('title', 'Auto save : ' + autoSave);
            showDorkList();

            $("#import").click(function() {
                const checkList = parseInt(listTab2.val());
                if (checkList === 0) {
                    msgError.text("You forgot to select list !").show();
                } else {
                    msgError.hide();
                    chrome.tabs.executeScript(tab.ib,{
                            file: 'Script/getData.js'
                        },function() {
                            getDataFromLocalStorage(autoSave);
                        }
                    );
                }
            });
        }
    }

    function getDataFromLocalStorage(autoSave){
        const dataLocalStorage = localStorage.getItem("DATA_RESULT");
        if (dataLocalStorage === null){ //quick fix
            setTimeout(function () {
                const lastItem = localStorage.getItem("DATA_RESULT");
                fillListInput(lastItem,autoSave);
            }, 1000);
        } else {
            fillListInput(dataLocalStorage,autoSave);
        }
    }

    function fillListInput(data,autoSave){
        payloadInput.val(payloadInput.val() + data.replaceAll(',', '\n'));
        payloadInput.val(payloadInput.val() + "\n");

        removeDuplicate();

        if (autoSave){
            saveToArray();
            validateAnimation("Saved...");
        }

        getNumberPayload();
        const resultMinus = parseInt(nbrTab2.text()) - 1;
        nbrTab2.text(resultMinus);
        localStorage.removeItem("DATA_RESULT");
    }

    function limitNbrTab(nbr){
        if (parseInt(nbr) > 20){
            $('#go').hide();
            $('#limit').show();
        } else {
            $('#limit').hide();
            $('#go').show();
        }
    }

   function removeDuplicate(){
       const data = payloadInput.val();
       const result = data.split(/\n/g).filter((word, i, arr) => arr.indexOf(word) === i);
       payloadInput.val(result.join('\n'));
   }

    chrome.tabs.getSelected(null, function(tab) {

        tabUrl = tab.url;

        getDataFromImportURL(urlGoogle,"Import links from Google",tab,true);
        getDataFromImportURL("https://bugcrowd.com/","Import links from Bugcrowd",tab,false);
        getDataFromImportURL("https://github.com/search","Import links from Github",tab,true);
        getDataFromImportURL("https://www.exploit-db.com/google-hacking-database","Import dorks from Exploit DB",tab,true);

        if (tabUrl.indexOf("?type=team") > -1) {
            showDorkList();
            getDataFromImportURL("https://hackerone.com/", "Import links from HackerOne", tab,false);
        }

    });

    payloadInput.focusout(function () {
        removeEmptyLines();
    });

    function removeEmptyLines(){
        payloadInput.val(payloadInput.val().replace(/^\s*[\r\n]/gm, '').replace(/\n+$/, ''));
        getNumberPayload();
    }

    function getNumberPayload(){
        const lineCount = payloadInput.val().split("\n").length;
        nbrTab2.text(lineCount);
    }

    function showDorkList() {
        $(".icetab").removeClass("current-tab");
        $(".tabcontent").removeClass("tab-active");
        $(".icetab:nth-child(2)").addClass("current-tab");
        $(".tabcontent:nth-child(2)").addClass("tab-active");
    }

    $("#return").click(function() {
        listTab2.hide("fast");
        $("#pastepayload").show();
        $("#addpayload").show();
        $("#return").hide();
        validateBtn("#pastepayload", false);
        validateBtn("#addpayload", false);
    });

    function addList(listName, payload) {
        localStorage.setItem(listName.replace(/(<([^>]+)>)/ig,""), JSON.stringify(payload));
    }

    function exampleBDD() {
        localStorage.setItem("example", JSON.stringify(0));
        addList("List-Default", defaultPayloads);
        addList("List-Recon", reconPayloads);
        addList("List-Github", githubDork);
        addList("List-Domain", domainExample);
        addList("List-Exts", extension);
    }

    //example payload
    const example = JSON.parse(localStorage.getItem("example"));

    if (0 !== example) {
        exampleBDD();
    }

    function optionSave() {

        const gooChecked = $('#goodork').is(':checked');
        const saveTar = targetTab1.val();
        const listVal1 = listTab1.val();
        const selectMod = selectModTab1.val();

        let saveOption = {};
        saveOption.GooGit = gooChecked;
        saveOption.Target = saveTar;
        saveOption.List = listVal1;
        saveOption.ModeV = selectMod;

        localStorage.setItem("saveOption", JSON.stringify(saveOption));
        replaceOption();
    }

    function replaceOption() {
        const saveOption = JSON.parse(localStorage.getItem("saveOption"));

        if (!saveOption.GooGit) {
            $("#gitdork").prop("checked", true);
            $($('.switch').find('span')).addClass('right');
        }

        targetTab1.val(saveOption.Target);
        listTab1.val(saveOption.List);
        selectModTab1.val(saveOption.ModeV);
        nbrList($("#list-tab1 option:selected").text());
        limitNbrTab( $("#nbr").text());
    }

    function checkSaveBtn() {
        const saveTarget = JSON.parse(localStorage.getItem("target-1"));

        if (saveTarget === 1) {
            $("#tarsav").prop("checked", true);
        }

        if ($('input[name=savetarget]').is(':checked')) {
            replaceOption();
        }

        $("#tarsav").click(function() {
            if ($('input[name=savetarget]').is(':checked')) {
                localStorage.setItem("target-1", 1);
                optionSave();
            } else {
                localStorage.setItem("target-1", 0);
            }
        });
    }

    function acceptOnlyChrAndNbr() {
            listNameId.keyup(function() {
            let n = $(this).val();
            if ( n.match("^[a-zA-Z0-9 ]*$") == null ) {
                $(this).val(n.slice(0,-1));
            }
        });
    }

    acceptOnlyChrAndNbr();

    function createList() {
        if(!listNameId.val()){
            $("#info").text('Empty List Name').show();
            hideErrorTab3();
        } else {
            const msgPaste = 'Paste your list here.';
            addList("List-" + listNameId.val().toLowerCase(), [msgPaste]);
            appendListName();
            validateAnimation();
        }
    }

    $("#createlist").click(function() {
        createList();
    });

    function hideErrorTab1(){
        $("#target").focusin(function() {
            $(this).siblings("#target").hide();
            errorId.hide();
            targetTab1.css({border: "none", borderBottom: "1px solid #f90"});
            $("#error").css("display","none");
        });
    }

    function hideErrorTab3(){
        $("#listname").focusin(function() {
            $(this).siblings("#listname").hide();
            $("#info").hide();
        });
    }

    function getContentFromClipboard() {
        let result;
        payloadInput.value = '';
        payloadInput.select();
        if (document.execCommand('paste')) {
            result = payloadInput.value;
            payloadInput.text(result);
        }
        payloadInput.value = '';
        return result;
    }

    $("#paste").click(function() {
        getContentFromClipboard();
    });

    function resetList() {
        $("#info").replaceWith('<div id="info" class="info">Reset all data ? <button id="resetyes">YES</button><button id="resetno">NO</button></div>').css("margin-top", "9px");

        $("#resetyes").click(function() {
            localStorage.clear();
            exampleBDD();
            validateAnimation();
            $("#info").hide();
            appendListName();
        });

        $("#resetno").click(function() {
            $("#info").hide();
        });
    }

    $("#reset").click(function() {
        resetList();
    });

    function deleteList(listName) {
        window.localStorage.removeItem(listName);
        appendListName();
    }

    $("#deletelist").click(function() {
        const valListDel = parseInt($("#listdel").val());
        if (valListDel === 0) {
            $('#info').show().text('Choose list');
            $("#listdel").change(function() {
                $('#info').hide();
            });
        } else {
            deleteList("List-" + $("#listdel option:selected").text());
            validateAnimation();
        }
    });

    function appendListName() {
        $(".addopt").replaceWith('');
        let x = 0;
        for (let key in localStorage) {
            if (key.indexOf("List-") >= 0) {
                x++;
                key = key.replace('List-', '');
                $(".list").append('<option class="addopt" value=' + x + '>' + key + '</option>');
            }
        }
        saveList();
    }

    function saveList() {
        const listSave = localStorage.getItem("list-save");
        if (!listSave === 0) {
            listTab1.val( localStorage.getItem("list-save"));
        }
    }

    appendListName();
    checkSaveBtn();
    //skvndr
    function getListName() {
        let listNameVal;
        listNameVal = 'List-' + $( "#list-tab2 option:selected" ).text();
        return listNameVal;
    }

    function saveToArray() {
        removeDuplicate();
        let lines = [];
            $.each(payloadInput.val().split(/\n/), function(i, line) {
                if (line) {
                    lines.push(line);
                }
            });
        addList(getListName(), lines);
    }

    $("#prefix").change(function() {
        msgError.hide();
    });

    function openLink(id,url){
        $(id).click(function() {
            chrome.tabs.create({url:url})
        });
    }

    openLink('#version','https://github.com/SKVNDR/FastDork');
    openLink('#exploit-db','https://www.exploit-db.com/google-hacking-database');

    $("#save").click(function() {
        if (parseInt(listTab2.val()) === 0){
            listTab2.css('border','1px solid red');
        } else {
            removeEmptyLines();
            saveToArray();
            getNumberPayload();
            validateAnimation();
        }
    });

    function getData(listName) {
        let storedNames = JSON.parse(localStorage.getItem(listName));
        let dataList = storedNames.toString().replace(/\,/g, "\n");
        payloadInput.val(dataList);
    }

    function errorMsgTab1(msg){
        errorId.text(msg).css("display","block");
        targetTab1.css("border", "1px solid red");
        $("#error").css("background", "#b71c1cc9");
        hideErrorTab1();
    }

    function tabDork(domain, target, choice, oneDork) {
        let dmnTarget = targetTab1.val();
        let replaceTarget = target.replace('*replace*', domain);

        if (choice) {
            //google dork
            if (oneDork) {
                dmnTarget = targetTab1.val();
                replaceTarget = dmnTarget.replace('*replace*', target);

                if (dmnTarget.indexOf("*replace*") >= 0) {
                    // google one dork
                    chrome.tabs.create({
                         url: urlGoogle + encodeURIComponent(replaceTarget) + '&filter=0'
                     });
                } else {
                    errorMsgTab1('You forgot to add *replace*');
                }
            } else {
                // Google one domain
                if (dmnTarget.indexOf("*replace*") >= 0) {
                    errorMsgTab1('Remove *replace* and select list with strings');
                } else {
                    chrome.tabs.create({
                        url: urlGoogle + encodeURIComponent(replaceTarget) + '&filter=0'
                    });
                }
            }
        } else {
            // github dork
            if (oneDork) {
                dmnTarget = targetTab1.val();
                if (dmnTarget.indexOf("*replace*") >= 0) {
                    // github one dork
                    replaceTarget = dmnTarget.replace('*replace*', target);
                    chrome.tabs.create({
                        url: urlGithub + encodeURIComponent(replaceTarget) + '&type=Code'
                    });
                } else {
                    errorMsgTab1('You forgot to add *replace*');
                }
            } else {
                // github one domain
                if (dmnTarget.indexOf("*replace*") >= 0) {
                    errorMsgTab1('Remove *replace* and select list with strings');
                } else {
                    chrome.tabs.create({
                        url: urlGithub + encodeURIComponent(replaceTarget) + '&type=Code'
                    });
                }
            }
        }
    }

    function payloadDork(domain, listName, choice, oneDork) {
        const listNameValTab1 = 'List-' + $( "#list-tab1 option:selected" ).text();
        const storedNames = JSON.parse(localStorage.getItem(listNameValTab1));

        $.each(storedNames, function(index, value) {
            tabDork(domain, value, choice, oneDork);
        });
    }

    function nbrList(listName) {
        listName = "List-" + listName;
        const storedNames = JSON.parse(localStorage.getItem(listName));
        if (parseInt(listTab1.val()) === 0){
            $("#nbr").text('0');
        } else {
            $("#nbr").text(storedNames.length);
        }
    }

    listTab2.change(function() {
        msgError.hide();
        listTab2.css('border','1px solid #666');
        $("#addpayload").css("margin-top", "5px");
        const listDorkAdd = parseInt(listTab2.val());
        if (listDorkAdd === 0){
            clearPayloadInput();
        } else {
            getListName(listDorkAdd);
            getData(getListName());
            getNumberPayload();
        }
    });

    function copyToClipBoard() {
        try {
            const txt = payloadInput.val();
            const $temp = $("<textarea>");
            $("body").append($temp);
            $temp.val(txt).select();
            const retVal = document.execCommand("copy");
            console.log('Copy to clipboard returns: ' + retVal);
            $temp.remove();
        } catch (err) {
            console.log('Error while copying to clipboard: ' + err);
        }
    }

    $("#clipboard").click(function() {
        copyToClipBoard();
        validateAnimation("Saved in clipboard");
    });

    function clearPayloadInput(){
        payloadInput.val('');
        nbrTab2.text('0');
    }

    $("#clear").click(function() {
        clearPayloadInput();
    });

    function selectMod() {
        let selectModVal = $('#select-mod option:selected').val();
        selectModTab1.change(function() {
            selectModVal = parseInt($('#select-mod option:selected').val());
            if (selectModVal === 1) {
                targetTab1.attr("placeholder", "ex:Site:*replace* inurl:..");
            } else {
                targetTab1.attr("placeholder", "example.com");
            }
        });
    }

    selectMod();

    listTab1.change(function() {
        $(".alert").hide();
        listTab1.css("border", "1px solid #666");
        let listNbr = $("#list-tab1 option:selected").text();
        nbrList(listNbr);
        limitNbrTab($('#nbr').text());
    });

    function getDataOpenTabs(){
        let dmnTarget = targetTab1.val();
        let list = parseInt(listTab1.val());
        let selMod = parseInt($("#select-mod").val());

        if (dmnTarget.length) {
            if (list === 0) {
                errorId.text('List not set !').show();
                listTab1.css("border", "1px solid red");
            } else {
                payloadDork(dmnTarget, list, $('#goodork').is(':checked'), selMod);
            }
        } else {
            errorId.text('Empty value !').show();
            targetTab1.css("border", "1px solid red");
            hideErrorTab1();
        }
    }

    $("#go").click(function() {
        getDataOpenTabs();
    });
});