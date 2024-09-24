var listItems = document.getElementsByClassName("selectedItem");

function itemSelected() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
}

for(var i = 0; i < listItems.length; i++){
    listItems[i].addEventListener("click", itemSelected);
}

    