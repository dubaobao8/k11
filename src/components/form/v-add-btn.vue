<template>
    <i class="add-btn" @click="$emit('click')"></i>
</template>

<script>
  export default {
    name: "v-add-btn",
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .add-btn{
    width: 3.1rem;
    height: 3.1rem;
    border: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .add-btn::after{
    content: "";
    display: block;
    width: 2.2rem;
    height: 2.2rem;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAACYElEQVRYCe3VQWrCUBSFYX1x7NQFiOIiOukeHHXYYXfRVTjqXqR76KTBbqATN5DQJzQgwh0U/uYa+EuCyaWc+/gO6GzmnwIKKKCAAgoooIACCiiggAIKKKCAAgoooIACCiiggAIjCsxH3IWvatt2WUpZDcF93583m8338D7FzzLFQw9nrmXs6/PncNf31/o86WvShUxaPji8hQQwWWMLyZIP9lpIAJM1tpAs+WCvhQQwWWMLyZIP9lpIAJM1tpAs+WCvhQQwWWMLyZIP9lpIAJM1tpAs+WCvhQQwWWMLyZIP9lpIAJM1tpAs+WCvhQQwWWMLyZIP9lpIAJM1tpAs+WCvhQQwWWMLyZIP9lpIAJM1tpAs+WCvhQQwWWMLyZIP9lpIAJM1XhCL27ZdllL2RNYfMx5u/n93Op2eb2b//tp13XG73X4Ri5BCahmrepi3emdfj/UAl7t+jHc1TfNUtyGFlBrkdUcCFnJHZVyOgnxl9X1/rl9bh0vgyPeu7rv+ivqo7+/1HvtqqYVzKigj5/cH/Pq367Ber18yzkLtLFSQOYyAhTCOWIqFYJRMkIUwjliKhWCUTJCFMI5YioVglEyQhTCOWIqFYJRMkIUwjliKhWCUTJCFMI5YioVglEyQhTCOWIqFYJRMkIUwjliKhWCUTJCFMI5YioVglEyQhTCOWIqFYJRMkIUwjliKhWCUTJCFMI5YioVglEyQhTCOWIqFYJRMkIUwjljKAktKCOq67tg0zdPV6vbq2UcFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBgYgI/2D4rKWMSNY4AAAAASUVORK5CYII=)
    no-repeat;
    background-size: 100% 100%;
  }
</style>