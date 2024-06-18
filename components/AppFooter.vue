<template>
    <div id="Footer">
        <div class="topBar">&nbsp</div>
        <div class="version">
                Version 0.01  06/17/2024
        </div>
        <div class="copyright">
            Copyright &COPY;, Somebody
        </div>

    </div>
</template>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#Footer {
    font: 24px Roboto, sans-serif;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 80px;
    color: #fff;
}

.topBar {
    background-color: $ngwcp_primary3;
    height: 5px;
}

.version, .copyright {
    display: block;
    margin-top: 10px;
}
.version {
    float:left;
    margin-left: 20px;
}
.copyright {
    float: right;
    margin-right: 20px;
}
</style>