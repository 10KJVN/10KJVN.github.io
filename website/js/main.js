function openNav() {
    document.getElementById("mySidenav").style.width = "250px"; //Width of the menu
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "black";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.body.style.backgroundColor = "white";
  }