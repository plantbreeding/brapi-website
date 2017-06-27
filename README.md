# Adding new partners:

* Make sure the logo is either SVG or PNG and ensure the size is 940x567. The actual logo within that image should be restricted to the maximum dimensions 600x500. So a wide logo is restricted to 600px width, whereas a tall logo is restricted to 500px height - whichever dimension hits it's limit first, basically.
* Place the image in the "assets/images/institutions" folder
* Add the new partner to the index.html. At the bottom there is some JavaScript code, that takes the partners and puts them into an HTML element. Simply provide "img", "name" and "url" fields to add a new item.


# Updating logos:
* If new SVG versions of existing logos arrive, simply replace the PNG with the SVG and update index.html to reflect the change.


# Other items
* Update text as required
* Always check that responsive layout still looks ok after changes, i.e. just resize your window and test the page.
