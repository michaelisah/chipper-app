<script setup>
definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const postsStore = usePosts()
const favoritesStore = useFavorites()

// Fetch posts and favorite users/posts on page load
await Promise.all([
  postsStore.fetchPosts(),
  user.isGuest ? null : favoritesStore.fetchFavoriteUsers(),
  user.isGuest ? null : favoritesStore.fetchFavoritePosts()
])
</script>

<template>
  <PostForm
    v-if="!user.isGuest" />
  <div class="grid gap-16">
    <PostItem
      v-for="post in postsStore.posts"
      :key="post.id"
      v-bind="{ post }" />
  </div>
</template>
