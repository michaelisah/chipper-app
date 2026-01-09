import { defineStore } from 'pinia'

export const useFavorites = defineStore('favorites', () => {
  const { $api } = useNuxtApp()
  
  // Store favorite users and posts
  const favoriteUsers = ref([])
  const favoritePosts = ref([])
  
  // Check if a user is in favorites
  const isUserFavorite = (userId) => {
    return favoriteUsers.value.includes(userId)
  }
  
  // Check if a post is in favorites
  const isPostFavorite = (postId) => {
    return favoritePosts.value.includes(postId)
  }
  
  // Fetch favorite users from API
  async function fetchFavoriteUsers() {
    try {
      const response = await $api.get('favorites')
      favoriteUsers.value = response.data.users.map(user => user.id)
      return response.data
    } catch (error) {
      console.error('Error fetching favorite users:', error)
      return []
    }
  }
  
  // Fetch favorite posts from API
  async function fetchFavoritePosts() {
    try {
      const response = await $api.get('favorites')
      favoritePosts.value = response.data.posts.map(post => post.id)
      return response.data
    } catch (error) {
      console.error('Error fetching favorite posts:', error)
      return []
    }
  }
  
  // Add user to favorites
  async function addUserToFavorites(userId) {
    try {
      await $api.post(`users/${userId}/favorite`)
      favoriteUsers.value.push(userId)
    } catch (error) {
      console.error('Error adding user to favorites:', error)
      throw error
    }
  }
  
  // Remove user from favorites
  async function removeUserFromFavorites(userId) {
    try {
      await $api.delete(`users/${userId}/favorite`)
      const index = favoriteUsers.value.indexOf(userId)
      if (index !== -1) {
        favoriteUsers.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Error removing user from favorites:', error)
      throw error
    }
  }
  
  // Toggle user favorite status
  async function toggleUserFavorite(userId) {
    if (isUserFavorite(userId)) {
      await removeUserFromFavorites(userId)
      return false
    } else {
      await addUserToFavorites(userId)
      return true
    }
  }
  
  // Add post to favorites
  async function addPostToFavorites(postId) {
    try {
      await $api.post(`posts/${postId}/favorite`)
      favoritePosts.value.push(postId)
    } catch (error) {
      console.error('Error adding post to favorites:', error)
      throw error
    }
  }
  
  // Remove post from favorites
  async function removePostFromFavorites(postId) {
    try {
      await $api.delete(`posts/${postId}/favorite`)
      const index = favoritePosts.value.indexOf(postId)
      if (index !== -1) {
        favoritePosts.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Error removing post from favorites:', error)
      throw error
    }
  }
  
  // Toggle post favorite status
  async function togglePostFavorite(postId) {
    if (isPostFavorite(postId)) {
      await removePostFromFavorites(postId)
      return false
    } else {
      await addPostToFavorites(postId)
      return true
    }
  }
  
  return {
    favoriteUsers,
    favoritePosts,
    isUserFavorite,
    isPostFavorite,
    fetchFavoriteUsers,
    fetchFavoritePosts,
    addUserToFavorites,
    removeUserFromFavorites,
    toggleUserFavorite,
    addPostToFavorites,
    removePostFromFavorites,
    togglePostFavorite
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFavorites, import.meta.hot))
}
