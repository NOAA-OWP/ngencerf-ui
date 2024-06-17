<template> 
    <div id="Header" class="header">
        <div id="Logo">
          <img src="@/assets/styles/img/Diviner.png">
        </div>
        <div>
          <TopMenu />
        </div>
        <div id="PgmName">
          NEXTGEN
        </div>
      </div>
  </template>
  
  <style lang="scss" scoped>
  #Header {
    height:80px;
    border-bottom: 2px solid #000;
  }
  #Logo {
    position: fixed;
    top: 0;
    left: 10px;
  
    img {
      width: 100px;
    }
  }
  #TopMenu {
    position: fixed;
      right: 250px;
      top: 15px;
      ul {
          list-style: none;
      }
      li {
      display: inline-block;
      margin-right: 20px;
      }
      li a {
  
      }
  }
  #PgmName {
    font: 38px Roboto, sans-serif;
    font-weight: bold;
    position:fixed;
    right: 20px;
    top: 0;
    margin-right: 20px;
    margin-top: 20px;

  }
  </style>
