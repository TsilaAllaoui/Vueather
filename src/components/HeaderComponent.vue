<script setup lang="ts"></script>

<template>
  <div class="header">
    <div class="search">
      <v-icon name="ri-search-2-line" scale="1.25" />
      <input type="text" placeholder="Search for location" />
    </div>
    <div class="user">
      <v-icon name="hi-bell" scale="1.5" class="icon" animation="ring" speed="slow" />
      <div class="user-pic"></div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  padding: 0 1rem;

  svg {
    color: white;
  }

  .search {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: $dark;
    border-radius: 10px;
    height: 60%;
    padding: 0 0.5rem;

    input {
      outline: none;
      border: none;
      background-color: transparent;
      height: 2rem;
      text-align: center;
      color: white;

      &::placeholder {
        color: rgba(245, 245, 245, 0.486);
      }
    }
  }

  .user {
    display: flex;
    align-items: center;
    gap: 1rem;

    svg {
      background-color: $dark;
      border-radius: 100%;
      padding: 5px;
    }

    .user-pic {
      border-radius: 100%;
      width: 2.25rem;
      aspect-ratio: 1;
      background-image: url(user.svg);
      background-size: 75%;
      background-repeat: no-repeat;
      background-position: center;
      background-color: white;
    }
  }
}
</style>
