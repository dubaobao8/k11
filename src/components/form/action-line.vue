<template>
	<div class="action-line" :style="{color:color}" @click="$emit('click')">
		<i :class="fontClass" class="action-line-icon"></i>
		<p class="action-text">
			<slot></slot>
		</p>
	</div>
</template>

<script>
	export default {
		name: "action-line",
		props: {
		  // 图标的 font-awesome 类名
			fontClass: {
			  type: String,
        default: "fa fa-plus-square"
      },
      // 图标及文字颜色
			color: {
				type: String,
				default: "#5585f0"
			}
		}
	};
</script>

<style scoped>
	.action-line {
    padding-top: 7px;
    padding-bottom: 7px;
    margin-top: 8px;
    margin-bottom: 8px;
		font-size: 0.875rem;
		display: flex;
		align-items: center;
		cursor: pointer;
	}
	.action-line-icon {
		padding: 0 4px;
	}
	.action-text {
	}
</style>
<style src="./form.css" scoped />
