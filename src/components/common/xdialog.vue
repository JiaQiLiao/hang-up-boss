<template>
  <div class="vux-x-dialog" @touchmove="onTouchMove">
    <transition :name="maskTransition">
      <div class="weui-mask" @click="hideOnBlur && (currentValue = false)" v-show="currentValue"></div>
    </transition>
    <transition :name="dialogTransition">
      <div class="weui-dialog" v-show="currentValue" :style="dialogStyle">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true
    },
    maskTransition: {
      type: String,
      default: 'vux-mask'
    },
    dialogTransition: {
      type: String,
      default: 'vux-dialog'
    },
    hideOnBlur: Boolean,
    dialogStyle: Object,
    scroll: {
      type: Boolean,
      default: true
    }
  },
  created () {
    if (typeof this.value !== 'undefined') {
      this.currentValue = this.value
    }
  },
  watch: {
    value: {
      handler: function (val) {
        this.currentValue = val
      },
      immediate: true
    },
    currentValue (val) {
      this.$emit(val ? 'on-show' : 'on-hide')
      this.$emit('input', val)
    }
  },
  data () {
    return {
      currentValue: false
    }
  },
  methods: {
    onTouchMove: function (event) {
      !this.scroll && event.preventDefault()
    }
  }
}
</script>

<style scoped>

.weui-mask {position: fixed;z-index: 1000;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0, 0, 0, .6);}
.weui-mask_transparent{position: fixed;z-index: 1000;top: 0;right: 0;left: 0;bottom: 0;}
.weui-dialog {position: fixed;z-index: 5000;width: 80%;top: 50%;left: 50%;transform: translate(-50%, -50%);background-color: #FFFFFF;text-align: center;border-radius: 0.08rem; overflow: hidden;}
</style>
