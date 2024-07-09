<template>
  <!-- User Page -->
  <div class="grid row-auto @container">
    <div id="UserBox">
      <div class="grid grid-cols-5 gap-3">
        <div class="col-span-2">
          <div class="ttl">Your Account</div>
          <div class="name">{{ accountName }}</div>

                    <div class="passwordBox grid row-auto">
            <div class="chgpwd">Change Password</div>
            <div>Old password</div>
            <div><input type="password" /></div>
            <div>New password</div>
            <div><input type="password" /></div>
          </div>
        </div>
        <div class="col-span-3">
          <div id="avatar">Avatar</div>
        </div>
      </div>
      <div class="grid grid-cols-5 gap-3">
        <div class="col-span-2">
            Left side
          <!-- <div class="passwordBox grid row-auto">
            <div class="chgpwd">Change Password</div>
            <div>Old password</div>
            <div><input type="password" /></div>
            <div>New password</div>
            <div><input type="password" /></div>
          </div> -->
          <div class="col-span-3">Hello</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const accountName = "Herbert Hoover";
</script>
<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#UserBox {
  margin: 30px auto 0 auto;
  width: 100vw;
  height: 100vw;
  border: 4px solid #105d84;
  background-color: #cccccc;
  #avatar {
    width: 210px;
    height: 210px;
    margin: 20px 40px;
    border: 1px solid #105d84;

    vertical-align: top;
  }
  .ttl {
    margin: 30px 0 0 30px;
    font-size: 50px;
  }
  .name {
    font-size: 30px;
    margin: 40px 0 0 40px;
  }
  .chgpwd {
    font-size: 30px;
  }
  .passwordBox {
    margin: 20px;
  }
}
</style>
