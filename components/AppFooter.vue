<template>
    <div id="Footer">
        <div class="version">
                Version 0.01  06/17/2024
        </div>
        <div class="copyright">
            Copyright 2024(C), Sombody
        </div>

    </div>
</template>
<style lang="css" scoped>
#Footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 80px;
    border-top: 2px solid #000;
    color: #fff;
}
.version, .copyright {
    display: block;
    margin-top: 10px;
    font-size: 24px;
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