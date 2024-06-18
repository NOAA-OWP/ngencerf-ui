<template> 
    <div id="Header" class="header">
      <div id="TopBar">
        &nbsp;
      </div>
        <div id="Logo">
          <img src="@/assets/styles/img/NCWPC_wordmark_black-01.svg">
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
  @import "@/assets/styles/styles.scss";
  #TopBar {
    position: fixed;
    top: 0;
    height: 6px;
    background-color: $ngwcp_primary1;
    width: 100%;
  }
  #Header {
    height:80px;
    border-bottom: 2px solid $ngwcp_primary1;
  }
  #Logo {
    position: fixed;
    top: 6;
    left: 10px;
    margin-top: 20px;
  
    img {
      width: 200px;
    }
  }
  #TopMenu {
    position: fixed;
    font: 20px "ObjektivMk2_Rg",sans-serif;
      right: 250px;
      top: 15px;
      ul {
          list-style: none;
      }
      li {
      display: inline-block;
      margin-right: 20px;
      }

  }
  #PgmName {
    font: 38px "NeueFrutigerWorld-Bold", sans-serif;
    font-weight: bold;
    position:fixed;
    right: 20px;
    top: 5;
    margin-right: 20px;
  }
  </style>
