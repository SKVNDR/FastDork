<p align="center">
       <img src="https://zupimages.net/up/21/15/h8zs.png" alt="Logo" width=72 height=72>
</p>

<h3 align="center">FastDork v0.1</h3>
<p align="center">
    This chrome extension allows you to create lists of Google and Github dork to open multiple tabs with one click,<br/>
    import "scope/out of scope" from HackerOne/Bugcrowd/Intigriti and extract links from raw data.
</p>

## Table of contents
- [Installation](#installation)
- [Tab FastDork](#tab-fastdork)
- [Tab Template](#tab-template)
	- [Import links from HackerOne, Bugcrowd and Intigriti](#import-links-from-hackerone-bugcrowd-and-intigriti)
	- [Import links from Google and Github](#import-links-from-google-and-github)
	- [Import Dorks from Google Hacking Database](#import-dorks-from-google-hacking-database)
	- [Copy to clipboard](#copy-to-clipboard)
	- [Extract Links from Raw data](#extract-links-from-raw-data)
- [Tab Setting](#tab-setting)
- [Error](#error)
- [Copyright and license](#copyright-and-license)

## Installation
- `git clone https://github.com/SKVNDR/FastDork.git`
- Go to **chrome://extensions/** and check the box for **Developer mode** in the top right corner.
- Go back to the **chrome://extensions/** page and click on **Load unpacked extension** button and select the FastDork folder.

<img src="https://zupimages.net/up/21/23/42hr.gif" alt="fastdork gif" width=400 >

## Tab FastDork
1) Select **One Domain/One Dork**
2) Choose **Google Dork / Github Dork** (choose which platform to open tabs.)
3) **Select list** of dork
	* When you choose **One Domain**, select list with **multiple dorks**
  	* When you choose **One dork**, select list with **multiple domains** (don't forget to add **\*replace\*** in this input)
4) Save (you can save the parameter of this tab)
5) Open dork's button

## Tab Template
### Import links from HackerOne, Bugcrowd and Intigriti

To use this functionality, go to the program page then click on the button **Import links from HackerOne/Bugcrowd/Intigriti**.

### Import links from Google and Github

Same logic, the import buttons will appear when google/github search will be visited. 

The links are saved automatically after each click on import buttons (in case if captcha appears)
 
### Import Dorks from Google Hacking Database

You can import dorks from Exploit DB, the import button will appear after visiting the google hacking database page.
 
### Copy to clipboard
To copy list textarea to your clipboard, click on this icon <img src="https://zupimages.net/up/21/15/2ww8.png" alt="icon clipboard">

### Extract Links from Raw data
To extract links, paste raw data in list textarea then click on this icon. <img src="https://zupimages.net/up/21/21/0z4r.png" alt="icon clipboard">

## Tab Setting

In this tab you can Add or Delete list, you can also Reset the extension data.

## Error

:warning: **Error messages :** 
- Error: Remove **\*replace\*** and select list with strings

If you choose **One Domain**, remove the string **\*replace\*** and replace it by one domain name. (Example : test.com)

- Error: You forgot to add **\*replace\***

If you choose **One Dork** you need to add the string **\*replace\*** in the field and then select the list with domains.

## Copyright and license

Code released under the [MIT License](https://github.com/SKVNDR/FastDork/blob/master/LICENCE).

(Import functionality is inspired by tomnomnom with webpaste extension)
