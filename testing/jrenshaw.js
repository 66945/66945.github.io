var head = document.head;
var headString = head.innerHTML;

//Replace
headString = headString.replace(/http/g, "https");
head.innerHTML = headString;