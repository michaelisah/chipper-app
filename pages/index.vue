<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const postsStore = usePosts()
const favoritesStore = useFavorites()
const pollingInterval = ref(null)

// Fetch posts and favorite users/posts on page load
await Promise.all([
  postsStore.fetchPosts(),
  user.isGuest ? null : favoritesStore.fetchFavoriteUsers(),
  user.isGuest ? null : favoritesStore.fetchFavoritePosts()
])

// Set up polling for new posts every 30 seconds
onMounted(() => {
  pollingInterval.value = setInterval(async () => {
    await postsStore.checkForNewPosts()
  }, 30000)
})

// Clean up polling interval when component is unmounted
onUnmounted(() => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
  }
})

// Load new posts when button is clicked
function loadNewPosts() {
  postsStore.loadNewPosts()
}
</script>

<template>
  <div>
    <PostForm
      v-if="!user.isGuest" />

    <button
        v-if="postsStore.hasNewPosts"
        class="w-full bg-blue-500 text-white font-bold py-1 px-4 rounded-lg mb-8 flex items-center justify-center"
        @click="loadNewPosts">
      <span>Load New Posts</span>
    </button>
    <div class="grid gap-16">
      <PostItem
        v-for="post in postsStore.posts"
        :key="post.id"
        v-bind="{ post }" />
    </div>
  </div>
</template>
