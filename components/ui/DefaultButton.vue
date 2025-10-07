<script lang="ts" setup>
defineProps<{
  disabled?: boolean
}>();
</script>

<template>
  <button 
    class="default-button" 
    :disabled="disabled">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
@use "@/style/variables/color.scss" as color;
@use "@/style/variables/transition.scss" as transition;

.default-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid color.$main_purple;
  border-radius: 6px;
  background-color: color.$main_purple;
  color: color.$main_white;
  transition: all transition.$fast;
  height: 42px;
  padding: 0 20px;
  font-size: 16px;

  &:hover:not(:disabled) {
    background-color: lighten(color.$main_purple, 10%);
    border-color: lighten(color.$main_purple, 10%);
  }

  &:active:not(:disabled) {
    background-color: darken(color.$main_purple, 5%);
    border-color: darken(color.$main_purple, 5%);
  }

  &:disabled {
    background-color: color.$steel_gray_4;
    border-color: color.$steel_gray_4;
    color: color.$text_secondary;
    cursor: not-allowed;
  }
}

@media (max-width: 768px) {
  .default-button {
    height: 38px;
    padding: 0 16px;
    font-size: 14px;
    border-radius: 6px;
  }
}
</style>
