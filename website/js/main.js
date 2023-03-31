function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    //document.getElementById("main").style.marginLeft = "250px"; - Push
    //document.body.style.backgroundColor = "black"; - Opacity
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    //document.getElementById("main").style.marginRight = "0"; - Push
    //document.body.style.backgroundColor = "white"; - Opacity
  }

  function myFunction(x) {
    x.classList.toggle("change");
  }
  